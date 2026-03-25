'use client'

import { useOptimistic, useTransition } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { voteFeedback } from "@/lib/actions/feedback"
import { toast } from "sonner"

interface Props {
    feedbackId: string
    score: number
    currentUserVote: "UP" | "DOWN" | null
}

type VoteType = "UP" | "DOWN"

// Compute the optimistic state after the user clicks a vote button
const computeOptimistic = (
    prev: { score: number; currentUserVote: VoteType | null },
    clicked: VoteType
) => {
    if (prev.currentUserVote === clicked) {
        // Toggle off
        return {
            score: prev.score + (clicked === "UP" ? -1 : 1),
            currentUserVote: null,
        }
    }
    // Remove previous vote impact (if any), then add new vote
    const removePrev = prev.currentUserVote === null ? 0 : prev.currentUserVote === "UP" ? -1 : 1
    return {
        score: prev.score + (clicked === "UP" ? 1 : -1) + removePrev,
        currentUserVote: clicked,
    }
}

export const FeedbackVoteButtons = ({ feedbackId, score, currentUserVote }: Props) => {
    const [optimistic, setOptimistic] = useOptimistic(
        { score, currentUserVote },
        computeOptimistic
    )
    const [isPending, startTransition] = useTransition()

    const handleVote = (type: VoteType) => {
        startTransition(async () => {
            setOptimistic(type)
            const result = await voteFeedback({ feedbackId, type })
            if (result.error) toast.error("Failed to register vote")
        })
    }

    return (
        <div className="flex items-center gap-1 shrink-0">
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${optimistic.currentUserVote === "UP" ? "text-orange-500" : ""}`}
                onClick={() => handleVote("UP")}
                disabled={isPending}
                aria-label="Upvote"
            >
                <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium tabular-nums w-6 text-center">
                {optimistic.score}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${optimistic.currentUserVote === "DOWN" ? "text-blue-500" : ""}`}
                onClick={() => handleVote("DOWN")}
                disabled={isPending}
                aria-label="Downvote"
            >
                <ChevronDown className="h-4 w-4" />
            </Button>
        </div>
    )
}
