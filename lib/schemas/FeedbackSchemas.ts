import { z } from "zod"

export const createFeedbackSchema = z.object({
    type: z.enum(["BUG", "FEATURE_REQUEST", "GENERAL"]),
    content: z.string()
        .min(10, "Please provide at least 10 characters")
        .max(1000, "Feedback must be at most 1000 characters"),
})

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>
