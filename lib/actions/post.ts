'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import {
    createPostSchema,
    votePostSchema,
    type VotePostInput,
    createCommentSchema,
    type CreateCommentInput,
    voteCommentSchema,
    type VoteCommentInput,
    editPostSchema,
    deletePostSchema,
    editCommentSchema,
    deleteCommentSchema,
} from "@/lib/schemas/PostSchemas"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export const createPost = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = createPostSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const post = await prisma.post.create({
        data: {
            content: parsed.data.content,
            authorId: session.user.id,
            tags: {
                // Create the tag if it doesn't exist yet, otherwise connect to it
                connectOrCreate: parsed.data.tags.map(name => ({
                    where: { name },
                    create: { name },
                })),
            },
        },
    })

    // Auto-upvote: like Reddit, the author's post starts with their own upvote
    await prisma.vote.create({
        data: { postId: post.id, userId: session.user.id, type: 'UP' },
    })

    revalidatePath('/home')
    return { success: true as const }
}

export const votePost = async (data: VotePostInput) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = votePostSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const }

    const { postId, type } = parsed.data
    const userId = session.user.id

    // Fetch the post's author handle for cache revalidation
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { author: { select: { username: true } } },
    })
    if (!post) return { error: 'Not found' as const }

    try {
        await prisma.$transaction(async (tx) => {
            const existing = await tx.vote.findUnique({
                where: { userId_postId: { userId, postId } },
                select: { id: true, type: true },
            })

            if (existing) {
                if (existing.type === type) {
                    // Same vote clicked again → toggle off
                    await tx.vote.delete({ where: { id: existing.id } })
                } else {
                    // Opposite vote → switch
                    await tx.vote.update({ where: { id: existing.id }, data: { type } })
                }
            } else {
                await tx.vote.create({ data: { userId, postId, type } })
            }
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    } catch {
        return { error: 'Server error' as const }
    }

    revalidatePath(`/${post.author.username}/${postId}`)
    return { success: true as const }
}

export const createComment = async (data: CreateCommentInput) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = createCommentSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const { postId, content, parentCommentId } = parsed.data

    // Verify post exists and get the author's handle for revalidation
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { author: { select: { username: true } } },
    })
    if (!post) return { error: 'Not found' as const }

    // Ensure the parent comment belongs to the same post (guards against cross-post reply injection)
    if (parentCommentId) {
        const parent = await prisma.comment.findUnique({
            where: { id: parentCommentId },
            select: { postId: true },
        })
        if (!parent) return { error: 'Not found' as const }
        if (parent.postId !== postId) return { error: 'Invalid parent' as const }
    }

    // Create comment + auto-upvote atomically so a failed vote can't leave an orphaned comment
    await prisma.$transaction(async (tx) => {
        const comment = await tx.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id,
                parentCommentId: parentCommentId ?? null,
            },
        })
        // Auto-upvote: like Reddit, the author's comment starts with their own upvote
        await tx.vote.create({
            data: { commentId: comment.id, userId: session.user.id, type: 'UP' },
        })
    })

    revalidatePath(`/${post.author.username}/${postId}`)
    return { success: true as const }
}

export const editPost = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = editPostSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const { postId, content } = parsed.data

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, author: { select: { username: true } } },
    })
    if (!post) return { error: 'Not found' as const }
    if (post.authorId !== session.user.id) return { error: 'Forbidden' as const }

    await prisma.post.update({
        where: { id: postId },
        data: { content, isEdited: true },
    })

    revalidatePath(`/${post.author.username}/${postId}`)
    revalidatePath(`/${post.author.username}`)
    return { success: true as const }
}

export const deletePost = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = deletePostSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const }

    const { postId } = parsed.data

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, author: { select: { username: true } } },
    })
    if (!post) return { error: 'Not found' as const }
    if (post.authorId !== session.user.id) return { error: 'Forbidden' as const }

    await prisma.post.delete({ where: { id: postId } })

    revalidatePath(`/${post.author.username}`)
    revalidatePath('/home')
    return { success: true as const }
}

export const editComment = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = editCommentSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    const { commentId, content } = parsed.data

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true, postId: true, post: { select: { author: { select: { username: true } } } } },
    })
    if (!comment) return { error: 'Not found' as const }
    if (comment.authorId !== session.user.id) return { error: 'Forbidden' as const }

    await prisma.comment.update({
        where: { id: commentId },
        data: { content, isEdited: true },
    })

    revalidatePath(`/${comment.post.author.username}/${comment.postId}`)
    return { success: true as const }
}

export const deleteComment = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = deleteCommentSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const }

    const { commentId } = parsed.data

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true, postId: true, post: { select: { author: { select: { username: true } } } } },
    })
    if (!comment) return { error: 'Not found' as const }
    if (comment.authorId !== session.user.id) return { error: 'Forbidden' as const }

    await prisma.comment.delete({ where: { id: commentId } })

    revalidatePath(`/${comment.post.author.username}/${comment.postId}`)
    return { success: true as const }
}

export const voteComment = async (data: VoteCommentInput) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = voteCommentSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const }

    const { commentId, type } = parsed.data
    const userId = session.user.id

    // Fetch the comment's post author handle for cache revalidation
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { postId: true, post: { select: { author: { select: { username: true } } } } },
    })
    if (!comment) return { error: 'Not found' as const }

    try {
        await prisma.$transaction(async (tx) => {
            const existing = await tx.vote.findUnique({
                where: { userId_commentId: { userId, commentId } },
                select: { id: true, type: true },
            })

            if (existing) {
                if (existing.type === type) {
                    await tx.vote.delete({ where: { id: existing.id } })
                } else {
                    await tx.vote.update({ where: { id: existing.id }, data: { type } })
                }
            } else {
                await tx.vote.create({ data: { userId, commentId, type } })
            }
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    } catch {
        return { error: 'Server error' as const }
    }

    revalidatePath(`/${comment.post.author.username}/${comment.postId}`)
    return { success: true as const }
}
