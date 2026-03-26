import { z } from "zod"

export const createFeedbackSchema = z.object({
    type: z.enum(["BUG", "FEATURE_REQUEST", "GENERAL"]),
    content: z.string()
        .min(10, "Please provide at least 10 characters")
        .max(1000, "Feedback must be at most 1000 characters"),
    showUsername: z.boolean(),
})

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>

export const voteFeedbackSchema = z.object({
    feedbackId: z.cuid(),
    type: z.enum(["UP", "DOWN"]),
})

export type VoteFeedbackInput = z.infer<typeof voteFeedbackSchema>
