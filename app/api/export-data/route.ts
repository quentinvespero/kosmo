import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { EXPORT_COOLDOWN_MS } from "@/lib/constants"
import { headers } from "next/headers"

export const GET = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

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
        try {
            const { lastDataExportAt } = await prisma.user.findUniqueOrThrow({
                where: { id: session.user.id },
                select: { lastDataExportAt: true }
            })
            // lastDataExportAt is guaranteed non-null here: updated === 0 means the IS NULL branch didn't match
            const msLeft = lastDataExportAt!.getTime() + EXPORT_COOLDOWN_MS - Date.now()
            const minutesLeft = Math.max(1, Math.ceil(msLeft / 60000))
            return Response.json(
                {
                    error: `You can export your data once per hour. Try again in ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}.`,
                    lastExportedAt: lastDataExportAt!.toISOString(),
                },
                {
                    status: 429,
                    headers: { 'Retry-After': String(Math.ceil(msLeft / 1000)) },
                }
            )
        } catch {
            return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
        }
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

        if (!data) return Response.json({ error: 'User not found' }, { status: 404 })

        const date = new Date().toISOString().split('T')[0]
        return new Response(JSON.stringify(data, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="kosmo-data-export-${date}.json"`,
            }
        })
    } catch {
        // Reset so the user isn't locked out for an hour due to a transient error
        await prisma.user.update({
            where: { id: session.user.id },
            data: { lastDataExportAt: null }
        }).catch((e) => console.error('[export-data] failed to reset lastDataExportAt:', e))
        return Response.json({ error: 'Failed to export data. Please try again.' }, { status: 500 })
    }
}
