'use client'

import { VoteButtons } from "@/components/VoteButtons"
import { voteFeedback } from "@/lib/actions/feedback"

interface Props {
    feedbackId: string
    score: number
    currentUserVote: "UP" | "DOWN" | null
}

export const FeedbackVoteButtons = ({ feedbackId, score, currentUserVote }: Props) => (
    <VoteButtons
        score={score}
        currentUserVote={currentUserVote}
        onVote={(type) => voteFeedback({ feedbackId, type })}
    />
)
