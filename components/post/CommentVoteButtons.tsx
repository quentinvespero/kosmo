'use client'

import { VoteButtons } from "@/components/VoteButtons"
import { voteComment } from "@/lib/actions/post"

interface Props {
    commentId: string
    score: number
    currentUserVote: "UP" | "DOWN" | null
}

export const CommentVoteButtons = ({ commentId, score, currentUserVote }: Props) => (
    <VoteButtons
        score={score}
        currentUserVote={currentUserVote}
        onVote={(type) => voteComment({ commentId, type })}
    />
)
