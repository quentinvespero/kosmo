import { CommentItem, type CommentItemProps } from "./CommentItem"

interface Props {
    comments: CommentItemProps[]
    isAuthenticated: boolean
    currentUserId: string | null
}

export const CommentList = ({ comments, isAuthenticated, currentUserId }: Props) => {
    if (comments.length === 0) {
        return (
            <p className="text-center text-sm text-muted-foreground py-8">
                No comments yet. Be the first to comment!
            </p>
        )
    }

    return (
        <div className="divide-y">
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    {...comment}
                    isAuthenticated={isAuthenticated}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    )
}
