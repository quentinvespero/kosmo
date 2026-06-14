import { PostItem } from "@/components/post/PostItem"
import prisma from "@/lib/prisma"

type Post = {
    id: string
    content: string
    createdAt: Date
    authorId: string
    isSubscribersOnly: boolean
    _count: { comments: number }
    tags: { name: string }[]
    author: { name: string; username: string | null; image: string | null }
}

type Props = {
    posts: Post[]
    isOwnProfile: boolean
    currentUserId: string | null
}

export const PostList = async ({ posts, isOwnProfile, currentUserId }: Props) => {
    if (posts.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-8 text-center">
                {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
            </p>
        )
    }

    // Fetch vote data for all posts (score is public; currentUserVote only set when authenticated)
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
        if (currentUserId && v.userId === currentUserId) entry.currentUserVote = v.type as 'UP' | 'DOWN'
    })

    return (
        <div className="divide-y">
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                    isOwnProfile={isOwnProfile}
                    isOwner={post.authorId === currentUserId}
                    author={post.author}
                    voteData={voteDataMap.get(post.id)!} // safe: map is pre-populated from the same postIds array
                    isAuthenticated={!!currentUserId}
                />
            ))}
        </div>
    )
}
