import { RoadmapStatus, FeedbackType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { FEEDBACK_TYPE_LABELS } from "@/lib/roadmap"
import { RoadmapDeleteButton } from "./RoadmapDeleteButton"
import { RoadmapItemDialog, type AvailableFeedback } from "./RoadmapItemDialog"

interface LinkedFeedback {
    id: string
    content: string
    type: FeedbackType
}

interface Props {
    id: string
    title: string
    description: string | null
    status: RoadmapStatus
    feedbackId: string | null
    feedback: LinkedFeedback | null
    isTeamMember: boolean
    availableFeedbacks: AvailableFeedback[]
}

export const RoadmapItemCard = ({
    id,
    title,
    description,
    status,
    feedbackId,
    feedback,
    isTeamMember,
    availableFeedbacks,
}: Props) => (
    <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm leading-snug">{title}</p>

            {/* Team member controls */}
            {isTeamMember && (
                <div className="flex items-center gap-0.5 shrink-0">
                    <RoadmapItemDialog
                        defaultStatus={status}
                        availableFeedbacks={availableFeedbacks}
                        existingItem={{ id, title, description, status, feedbackId }}
                        linkedFeedback={feedback}
                    />
                    <RoadmapDeleteButton id={id} />
                </div>
            )}
        </div>

        {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}

        {/* Linked feedback snippet */}
        {feedback && (
            <div className="mt-1 rounded-md bg-muted/50 px-3 py-2 space-y-1">
                <Badge variant="secondary" className="text-xs">
                    {FEEDBACK_TYPE_LABELS[feedback.type]}
                </Badge>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {feedback.content}
                </p>
            </div>
        )}
    </div>
)
