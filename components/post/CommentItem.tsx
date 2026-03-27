'use client'

import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { CommentVoteButtons } from "./CommentVoteButtons"
import { CommentComposer } from "./CommentComposer"

// Pure data type used to build the comment tree (stored in nodeMap, passed around as data)
export type CommentItemProps = {
    id: string
    postId: string
    content: string
    createdAt: Date
    isEdited: boolean
    author: { name: string; username: string | null }
    score: number
    currentUserVote: "UP" | "DOWN" | null
    replies?: CommentItemProps[]
}

// UI props: data + rendering context that is NOT part of the tree data
type Props = CommentItemProps & {
    isReply?: boolean
    isAuthenticated: boolean
}

export const CommentItem = ({ id, postId, content, createdAt, isEdited, author, score, currentUserVote, replies, isReply, isAuthenticated }: Props) => {
    const [showReply, setShowReply] = useState(false)

    return (
        <div className={isReply ? "ml-6 border-l pl-4" : ""}>
            <div className="py-3 space-y-1">
                {/* Author + date row */}
                <div className="flex items-center gap-2 text-sm">
                    {author.username ? (
                        <Link href={`/${author.username}`} className="font-medium hover:underline">
                            @{author.username}
                        </Link>
                    ) : (
                        <span className="font-medium">{author.name}</span>
                    )}
                    <span className="text-muted-foreground">—</span>
                    <span className="text-muted-foreground">{formatDate(createdAt)}</span>
                    {isEdited && <span className="text-xs text-muted-foreground">(edited)</span>}
                </div>

                {/* Content + vote buttons */}
                <div className="flex items-start justify-between gap-4">
                    <p className="text-sm whitespace-pre-wrap">{content}</p>
                    <CommentVoteButtons
                        commentId={id}
                        score={score}
                        currentUserVote={currentUserVote}
                    />
                </div>

                {/* Reply / Cancel toggle — only shown to authenticated users */}
                {isAuthenticated && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowReply(v => !v)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showReply ? 'Cancel' : 'Reply'}
                        </button>
                    </div>
                )}

                {/* Inline reply composer */}
                {/* TODO: after submit the new reply won't appear until the page is refreshed (Server Component limitation) */}
                {showReply && (
                    <CommentComposer
                        postId={postId}
                        parentCommentId={id}
                        onSuccess={() => setShowReply(false)}
                    />
                )}
            </div>

            {/* Replies (recursive) */}
            {replies && replies.length > 0 && (
                <div className="divide-y">
                    {replies.map(reply => (
                        <CommentItem key={reply.id} {...reply} isReply isAuthenticated={isAuthenticated} />
                    ))}
                </div>
            )}
        </div>
    )
}
