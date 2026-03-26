import { z } from "zod"
import { RoadmapStatus } from "@prisma/client"

const roadmapStatusEnum = z.nativeEnum(RoadmapStatus)

export const createRoadmapItemSchema = z.object({
    title:       z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    description: z.string().max(500, "Description must be 500 characters or less").optional(),
    status:      roadmapStatusEnum,
    feedbackId:  z.string().cuid().optional(),
})

export const updateRoadmapItemSchema = z.object({
    id:          z.string().cuid(),
    title:       z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    status:      roadmapStatusEnum.optional(),
    feedbackId:  z.string().cuid().optional().nullable(),
})

export const deleteRoadmapItemSchema = z.object({
    id: z.string().cuid(),
})

export type CreateRoadmapItemInput = z.infer<typeof createRoadmapItemSchema>
export type UpdateRoadmapItemInput = z.infer<typeof updateRoadmapItemSchema>
export type DeleteRoadmapItemInput = z.infer<typeof deleteRoadmapItemSchema>
