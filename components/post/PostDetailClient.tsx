'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
    const searchParams = useSearchParams()
    const [isEditing, setIsEditing] = useState(() => searchParams.get('edit') === 'true')

    useEffect(() => {
        if (searchParams.get('edit') === 'true') {
            window.history.replaceState(null, '', `/${post.author.username}/${post.id}`)
        }
    }, [])

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
            <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                <span>{formatDate(post.createdAt)}</span>
                {isOwnProfile && post.isSubscribersOnly && (
                    <Badge variant="secondary" className="text-xs py-0">
                        Subscribers only
                    </Badge>
                )}
                {post.tags.map(tag => (
                    <Badge key={tag.name} variant="secondary" className="text-xs py-0">
                        {tag.name}
                    </Badge>
                ))}
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
