import z from "zod"

export const createPostSchema = z.object({
    content: z.string()
        .min(1, 'Post content cannot be empty')
        .max(10000, 'Post content must be at most 10,000 characters'),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
