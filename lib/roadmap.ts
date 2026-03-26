import { FeedbackType, RoadmapStatus } from "@prisma/client"

export const ROADMAP_STATUSES = ["ACTIVE", "PLANNED", "LAUNCHED"] as const

export const STATUS_META: Record<RoadmapStatus, { label: string; description: string }> = {
    ACTIVE:   { label: "In Progress", description: "We're actively working on this" },
    PLANNED:  { label: "Planned",     description: "Coming soon" },
    LAUNCHED: { label: "Launched",    description: "Shipped and live" },
}

export const FEEDBACK_TYPE_LABELS: Record<FeedbackType, string> = {
    BUG:             "Bug",
    FEATURE_REQUEST: "Feature request",
    GENERAL:         "General",
}
