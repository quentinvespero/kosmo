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
