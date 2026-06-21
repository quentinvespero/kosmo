/// <reference types="vitest/globals" />
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock every external dependency of the vote actions so we can exercise the
// authorization guards AND the vote mutation logic without a database or a
// real session.
vi.mock('@/lib/access', () => ({ canViewPost: vi.fn() }))
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
    default: {
        post: { findUnique: vi.fn() },
        comment: { findUnique: vi.fn() },
        $transaction: vi.fn(),
    },
}))

import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { canViewPost } from '@/lib/access'
import { votePost, voteComment } from '../post'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockCanView = vi.mocked(canViewPost)
const mockTransaction = vi.mocked(prisma.$transaction)
const mockPostFind = vi.mocked(prisma.post.findUnique)
const mockCommentFind = vi.mocked(prisma.comment.findUnique)

// Valid Prisma-style cuids so the Zod schemas pass and we reach the auth guard
const POST_ID = 'cjld2cjxh0000qzrmn831i7rn'
const COMMENT_ID = 'cjld2cyuq0000t3rmniod1foy'

// A comment that exists, is not deleted, and whose post is viewable.
const viewableComment = {
    postId: POST_ID,
    isDeleted: false,
    post: { author: { username: 'bob' } },
}

// Stand-in transaction client. `$transaction` runs the action's callback against
// this object, so asserting on its methods proves which vote branch was taken.
const txMock = {
    vote: {
        findUnique: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
    },
}

beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ user: { id: 'voter1' } } as never)

    // Default: the transaction runs its callback against txMock with no
    // pre-existing vote, so actions take the "create" branch unless a test
    // overrides findUnique.
    txMock.vote.findUnique.mockResolvedValue(null)
    mockTransaction.mockImplementation(
        ((cb: (tx: typeof txMock) => unknown) => cb(txMock)) as never,
    )
})

