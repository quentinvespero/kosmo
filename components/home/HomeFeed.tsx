import prisma from "@/lib/prisma"
import { PostItem } from "@/components/profile/PostItem"

// Temporary feed: shows recent public posts from public profiles.
// Will be replaced by a proper followed-users feed once the follow system is complete.
const HomeFeed = async () => {
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

    return (
        <div className="divide-y">
            {posts.map(post => (
                <PostItem key={post.id} post={post} isOwnProfile={false} author={post.author as { name: string; username: string }} />
            ))}
        </div>
    )
}

export default HomeFeed
