import z from "zod"

// Normalize a raw tag string: lowercase, spaces → hyphens, strip special chars
export const normalizeTag = (raw: string): string =>
    raw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '')

const tagNameSchema = z.string()
    .min(1)
    .max(32)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, 'Invalid tag format')

export const createPostSchema = z.object({
    content: z.string()
        .min(1, 'Post content cannot be empty')
        .max(10000, 'Post content must be at most 10,000 characters'),
    // Max 5 tags, each normalized to lowercase with hyphens before reaching this schema
    tags: z.array(tagNameSchema).max(5, 'Maximum 5 tags'),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const votePostSchema = z.object({
    postId: z.cuid(),
    type: z.enum(["UP", "DOWN"]),
})

export type VotePostInput = z.infer<typeof votePostSchema>

export const createCommentSchema = z.object({
    postId: z.cuid(),
    content: z.string()
        .min(1, 'Comment cannot be empty')
        .max(2000, 'Comment must be at most 2,000 characters'),
    parentCommentId: z.cuid().optional(),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>

export const voteCommentSchema = z.object({
    commentId: z.cuid(),
    type: z.enum(["UP", "DOWN"]),
})

export type VoteCommentInput = z.infer<typeof voteCommentSchema>
