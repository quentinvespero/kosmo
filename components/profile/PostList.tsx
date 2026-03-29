import { PostItem } from "./PostItem"

type Post = {
    id: string
    content: string
    createdAt: Date
    authorId: string
    isSubscribersOnly: boolean
    _count: { comments: number; votes: number }
    tags: { name: string }[]
    author: { name: string; username: string | null }
}

type Props = {
    posts: Post[]
    isOwnProfile: boolean
    currentUserId: string | null
}

export const PostList = ({ posts, isOwnProfile, currentUserId }: Props) => {
    if (posts.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-8 text-center">
                {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
            </p>
        )
    }

    return (
        <div className="divide-y">
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                    isOwnProfile={isOwnProfile}
                    isOwner={post.authorId === currentUserId}
                    author={post.author}
                />
            ))}
        </div>
    )
}
