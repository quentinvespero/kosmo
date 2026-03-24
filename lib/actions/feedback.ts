'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { createFeedbackSchema, type CreateFeedbackInput } from "@/lib/schemas/FeedbackSchemas"
import { headers } from "next/headers"

export const submitFeedback = async (data: CreateFeedbackInput) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = createFeedbackSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    await prisma.feedback.create({
        data: {
            userId: session.user.id,
            type: parsed.data.type,
            content: parsed.data.content,
        }
    })

    return { success: true as const }
}
