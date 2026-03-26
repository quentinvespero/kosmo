import { RoadmapStatus, FeedbackType } from "@prisma/client"
import { STATUS_META } from "@/lib/roadmap"
import { RoadmapItemCard } from "./RoadmapItemCard"
import { RoadmapItemDialog, type AvailableFeedback } from "./RoadmapItemDialog"

interface RoadmapItem {
    id: string
    title: string
    description: string | null
    status: RoadmapStatus
    feedbackId: string | null
    feedback: {
        id: string
        content: string
        type: FeedbackType
    } | null
}

interface Props {
    status: RoadmapStatus
    items: RoadmapItem[]
    isTeamMember: boolean
    availableFeedbacks: AvailableFeedback[]
}

// Color accent per status column
const STATUS_ACCENT: Record<RoadmapStatus, string> = {
    ACTIVE:   "bg-blue-500",
    PLANNED:  "bg-amber-500",
    LAUNCHED: "bg-green-500",
}

export const RoadmapColumn = ({ status, items, isTeamMember, availableFeedbacks }: Props) => {
    const meta = STATUS_META[status]

    return (
        <div className="flex flex-col gap-3">
            {/* Column header */}
            <div className="flex items-center gap-2 pb-1 border-b">
                <span className={`h-2 w-2 rounded-full ${STATUS_ACCENT[status]}`} />
                <h2 className="font-semibold text-sm">{meta.label}</h2>
                <span className="ml-auto text-xs text-muted-foreground">
                    {items.length}
                </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <RoadmapItemCard
                        key={item.id}
                        {...item}
                        isTeamMember={isTeamMember}
                        availableFeedbacks={availableFeedbacks}
                    />
                ))}

                {items.length === 0 && !isTeamMember && (
                    <p className="text-xs text-muted-foreground text-center py-6">Nothing here yet</p>
                )}
            </div>

            {/* Add button — team members only */}
            {isTeamMember && (
                <RoadmapItemDialog
                    defaultStatus={status}
                    availableFeedbacks={availableFeedbacks}
                />
            )}
        </div>
    )
}
