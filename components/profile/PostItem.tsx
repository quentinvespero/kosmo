import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from "lucide-react"

type Post = {
    id: string
    content: string
    createdAt: Date
    isSubscribersOnly: boolean
    isEdited: boolean
    _count: { comments: number; votes: number }
    tags: { name: string }[]
}

type Props = {
    post: Post
    isOwnProfile: boolean
    author: { name: string; username: string | null }
}

const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const PostItem = ({ post, isOwnProfile, author }: Props) => {
    // Truncate long posts
    const contentPreview = post.content.length > 280
        ? post.content.slice(0, 280) + '…'
        : post.content

    return (
        <article className="py-4 space-y-2">
            {/* Author */}
            <div className="text-sm font-medium">
                <a href={`/${author.username ?? ''}`} className="hover:underline">
                    {author.name}
                </a>
                <span className="text-muted-foreground"> @{author.username ?? '—'}</span>
            </div>

            {/* Date + subscribers-only badge (only on own profile) */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDate(post.createdAt)}</span>
                {post.isEdited && <span className="text-xs">(edited)</span>}
                {isOwnProfile && post.isSubscribersOnly && (
                    <Badge variant="secondary" className="text-xs py-0">
                        Subscribers only
                    </Badge>
                )}
            </div>

            <p className="text-sm whitespace-pre-wrap">{contentPreview}</p>

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {post.tags.map(tag => (
                        <Badge key={tag.name} variant="secondary" className="text-xs">
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Footer: votes + comments */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    {post._count.votes}
                </span>
                <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    {post._count.comments}
                </span>
            </div>
        </article>
    )
}
