import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { PostVoteButtons } from "@/components/post/PostVoteButtons"
import { PostActionsMenu } from "@/components/post/PostActionsMenu"

type Post = {
    id: string
    content: string
    createdAt: Date
    authorId: string
    isSubscribersOnly: boolean
    _count: { comments: number; votes: number }
    tags: { name: string }[]
}

type Props = {
    post: Post
    isOwnProfile: boolean
    isOwner: boolean
    author: { name: string; username: string | null; image: string | null }
    voteData?: { score: number; currentUserVote: 'UP' | 'DOWN' | null }
    context?: 'home' | 'profile'
}

export const PostItem = ({ post, isOwnProfile, isOwner, author, voteData, context = 'profile' }: Props) => {
    // Truncate long posts
    const contentPreview = post.content.length > 280
        ? post.content.slice(0, 280) + '…'
        : post.content

    return (
        <article className="relative flex gap-3 py-4 px-4 transition-colors hover:bg-muted/50 cursor-pointer">
            {/* Stretch link: clicking anywhere on the card navigates to the post detail */}
            <Link
                href={`/${author.username}/${post.id}`}
                className="absolute inset-0"
                aria-label={`View post by ${author.name}`}
            />

            {/* Left column: avatar — elevated above the overlay so it remains clickable */}
            <div className="shrink-0 pt-0.5">
                {author.username ? (
                    <a href={`/${author.username}`} className="relative z-10 block">
                        <Avatar size="lg">
                            <AvatarImage src={author.image ?? undefined} alt={author.name} />
                            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                        </Avatar>
                    </a>
                ) : (
                    <Avatar size="lg">
                        <AvatarImage src={author.image ?? undefined} alt={author.name} />
                        <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                    </Avatar>
                )}
            </div>

            {/* Right column: all content */}
            <div className="flex-1 min-w-0 space-y-1.5">
                {/* Author + date + actions — elevated above the overlay */}
                <div className="flex items-center gap-1.5 text-sm flex-wrap">
                    {author.username ? (
                        <a href={`/${author.username}`} className="relative z-10 font-semibold hover:underline">
                            {author.name}
                        </a>
                    ) : (
                        <span className="font-semibold">{author.name}</span>
                    )}
                    <span className="text-muted-foreground">@{author.username ?? '—'}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{formatDate(post.createdAt)}</span>
                    {isOwnProfile && post.isSubscribersOnly && (
                        <Badge variant="secondary" className="text-xs py-0">
                            Subscribers only
                        </Badge>
                    )}
                    {isOwner && (
                        <div className="relative z-10 ml-auto">
                            <PostActionsMenu
                                postId={post.id}
                                authorUsername={author.username ?? ''}
                                context={context}
                            />
                        </div>
                    )}
                </div>

                <p className="text-sm whitespace-pre-wrap break-words">{contentPreview}</p>

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

                {/* Footer: votes + comments — elevated above the stretch-link overlay */}
                <div className="relative z-10 inline-flex items-center gap-3 text-sm text-muted-foreground bg-muted/60 rounded-full px-3 py-[.2rem]">
                    {voteData ? (
                        <PostVoteButtons
                            postId={post.id}
                            score={voteData.score}
                            currentUserVote={voteData.currentUserVote}
                        />
                    ) : (
                        <span className="flex items-center gap-1">
                            <ThumbsUp size={14} />
                            {post._count.votes}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {post._count.comments}
                    </span>
                </div>
            </div>
        </article>
    )
}
