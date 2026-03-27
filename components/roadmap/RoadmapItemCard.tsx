import { RoadmapStatus, FeedbackType } from "@prisma/client"
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
        {feedback && <hr className="border-border" />}
        {feedback && (
            <div className="flex items-center gap-1.5 min-w-0">
                <span className={`text-xs font-medium px-3.5 py-[.1rem] rounded-full shrink-0 bg-neutral-700`}>
                    {FEEDBACK_TYPE_LABELS[feedback.type]}
                </span>
                <p className="text-xs text-muted-foreground truncate">
                    "{feedback.content}"
                </p>
            </div>
        )}
    </div>
)
