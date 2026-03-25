'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import {
    createFeedbackSchema,
    type CreateFeedbackInput,
    voteFeedbackSchema,
    type VoteFeedbackInput,
} from "@/lib/schemas/FeedbackSchemas"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export const submitFeedback = async (data: CreateFeedbackInput) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = createFeedbackSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const feedback = await prisma.feedback.create({
        data: {
            userId: session.user.id,
            type: parsed.data.type,
            content: parsed.data.content,
            showUsername: parsed.data.showUsername,
        }
    })

    // Auto-upvote: like Reddit, the author's feedback starts with their own upvote
    await prisma.feedbackVote.create({
        data: { feedbackId: feedback.id, userId: session.user.id, type: "UP" },
    })

    revalidatePath('/feedback')
    return { success: true as const }
}

export const voteFeedback = async (data: VoteFeedbackInput) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = voteFeedbackSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const { feedbackId, type } = parsed.data
    const userId = session.user.id

    try {
        await prisma.$transaction(async (tx) => {
            const existing = await tx.feedbackVote.findUnique({
                where: { userId_feedbackId: { userId, feedbackId } },
                select: { id: true, type: true },
            })

            if (existing) {
                if (existing.type === type) {
                    // Same vote clicked again → toggle off
                    await tx.feedbackVote.delete({ where: { id: existing.id } })
                } else {
                    // Opposite vote → switch
                    await tx.feedbackVote.update({
                        where: { id: existing.id },
                        data: { type },
                    })
                }
            } else {
                await tx.feedbackVote.create({
                    data: { userId, feedbackId, type },
                })
            }
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    } catch {
        return { error: 'Server error' as const }
    }

    revalidatePath('/feedback')
    return { success: true as const }
}
