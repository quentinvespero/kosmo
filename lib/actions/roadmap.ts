'use server'

import { auth as betterAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import {
    createRoadmapItemSchema,
    type CreateRoadmapItemInput,
    updateRoadmapItemSchema,
    type UpdateRoadmapItemInput,
    deleteRoadmapItemSchema,
    type DeleteRoadmapItemInput,
} from "@/lib/schemas/RoadmapSchemas"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

const requireTeamMember = async () => {
    const session = await betterAuth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }
    if (!session.user.isTeamMember) return { error: 'Forbidden' as const }
    return { session }
}

export const createRoadmapItem = async (data: CreateRoadmapItemInput) => {
    const auth = await requireTeamMember()
    if ('error' in auth) return auth

    const parsed = createRoadmapItemSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    await prisma.roadmapItem.create({ data: parsed.data })

    revalidatePath('/roadmap')
    return { success: true as const }
}

export const updateRoadmapItem = async (data: UpdateRoadmapItemInput) => {
    const auth = await requireTeamMember()
    if ('error' in auth) return auth

    const parsed = updateRoadmapItemSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const { id, ...rest } = parsed.data
    await prisma.roadmapItem.update({ where: { id }, data: rest })

    revalidatePath('/roadmap')
    return { success: true as const }
}

export const deleteRoadmapItem = async (data: DeleteRoadmapItemInput) => {
    const auth = await requireTeamMember()
    if ('error' in auth) return auth

    const parsed = deleteRoadmapItemSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    await prisma.roadmapItem.delete({ where: { id: parsed.data.id } })

    revalidatePath('/roadmap')
    return { success: true as const }
}
