'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { PostVoteButtons } from "@/components/post/PostVoteButtons"
import { PostActionsMenu } from "@/components/post/PostActionsMenu"
import { PostEditForm } from "@/components/post/PostEditForm"

type Props = {
    post: {
        id: string
        title: string | null
        content: string
        createdAt: Date
        isSubscribersOnly: boolean
        tags: { name: string }[]
        author: { username: string | null; name: string }
    }
    isOwner: boolean
    isOwnProfile: boolean
    postScore: number
    currentUserVote: 'UP' | 'DOWN' | null
}

export const PostDetailClient = ({ post, isOwner, isOwnProfile, postScore, currentUserVote }: Props) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    return (
        <article className="space-y-3">
            {/* Author + actions row */}
            <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium">
                    {post.author.username ? (
                        <a href={`/${post.author.username}`} className="hover:underline">
                            {post.author.name}
                        </a>
                    ) : (
                        <span>{post.author.name}</span>
                    )}
                    <span className="text-muted-foreground"> @{post.author.username ?? '—'}</span>
                </div>
                {isOwner && !isEditing && (
                    <PostActionsMenu
                        postId={post.id}
                        authorUsername={post.author.username ?? ''}
                        onEditClick={() => setIsEditing(true)}
                    />
                )}
            </div>

            {/* Date + badges */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDate(post.createdAt)}</span>
                {isOwnProfile && post.isSubscribersOnly && (
                    <Badge variant="secondary" className="text-xs py-0">
                        Subscribers only
                    </Badge>
                )}
            </div>

            {isEditing ? (
                <PostEditForm
                    postId={post.id}
                    initialContent={post.content}
                    onSave={() => { router.refresh(); setIsEditing(false) }}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    {post.title && <h1 className="text-lg font-semibold">{post.title}</h1>}

                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {post.tags.map(tag => (
                                <Badge key={tag.name} variant="secondary" className="text-xs">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <PostVoteButtons
                        postId={post.id}
                        score={postScore}
                        currentUserVote={currentUserVote}
                    />
                </>
            )}
        </article>
    )
}