describe('votePost', () => {
    it('rejects an unauthenticated caller before any access check', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await votePost({ postId: POST_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockCanView).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('rejects an invalid postId before any access check', async () => {
        const result = await votePost({ postId: 'not-a-cuid', type: 'UP' })

        expect(result).toEqual({ error: 'Invalid data' })
        expect(mockCanView).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('rejects an invalid vote type before any access check', async () => {
        const result = await votePost({ postId: POST_ID, type: 'SIDEWAYS' as never })

        expect(result).toEqual({ error: 'Invalid data' })
        expect(mockCanView).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('refuses to vote on a post the user cannot view', async () => {
        mockCanView.mockResolvedValue(false)

        const result = await votePost({ postId: POST_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Forbidden' })
        // The access check must be scoped to this post and the current user
        expect(mockCanView).toHaveBeenCalledWith(POST_ID, 'voter1')
        // The vote transaction must never run when access is denied
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('returns Not found when the post disappears after the access check', async () => {
        mockCanView.mockResolvedValue(true)
        mockPostFind.mockResolvedValue(null as never)

        const result = await votePost({ postId: POST_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    describe('vote mutation (transaction)', () => {
        beforeEach(() => {
            // Reach the transaction: viewable, still-existing post
            mockCanView.mockResolvedValue(true)
            mockPostFind.mockResolvedValue({ author: { username: 'bob' } } as never)
        })

        it('creates a new vote when none exists', async () => {
            const result = await votePost({ postId: POST_ID, type: 'UP' })

            expect(result).toEqual({ success: true })
            expect(mockCanView).toHaveBeenCalledWith(POST_ID, 'voter1')
            expect(mockTransaction).toHaveBeenCalledOnce()
            expect(txMock.vote.create).toHaveBeenCalledWith({
                data: { userId: 'voter1', postId: POST_ID, type: 'UP' },
            })
            expect(txMock.vote.delete).not.toHaveBeenCalled()
            expect(txMock.vote.update).not.toHaveBeenCalled()
        })

        it('runs the mutation at Serializable isolation to prevent vote races', async () => {
            await votePost({ postId: POST_ID, type: 'UP' })

            expect(mockTransaction).toHaveBeenCalledWith(
                expect.any(Function),
                { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
            )
        })

        it('toggles the vote off when the same type is repeated', async () => {
            txMock.vote.findUnique.mockResolvedValueOnce({ id: 'v1', type: 'UP' })

            const result = await votePost({ postId: POST_ID, type: 'UP' })

            expect(result).toEqual({ success: true })
            expect(txMock.vote.delete).toHaveBeenCalledWith({ where: { id: 'v1' } })
            expect(txMock.vote.create).not.toHaveBeenCalled()
            expect(txMock.vote.update).not.toHaveBeenCalled()
        })

        it('switches the vote when the opposite type is sent', async () => {
            txMock.vote.findUnique.mockResolvedValueOnce({ id: 'v1', type: 'DOWN' })

            const result = await votePost({ postId: POST_ID, type: 'UP' })

            expect(result).toEqual({ success: true })
            expect(txMock.vote.update).toHaveBeenCalledWith({
                where: { id: 'v1' },
                data: { type: 'UP' },
            })
            expect(txMock.vote.delete).not.toHaveBeenCalled()
            expect(txMock.vote.create).not.toHaveBeenCalled()
        })

        it('returns Server error when the transaction throws', async () => {
            txMock.vote.findUnique.mockRejectedValueOnce(new Error('db down'))

            const result = await votePost({ postId: POST_ID, type: 'UP' })

            expect(result).toEqual({ error: 'Server error' })
        })
    })
})

describe('voteComment', () => {
    it('rejects an unauthenticated caller before any lookup', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockCommentFind).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('rejects an invalid commentId before any lookup', async () => {
        const result = await voteComment({ commentId: 'not-a-cuid', type: 'UP' })

        expect(result).toEqual({ error: 'Invalid data' })
        expect(mockCommentFind).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('rejects an invalid vote type before any lookup', async () => {
        const result = await voteComment({ commentId: COMMENT_ID, type: 'SIDEWAYS' as never })

        expect(result).toEqual({ error: 'Invalid data' })
        expect(mockCommentFind).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('returns Not found when the comment does not exist', async () => {
        mockCommentFind.mockResolvedValue(null as never)

        const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockCanView).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('refuses to vote on a soft-deleted comment', async () => {
        mockCommentFind.mockResolvedValue({
            postId: POST_ID,
            isDeleted: true,
            post: { author: { username: 'bob' } },
        } as never)

        const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Not found' })
        // A deleted comment short-circuits before the (more expensive) access check
        expect(mockCanView).not.toHaveBeenCalled()
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('refuses to vote on a comment whose post the user cannot view', async () => {
        mockCommentFind.mockResolvedValue(viewableComment as never)
        mockCanView.mockResolvedValue(false)

        const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

        expect(result).toEqual({ error: 'Forbidden' })
        // Access is checked against the comment's parent post, not the comment
        expect(mockCanView).toHaveBeenCalledWith(POST_ID, 'voter1')
        expect(mockTransaction).not.toHaveBeenCalled()
    })

    describe('vote mutation (transaction)', () => {
        beforeEach(() => {
            // Reach the transaction: existing, non-deleted, viewable comment
            mockCommentFind.mockResolvedValue(viewableComment as never)
            mockCanView.mockResolvedValue(true)
        })

        it('creates a new vote when none exists', async () => {
            const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

            expect(result).toEqual({ success: true })
            expect(mockCanView).toHaveBeenCalledWith(POST_ID, 'voter1')
            expect(mockTransaction).toHaveBeenCalledOnce()
            expect(txMock.vote.create).toHaveBeenCalledWith({
                data: { userId: 'voter1', commentId: COMMENT_ID, type: 'UP' },
            })
            expect(txMock.vote.delete).not.toHaveBeenCalled()
            expect(txMock.vote.update).not.toHaveBeenCalled()
        })

        it('runs the mutation at Serializable isolation to prevent vote races', async () => {
            await voteComment({ commentId: COMMENT_ID, type: 'UP' })

            expect(mockTransaction).toHaveBeenCalledWith(
                expect.any(Function),
                { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
            )
        })

        it('toggles the vote off when the same type is repeated', async () => {
            txMock.vote.findUnique.mockResolvedValueOnce({ id: 'v1', type: 'UP' })

            const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

            expect(result).toEqual({ success: true })
            expect(txMock.vote.delete).toHaveBeenCalledWith({ where: { id: 'v1' } })
            expect(txMock.vote.create).not.toHaveBeenCalled()
            expect(txMock.vote.update).not.toHaveBeenCalled()
        })

        it('switches the vote when the opposite type is sent', async () => {
            txMock.vote.findUnique.mockResolvedValueOnce({ id: 'v1', type: 'DOWN' })

            const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

            expect(result).toEqual({ success: true })
            expect(txMock.vote.update).toHaveBeenCalledWith({
                where: { id: 'v1' },
                data: { type: 'UP' },
            })
            expect(txMock.vote.delete).not.toHaveBeenCalled()
            expect(txMock.vote.create).not.toHaveBeenCalled()
        })

        it('returns Server error when the transaction throws', async () => {
            txMock.vote.findUnique.mockRejectedValueOnce(new Error('db down'))

            const result = await voteComment({ commentId: COMMENT_ID, type: 'UP' })

            expect(result).toEqual({ error: 'Server error' })
        })
    })
})
