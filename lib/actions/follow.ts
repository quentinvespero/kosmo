'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { followActionSchema, followRequestSchema } from "@/lib/schemas/FollowSchemas"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export const followUser = async (targetUserId: string, targetUsername: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = followActionSchema.safeParse({ targetUserId, targetUsername })
    if (!parsed.success) return { error: 'Invalid data' as const }
    // rename to match the Prisma schema (followingId) and the revalidate path (username)
    const { targetUserId: followingId, targetUsername: username } = parsed.data

    const currentUserId = session.user.id
    if (currentUserId === followingId) return { error: 'Cannot follow yourself' as const }

    // Follow request is PENDING for private profiles, ACCEPTED immediately for public ones
    const targetPrefs = await prisma.userPreferences.findUnique({
        where: { userId: followingId },
        select: { isPrivate: true }
    })
    const status = (targetPrefs?.isPrivate ? 'PENDING' : 'ACCEPTED') as 'PENDING' | 'ACCEPTED'

    await prisma.follow.upsert({
        where: { followerId_followingId: { followerId: currentUserId, followingId } },
        create: { followerId: currentUserId, followingId, status },
        update: {} // already exists — no-op
    })

    revalidatePath(`/${username}`)
    return { success: true as const, status }
}

export const unfollowUser = async (targetUserId: string, targetUsername: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = followActionSchema.safeParse({ targetUserId, targetUsername })
    if (!parsed.success) return { error: 'Invalid data' as const }
    const { targetUserId: followingId, targetUsername: username } = parsed.data

    // deleteMany instead of delete to avoid throwing if the record doesn't exist
    await prisma.follow.deleteMany({
        where: { followerId: session.user.id, followingId }
    })

    revalidatePath(`/${username}`)
    return { success: true as const }
}

// Called by the profile owner to accept an incoming follow request
export const acceptFollowRequest = async (followerId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = followRequestSchema.safeParse({ followerId })
    if (!parsed.success) return { error: 'Invalid data' as const }

    // updateMany (not update) so a missing/already-handled request returns a clean
    // error instead of throwing. Scoped to the current user + a PENDING request.
    const result = await prisma.follow.updateMany({
        where: { followerId: parsed.data.followerId, followingId: session.user.id, status: 'PENDING' },
        data: { status: 'ACCEPTED' }
    })
    if (result.count === 0) return { error: 'Not found' as const }

    return { success: true as const }
}

// Called by the profile owner to reject/remove an incoming follow request
export const rejectFollowRequest = async (followerId: string) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = followRequestSchema.safeParse({ followerId })
    if (!parsed.success) return { error: 'Invalid data' as const }

    // deleteMany (not delete) so a missing request doesn't throw an unhandled error
    await prisma.follow.deleteMany({
        where: { followerId: parsed.data.followerId, followingId: session.user.id }
    })

    return { success: true as const }
}
