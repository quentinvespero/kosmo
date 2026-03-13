'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export const followUser = async (targetUserId: string, targetUsername: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const currentUserId = session.user.id
    if (currentUserId === targetUserId) return { error: 'Cannot follow yourself' as const }

    // Follow request is PENDING for private profiles, ACCEPTED immediately for public ones
    const targetPrefs = await prisma.userPreferences.findUnique({
        where: { userId: targetUserId },
        select: { isPrivate: true }
    })
    const status = (targetPrefs?.isPrivate ? 'PENDING' : 'ACCEPTED') as 'PENDING' | 'ACCEPTED'

    await prisma.follow.upsert({
        where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } },
        create: { followerId: currentUserId, followingId: targetUserId, status },
        update: {} // already exists — no-op
    })

    revalidatePath(`/${targetUsername}`)
    return { success: true as const, status }
}

export const unfollowUser = async (targetUserId: string, targetUsername: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    // deleteMany instead of delete to avoid throwing if the record doesn't exist
    await prisma.follow.deleteMany({
        where: { followerId: session.user.id, followingId: targetUserId }
    })

    revalidatePath(`/${targetUsername}`)
    return { success: true as const }
}

// Called by the profile owner to accept an incoming follow request
export const acceptFollowRequest = async (followerId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    await prisma.follow.update({
        where: {
            followerId_followingId: { followerId, followingId: session.user.id }
        },
        data: { status: 'ACCEPTED' }
    })

    return { success: true as const }
}

// Called by the profile owner to reject/remove an incoming follow request
export const rejectFollowRequest = async (followerId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    await prisma.follow.delete({
        where: {
            followerId_followingId: { followerId, followingId: session.user.id }
        }
    })

    return { success: true as const }
}
