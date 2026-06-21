import prisma from "@/lib/prisma"

/**
 * Whether `userId` is allowed to view the post `postId`.
 *
 * Mirrors the visibility rules enforced on the post detail page
 * (app/(app)/[handle]/[postId]/page.tsx):
 *   - the author can always view their own post
 *   - subscriber-only posts are visible to the author only (until subscriptions ship)
 *   - posts on a private profile require an ACCEPTED follow relationship
 *   - everything else (public profile, non-subscriber post) is public
 *
 * `userId` is null for unauthenticated callers.
 */
export const canViewPost = async (postId: string, userId: string | null): Promise<boolean> => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            isSubscribersOnly: true,
            author: {
                select: {
                    id: true,
                    userPreferences: { select: { isPrivate: true } },
                },
            },
        },
    })
    if (!post) return false

    // The author can always see their own post
    if (userId && userId === post.author.id) return true

    // Subscriber-only posts are owner-only until the subscription model exists
    if (post.isSubscribersOnly) return false

    // Check whether post's author is private. Return True if not
    const isPrivate = post.author.userPreferences?.isPrivate ?? false
    if (!isPrivate) return true

    // Private profile → require an accepted follow relationship
    if (!userId) return false
    const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId: post.author.id } },
        select: { status: true },
    })
    return follow?.status === 'ACCEPTED'
}
