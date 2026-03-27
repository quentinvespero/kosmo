'use client'

import { VoteButtons } from "@/components/VoteButtons"
import { votePost } from "@/lib/actions/post"

interface Props {
    postId: string
    score: number
    currentUserVote: "UP" | "DOWN" | null
}

export const PostVoteButtons = ({ postId, score, currentUserVote }: Props) => (
    <VoteButtons
        score={score}
        currentUserVote={currentUserVote}
        onVote={(type) => votePost({ postId, type })}
    />
)
