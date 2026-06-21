/// <reference types="vitest/globals" />
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock every external dependency so we can exercise the auth/validation/ownership
// guards and the mutation logic without a database or a real session.
vi.mock('@/lib/access', () => ({ canViewPost: vi.fn() }))
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
    default: {
        post: { findUnique: vi.fn() },
        comment: { findUnique: vi.fn(), update: vi.fn() },
        $transaction: vi.fn(),
        $executeRaw: vi.fn(),
    },
}))

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { canViewPost } from '@/lib/access'
import { revalidatePath } from 'next/cache'
import { createComment, editComment, deleteComment } from '../post'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockPostFind = vi.mocked(prisma.post.findUnique)
const mockCommentFind = vi.mocked(prisma.comment.findUnique)
const mockCommentUpdate = vi.mocked(prisma.comment.update)
const mockTransaction = vi.mocked(prisma.$transaction)
const mockExecuteRaw = vi.mocked(prisma.$executeRaw)
const mockCanView = vi.mocked(canViewPost)
const mockRevalidate = vi.mocked(revalidatePath)

// Valid Prisma-style cuids so the Zod schemas pass and we reach the auth guard
const POST_ID = 'cjld2cjxh0000qzrmn831i7rn'
const COMMENT_ID = 'cjld2cyuq0000t3rmniod1foy'
const PARENT_ID = 'cjld2cyuq0000t3rmniod1fab'

// A comment the current user owns, shaped as the actions select it
const ownedComment = {
    authorId: 'commenter1',
    postId: POST_ID,
    isDeleted: false,
    post: { author: { username: 'bob' } },
}

// Stand-in transaction client for createComment's atomic create + auto-upvote.
const txMock = {
    comment: { create: vi.fn() },
    vote: { create: vi.fn() },
}

beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ user: { id: 'commenter1' } } as never)
    // Default: the post is viewable, so tests reach the logic past the access guard
    mockCanView.mockResolvedValue(true)

    txMock.comment.create.mockResolvedValue({ id: COMMENT_ID })
    mockTransaction.mockImplementation(
        ((cb: (tx: typeof txMock) => unknown) => cb(txMock)) as never,
    )
})

