'use client'

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { CommentVoteButtons } from "./CommentVoteButtons"
import { CommentComposer } from "./CommentComposer"
import { CommentActionsMenu } from "./CommentActionsMenu"
import { editComment } from "@/lib/actions/post"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Pure data type used to build the comment tree (stored in nodeMap, passed around as data)
export type CommentItemProps = {
    id: string
    postId: string
    content: string
    createdAt: Date
    isEdited: boolean
    authorId: string
    author: { name: string; username: string | null }
    score: number
    currentUserVote: "UP" | "DOWN" | null
    replies?: CommentItemProps[]
}

// UI props: data + rendering context that is NOT part of the tree data
type Props = CommentItemProps & {
    isReply?: boolean
    isAuthenticated: boolean
    currentUserId: string | null
}

export const CommentItem = ({ id, postId, content, createdAt, authorId, author, score, currentUserVote, replies, isReply, isAuthenticated, currentUserId }: Props) => {
    const router = useRouter()
    const [showReply, setShowReply] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(content)
    const [isPending, startTransition] = useTransition()

    const isOwner = !!currentUserId && authorId === currentUserId

    const handleSaveEdit = () => {
        if (!editContent.trim()) return
        startTransition(async () => {
            const toastId = toast.loading('Saving...')
            const result = await editComment({ commentId: id, content: editContent })
            if ('error' in result) {
                toast.error('Failed to save comment', { id: toastId })
                return
            }
            toast.success('Comment saved', { id: toastId })
            setIsEditing(false)
            router.refresh()
        })
    }

    return (
        <div className={isReply ? "ml-6 border-l pl-4" : ""}>
            <div className="py-3 space-y-1">
                {/* Author + date row */}
                <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        {author.username ? (
                            <Link href={`/${author.username}`} className="font-medium hover:underline">
                                @{author.username}
                            </Link>
                        ) : (
                            <span className="font-medium">{author.name}</span>
                        )}
                        <span className="text-muted-foreground">—</span>
                        <span className="text-muted-foreground">{formatDate(createdAt)}</span>
                    </div>
                    {isOwner && !isEditing && (
                        <CommentActionsMenu
                            commentId={id}
                            onEditClick={() => {
                                setEditContent(content)
                                setIsEditing(true)
                            }}
                        />
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="min-h-16 text-sm resize-none"
                            maxLength={2000}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault()
                                    handleSaveEdit()
                                }
                                if (e.key === 'Escape') setIsEditing(false)
                            }}
                            autoFocus
                        />
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={handleSaveEdit} disabled={isPending || !editContent.trim()}>
                                Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isPending}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Content + vote buttons */
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-sm whitespace-pre-wrap">{content}</p>
                        <CommentVoteButtons
                            commentId={id}
                            score={score}
                            currentUserVote={currentUserVote}
                        />
                    </div>
                )}

                {/* Reply / Cancel toggle — only shown to authenticated users when not editing */}
                {isAuthenticated && !isEditing && (
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
                        <CommentItem
                            key={reply.id}
                            {...reply}
                            isReply
                            isAuthenticated={isAuthenticated}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
