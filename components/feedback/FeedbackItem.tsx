import Link from "next/link"
import { RoadmapStatus } from "@prisma/client"
import { formatDate } from "@/lib/utils"
import { STATUS_META } from "@/lib/roadmap"
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
    roadmapItem: { id: string; title: string; status: RoadmapStatus } | null
}

export const FeedbackItem = ({ id, username, name, showUsername, content, createdAt, score, currentUserVote, roadmapItem }: Props) => (
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
            {roadmapItem && (
                <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted hover:bg-muted/80 px-2 py-0.5 rounded-md"
                >
                    <span className="font-medium">{STATUS_META[roadmapItem.status].label}</span>
                    <span>·</span>
                    <span>{roadmapItem.title}</span>
                </Link>
            )}
        </div>
        <FeedbackVoteButtons feedbackId={id} score={score} currentUserVote={currentUserVote} />
    </div>
)
