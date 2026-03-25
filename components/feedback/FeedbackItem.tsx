import Link from "next/link"
import { FeedbackVoteButtons } from "./FeedbackVoteButtons"

interface Props {
    id: string
    username: string | null
    name: string | null
    showUsername: boolean
    content: string
    createdAt: Date
    score: number
    currentUserVote: "UP" | "DOWN" | null
}

// Format date as "Mar 20, 2026"
const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const FeedbackItem = ({ id, username, name, showUsername, content, createdAt, score, currentUserVote }: Props) => (
    <div className="py-4 flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {!showUsername ? (
                    <span className="font-medium text-foreground">Anonymous</span>
                ) : username ? (
                    <Link href={`/@${username}`} className="font-medium text-foreground hover:underline">
                        @{username}
                    </Link>
                ) : (
                    // Deleted user fallback
                    <span className="font-medium text-foreground">{name ?? "Unknown"}</span>
                )}
                <span>—</span>
                <span>{formatDate(createdAt)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <FeedbackVoteButtons feedbackId={id} score={score} currentUserVote={currentUserVote} />
    </div>
)
