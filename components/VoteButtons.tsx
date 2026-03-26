'use client'

import { useState, useTransition } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface VoteButtonsProps {
    score: number
    currentUserVote: "UP" | "DOWN" | null
    // onVote resolves after the server action completes; error field signals failure
    onVote: (type: "UP" | "DOWN") => Promise<{ error?: string } | { success: true }>
}

type VoteType = "UP" | "DOWN"

const computeNewState = (
    prev: { score: number; currentUserVote: VoteType | null },
    clicked: VoteType
) => {
    if (prev.currentUserVote === clicked) {
        // Toggle off the same vote
        return {
            score: prev.score + (clicked === "UP" ? -1 : 1),
            currentUserVote: null as VoteType | null,
        }
    }
    // Remove previous vote impact (if any), then add the new vote
    const removePrev = prev.currentUserVote === null ? 0 : prev.currentUserVote === "UP" ? -1 : 1
    return {
        score: prev.score + (clicked === "UP" ? 1 : -1) + removePrev,
        currentUserVote: clicked as VoteType | null,
    }
}

export const VoteButtons = ({ score, currentUserVote, onVote }: VoteButtonsProps) => {
    // Initialized from props on first mount only — not affected by RSC re-renders mid-transition,
    // which is what caused the useOptimistic flicker bug
    const [voteState, setVoteState] = useState({ score, currentUserVote })
    const [isPending, startTransition] = useTransition()

    const handleVote = (type: VoteType) => {
        const prev = voteState
        // Apply new state immediately for instant feedback
        setVoteState(computeNewState(voteState, type))

        startTransition(async () => {
            const result = await onVote(type)
            if ("error" in result && result.error) {
                // Revert to the state before the click
                setVoteState(prev)
                toast.error("Failed to register vote")
            }
        })
    }

    return (
        <div className="flex items-center gap-1 shrink-0">
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${voteState.currentUserVote === "UP" ? "text-orange-500" : ""}`}
                onClick={() => handleVote("UP")}
                disabled={isPending}
                aria-label="Upvote"
            >
                <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium tabular-nums w-6 text-center">
                {voteState.score}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${voteState.currentUserVote === "DOWN" ? "text-blue-500" : ""}`}
                onClick={() => handleVote("DOWN")}
                disabled={isPending}
                aria-label="Downvote"
            >
                <ChevronDown className="h-4 w-4" />
            </Button>
        </div>
    )
}