describe('createComment', () => {
    it('rejects an unauthenticated caller before any lookup', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await createComment({ postId: POST_ID, content: 'hi' })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockPostFind).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('rejects empty content before any lookup', async () => {
        const result = await createComment({ postId: POST_ID, content: '' })

        expect(result).toMatchObject({ error: 'Invalid data' })
        expect(mockPostFind).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('returns Not found when the post does not exist', async () => {
        mockPostFind.mockResolvedValue(null as never)

        const result = await createComment({ postId: POST_ID, content: 'hi' })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('refuses to comment on a post the user cannot view', async () => {
        mockCanView.mockResolvedValue(false)

        const result = await createComment({ postId: POST_ID, content: 'hi' })

        expect(result).toEqual({ error: 'Forbidden' })
        // Access is scoped to this post and the current user
        expect(mockCanView).toHaveBeenCalledWith(POST_ID, 'commenter1')
        // No comment is created when access is denied
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('returns Not found when the named parent comment does not exist', async () => {
        mockPostFind.mockResolvedValue({ author: { username: 'bob' } } as never)
        mockCommentFind.mockResolvedValue(null as never)

        const result = await createComment({
            postId: POST_ID,
            content: 'hi',
            parentCommentId: PARENT_ID,
        })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('rejects a parent comment that belongs to a different post', async () => {
        mockPostFind.mockResolvedValue({ author: { username: 'bob' } } as never)
        // Parent lives under some other post → cross-post reply injection
        mockCommentFind.mockResolvedValue({ postId: 'cjld2cjxh0000qzrmn831i7zz' } as never)

        const result = await createComment({
            postId: POST_ID,
            content: 'hi',
            parentCommentId: PARENT_ID,
        })

        expect(result).toEqual({ error: 'Invalid parent' })
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('creates a top-level comment and auto-upvotes it', async () => {
        mockPostFind.mockResolvedValue({ author: { username: 'bob' } } as never)

        const result = await createComment({ postId: POST_ID, content: 'hi there' })

        expect(result).toEqual({ success: true })
        expect(txMock.comment.create).toHaveBeenCalledWith({
            data: {
                content: 'hi there',
                postId: POST_ID,
                authorId: 'commenter1',
                parentCommentId: null,
            },
        })
        // Reddit-style: the author's comment starts with their own upvote
        expect(txMock.vote.create).toHaveBeenCalledWith({
            data: { commentId: COMMENT_ID, userId: 'commenter1', type: 'UP' },
        })
        expect(mockRevalidate).toHaveBeenCalledWith(`/bob/${POST_ID}`)
    })

    it('creates a reply when the parent belongs to the same post', async () => {
        mockPostFind.mockResolvedValue({ author: { username: 'bob' } } as never)
        mockCommentFind.mockResolvedValue({ postId: POST_ID } as never)

        const result = await createComment({
            postId: POST_ID,
            content: 'a reply',
            parentCommentId: PARENT_ID,
        })

        expect(result).toEqual({ success: true })
        expect(txMock.comment.create).toHaveBeenCalledWith({
            data: {
                content: 'a reply',
                postId: POST_ID,
                authorId: 'commenter1',
                parentCommentId: PARENT_ID,
            },
        })
    })
})

describe('editComment', () => {
    it('rejects an unauthenticated caller before any lookup', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await editComment({ commentId: COMMENT_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockCommentFind).not.toHaveBeenCalled()
    })

    it('rejects an invalid commentId before any lookup', async () => {
        const result = await editComment({ commentId: 'not-a-cuid', content: 'updated' })

        expect(result).toMatchObject({ error: 'Invalid data' })
        expect(mockCommentFind).not.toHaveBeenCalled()
    })

    it('returns Not found when the comment does not exist', async () => {
        mockCommentFind.mockResolvedValue(null as never)

        const result = await editComment({ commentId: COMMENT_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockCommentUpdate).not.toHaveBeenCalled()
    })

    it('refuses to edit a soft-deleted comment', async () => {
        mockCommentFind.mockResolvedValue({ ...ownedComment, isDeleted: true } as never)

        const result = await editComment({ commentId: COMMENT_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockCommentUpdate).not.toHaveBeenCalled()
    })

    it('refuses to edit a comment the caller does not own', async () => {
        mockCommentFind.mockResolvedValue({ ...ownedComment, authorId: 'someone-else' } as never)

        const result = await editComment({ commentId: COMMENT_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Forbidden' })
        expect(mockCommentUpdate).not.toHaveBeenCalled()
    })

    it('updates the comment and marks it edited when the caller owns it', async () => {
        mockCommentFind.mockResolvedValue(ownedComment as never)

        const result = await editComment({ commentId: COMMENT_ID, content: 'updated' })

        expect(result).toEqual({ success: true })
        expect(mockCommentUpdate).toHaveBeenCalledWith({
            where: { id: COMMENT_ID },
            data: { content: 'updated', isEdited: true },
        })
        expect(mockRevalidate).toHaveBeenCalledWith(`/bob/${POST_ID}`)
    })
})

describe('deleteComment', () => {
    it('rejects an unauthenticated caller before any lookup', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await deleteComment({ commentId: COMMENT_ID })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockCommentFind).not.toHaveBeenCalled()
    })

    it('rejects an invalid commentId before any lookup', async () => {
        const result = await deleteComment({ commentId: 'not-a-cuid' })

        expect(result).toEqual({ error: 'Invalid data' })
        expect(mockCommentFind).not.toHaveBeenCalled()
    })

    it('returns Not found when the comment does not exist', async () => {
        mockCommentFind.mockResolvedValue(null as never)

        const result = await deleteComment({ commentId: COMMENT_ID })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockExecuteRaw).not.toHaveBeenCalled()
    })

    it('refuses to delete a comment the caller does not own', async () => {
        mockCommentFind.mockResolvedValue({ ...ownedComment, authorId: 'someone-else' } as never)

        const result = await deleteComment({ commentId: COMMENT_ID })

        expect(result).toEqual({ error: 'Forbidden' })
        expect(mockExecuteRaw).not.toHaveBeenCalled()
    })

    it('treats an already soft-deleted comment as a no-op success', async () => {
        mockCommentFind.mockResolvedValue({ ...ownedComment, isDeleted: true } as never)

        const result = await deleteComment({ commentId: COMMENT_ID })

        expect(result).toEqual({ success: true })
        expect(mockExecuteRaw).not.toHaveBeenCalled()
        expect(mockCommentUpdate).not.toHaveBeenCalled()
    })

    it('hard-deletes a leaf comment (no replies) without soft-deleting', async () => {
        mockCommentFind.mockResolvedValue(ownedComment as never)
        // One row deleted → the comment had no replies
        mockExecuteRaw.mockResolvedValue(1 as never)

        const result = await deleteComment({ commentId: COMMENT_ID })

        expect(result).toEqual({ success: true })
        expect(mockCommentUpdate).not.toHaveBeenCalled()
        expect(mockRevalidate).toHaveBeenCalledWith(`/bob/${POST_ID}`)
    })

    it('soft-deletes a comment that has replies, preserving the thread', async () => {
        mockCommentFind.mockResolvedValue(ownedComment as never)
        // Zero rows deleted → replies exist, so fall back to a soft delete
        mockExecuteRaw.mockResolvedValue(0 as never)

        const result = await deleteComment({ commentId: COMMENT_ID })

        expect(result).toEqual({ success: true })
        expect(mockCommentUpdate).toHaveBeenCalledWith({
            where: { id: COMMENT_ID },
            data: { isDeleted: true, content: '' },
        })
        expect(mockRevalidate).toHaveBeenCalledWith(`/bob/${POST_ID}`)
    })
})
