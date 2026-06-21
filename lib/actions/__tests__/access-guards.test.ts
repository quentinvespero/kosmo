/// <reference types="vitest/globals" />
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Shared authorization contract: EVERY action that mutates a post (or its
// comments/votes) must refuse when the caller cannot view the underlying post.
// This is a policy test — it exists to catch the *next* action that forgets the
// `canViewPost` guard. When you add such an action, add it to the list below.
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

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { canViewPost } from '@/lib/access'
import { votePost, voteComment, createComment } from '../post'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockCommentFind = vi.mocked(prisma.comment.findUnique)
const mockTransaction = vi.mocked(prisma.$transaction)
const mockCanView = vi.mocked(canViewPost)

const POST_ID = 'cjld2cjxh0000qzrmn831i7rn'
const COMMENT_ID = 'cjld2cyuq0000t3rmniod1foy'

// Every post-mutating action paired with a call that reaches its access check.
const guardedActions: [name: string, call: () => Promise<unknown>][] = [
    ['votePost', () => votePost({ postId: POST_ID, type: 'UP' })],
    ['voteComment', () => voteComment({ commentId: COMMENT_ID, type: 'UP' })],
    ['createComment', () => createComment({ postId: POST_ID, content: 'hi' })],
]

beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ user: { id: 'user1' } } as never)
    // voteComment looks the comment up before its access check — return a
    // non-deleted comment so every action actually reaches `canViewPost`.
    mockCommentFind.mockResolvedValue({
        postId: POST_ID,
        isDeleted: false,
        post: { author: { username: 'bob' } },
    } as never)
})

describe('post-mutating actions reject an unviewable post', () => {
    it.each(guardedActions)('%s returns Forbidden and performs no write', async (_name, call) => {
        mockCanView.mockResolvedValue(false)

        const result = await call()

        expect(result).toEqual({ error: 'Forbidden' })
        expect(mockCanView).toHaveBeenCalledWith(POST_ID, 'user1')
        // The write (a $transaction in every case) must never run when access is denied
        expect(mockTransaction).not.toHaveBeenCalled()
    })
})
