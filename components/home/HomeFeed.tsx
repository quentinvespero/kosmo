import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { PostItem } from "@/components/profile/PostItem"

// Temporary feed: shows recent public posts from public profiles.
// Will be replaced by a proper followed-users feed once the follow system is complete.
const HomeFeed = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    const currentUserId = session?.user.id ?? null

    const posts = await prisma.post.findMany({
        where: {
            isSubscribersOnly: false,
            // Exclude posts from users who haven't completed onboarding (no username set)
            author: { username: { not: null } },
            // Exclude posts from users who have explicitly set their profile to private.
            // Users with no UserPreferences row are treated as public (default behavior).
            NOT: {
                author: { userPreferences: { isPrivate: true } }
            },
            // Only profile posts (not in communities) for now
            postCommunities: { none: {} }
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            isSubscribersOnly: true,
            isEdited: true,
            _count: { select: { comments: true, votes: true } },
            tags: { select: { name: true } },
            author: { select: { name: true, username: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    })

    if (posts.length === 0) {
        return (
            <p className="text-center text-sm text-muted-foreground py-12">
                No posts yet. Be the first to post!
            </p>
        )
    }

    // Fetch all votes for these posts in one query, then compute score + currentUserVote per post
    const postIds = posts.map(p => p.id)
    const postVotes = await prisma.vote.findMany({
        where: { postId: { in: postIds } },
        select: { postId: true, type: true, userId: true },
    })

    const voteDataMap = new Map<string, { score: number; currentUserVote: 'UP' | 'DOWN' | null }>()
    postIds.forEach(id => voteDataMap.set(id, { score: 0, currentUserVote: null }))
    postVotes.forEach(v => {
        const entry = voteDataMap.get(v.postId!)!
        entry.score += v.type === 'UP' ? 1 : -1
        if (v.userId === currentUserId) entry.currentUserVote = v.type as 'UP' | 'DOWN'
    })

    return (
        <div className="divide-y">
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                    isOwnProfile={false}
                    author={post.author as { name: string; username: string }}
                    // Only pass vote data (interactive buttons) for authenticated users
                    voteData={currentUserId ? voteDataMap.get(post.id) : undefined}
                />
            ))}
        </div>
    )
}

export default HomeFeed
