import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { CommentVoteButtons } from "./CommentVoteButtons"

export type CommentItemProps = {
    id: string
    content: string
    createdAt: Date
    isEdited: boolean
    author: { name: string; username: string | null }
    score: number
    currentUserVote: "UP" | "DOWN" | null
    replies?: CommentItemProps[]
    isReply?: boolean
}

export const CommentItem = ({ id, content, createdAt, isEdited, author, score, currentUserVote, replies, isReply }: CommentItemProps) => (
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
        </div>

        {/* Replies (recursive) */}
        {replies && replies.length > 0 && (
            <div className="divide-y">
                {replies.map(reply => (
                    <CommentItem key={reply.id} {...reply} isReply />
                ))}
            </div>
        )}
    </div>
)
