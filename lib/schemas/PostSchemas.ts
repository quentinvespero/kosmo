import z from "zod"

export const createPostSchema = z.object({
    content: z.string()
        .min(1, 'Post content cannot be empty')
        .max(10000, 'Post content must be at most 10,000 characters'),
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
