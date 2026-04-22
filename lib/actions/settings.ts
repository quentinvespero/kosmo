'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { updateProfileSchema, updateUsernameSchema, updatePrivacySchema } from "@/lib/schemas/SettingsSchemas"

export const updateProfile = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = updateProfileSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const }

    const { name, bio } = parsed.data

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name, bio: bio ?? null }
    })

    revalidatePath(`/${session.user.username}`)
    return { success: true as const }
}

export const updateUsername = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = updateUsernameSchema.safeParse(data)
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid data' as const }

    const { username } = parsed.data

    // Prevent no-op saves
    if (username === session.user.username) return { success: true as const }

    const existing = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
    })
    if (existing) return { error: 'Username already taken' as const }

    const oldUsername = session.user.username

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { username }
        })
    } catch (e: unknown) {
        // Handle race condition where another user claimed the username between our check and update
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
            return { error: 'Username already taken' as const }
        }
        throw e
    }

    if (oldUsername) revalidatePath(`/${oldUsername}`)
    revalidatePath(`/${username}`)
    return { success: true as const }
}

export const deleteAccount = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    // Communities use onDelete: SetNull — isOrphan must be set explicitly before the user row is deleted.
    // Both ops are atomic: if the delete fails, communities are not left orphaned.
    try {
        await prisma.$transaction([
            prisma.community.updateMany({
                where: { ownerId: session.user.id },
                data: { isOrphan: true }
            }),
            prisma.user.delete({ where: { id: session.user.id } })
        ])
    } catch {
        return { error: 'Failed to delete account' as const }
    }

    return { success: true as const }
}

export const EXPORT_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour

export const exportUserData = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    // Atomic check-and-set: prevents race conditions where two concurrent requests
    // both pass the cooldown check before either sets the timestamp.
    const cooldownCutoff = new Date(Date.now() - EXPORT_COOLDOWN_MS)
    const updated = await prisma.$executeRaw`
        UPDATE "user"
        SET "lastDataExportAt" = now()
        WHERE id = ${session.user.id}
        AND ("lastDataExportAt" IS NULL OR "lastDataExportAt" < ${cooldownCutoff})
    `

    if (updated === 0) {
        const { lastDataExportAt } = await prisma.user.findUniqueOrThrow({
            where: { id: session.user.id },
            select: { lastDataExportAt: true }
        })
        // lastDataExportAt is guaranteed non-null here: updated === 0 means the IS NULL branch didn't match
        const msLeft = lastDataExportAt!.getTime() + EXPORT_COOLDOWN_MS - Date.now()
        const minutesLeft = Math.max(1, Math.ceil(msLeft / 60000))
        return { error: `You can export your data once per hour. Try again in ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}.` }
    }

    try {
        const data = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                emailVerified: true,
                username: true,
                bio: true,
                image: true,
                isTeamMember: true,
                createdAt: true,
                updatedAt: true,
                userPreferences: {
                    select: {
                        language: true,
                        isPrivate: true,
                        allowSubscribersOnPrivateProfile: true,
                    }
                },
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        source: true,
                        language: true,
                        isSubscribersOnly: true,
                        isEdited: true,
                        createdAt: true,
                        updatedAt: true,
                        postCommunities: {
                            select: {
                                community: { select: { name: true, slug: true } },
                                isPinned: true,
                            }
                        },
                        tags: { select: { name: true } },
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        source: true,
                        postId: true,
                        parentCommentId: true,
                        isEdited: true,
                        isDeleted: true,
                        createdAt: true,
                    }
                },
                votes: {
                    select: {
                        type: true,
                        postId: true,
                        commentId: true,
                        createdAt: true,
                    }
                },
                drafts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        language: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                communityMemberships: {
                    select: {
                        community: { select: { name: true, slug: true } },
                        role: true,
                        joinedAt: true,
                    }
                },
                feedMembers: {
                    select: {
                        feed: { select: { name: true } },
                        addedAt: true,
                    }
                },
                following: {
                    select: {
                        following: { select: { username: true } },
                        status: true,
                        createdAt: true,
                    }
                },
                followers: {
                    select: {
                        follower: { select: { username: true } },
                        status: true,
                        createdAt: true,
                    }
                },
                feedbacks: {
                    select: {
                        type: true,
                        content: true,
                        showUsername: true,
                        createdAt: true,
                    }
                },
                feedbackVotes: {
                    select: {
                        type: true,
                        feedbackId: true,
                        createdAt: true,
                    }
                },
                ownedCommunities: {
                    select: {
                        name: true,
                        slug: true,
                        description: true,
                        isPublic: true,
                        createdAt: true,
                    }
                },
                ownedFeeds: {
                    select: {
                        name: true,
                        description: true,
                        isPublic: true,
                        createdAt: true,
                    }
                },
                sessions: {
                    select: {
                        ipAddress: true,
                        userAgent: true,
                        createdAt: true,
                        expiresAt: true,
                    }
                },
                accounts: {
                    select: {
                        providerId: true,
                        accountId: true,
                        createdAt: true,
                    }
                },
            }
        })

        if (!data) return { error: 'User not found' as const }

        revalidatePath('/settings/account')
        return { data }
    } catch {
        // Reset so the user isn't locked out for an hour due to a transient error
        await prisma.user.update({
            where: { id: session.user.id },
            data: { lastDataExportAt: null }
        }).catch((e) => console.error('[exportUserData] failed to reset lastDataExportAt:', e))
        return { error: 'Failed to export data' as const }
    }
}

export const updatePrivacy = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = updatePrivacySchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const }

    const { isPrivate, allowSubscribersOnPrivateProfile } = parsed.data

    await prisma.userPreferences.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, isPrivate, allowSubscribersOnPrivateProfile },
        update: { isPrivate, allowSubscribersOnPrivateProfile }
    })

    revalidatePath(`/${session.user.username}`)
    return { success: true as const }
}
