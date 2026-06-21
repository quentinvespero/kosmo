/// <reference types="vitest/globals" />
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock every external dependency so we can exercise the auth/validation/ownership
// guards and the mutation logic without a database or a real session.
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
    default: {
        post: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        vote: { create: vi.fn() },
    },
}))

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createPost, editPost, deletePost } from '../post'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockPostCreate = vi.mocked(prisma.post.create)
const mockPostFind = vi.mocked(prisma.post.findUnique)
const mockPostUpdate = vi.mocked(prisma.post.update)
const mockPostDelete = vi.mocked(prisma.post.delete)
const mockVoteCreate = vi.mocked(prisma.vote.create)
const mockRevalidate = vi.mocked(revalidatePath)

// Valid Prisma-style cuid so the Zod schemas pass and we reach the auth guard
const POST_ID = 'cjld2cjxh0000qzrmn831i7rn'

// A post the current user owns, shaped as the actions select it
const ownedPost = { authorId: 'author1', author: { username: 'bob' } }

beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ user: { id: 'author1' } } as never)
})

describe('createPost', () => {
    it('rejects an unauthenticated caller before any write', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await createPost({ content: 'hello', tags: [] })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockPostCreate).not.toHaveBeenCalled()
    })

    it('rejects empty content before any write', async () => {
        const result = await createPost({ content: '', tags: [] })

        expect(result).toMatchObject({ error: 'Invalid data' })
        expect(mockPostCreate).not.toHaveBeenCalled()
    })

    it('rejects more than 3 tags before any write', async () => {
        const result = await createPost({ content: 'hi', tags: ['a', 'b', 'c', 'd'] })

        expect(result).toMatchObject({ error: 'Invalid data' })
        expect(mockPostCreate).not.toHaveBeenCalled()
    })

    it('creates the post, connectOrCreates its tags, and auto-upvotes it', async () => {
        mockPostCreate.mockResolvedValue({ id: POST_ID } as never)

        const result = await createPost({ content: 'hello world', tags: ['news'] })

        expect(result).toEqual({ success: true })
        expect(mockPostCreate).toHaveBeenCalledWith({
            data: {
                content: 'hello world',
                authorId: 'author1',
                tags: {
                    connectOrCreate: [{ where: { name: 'news' }, create: { name: 'news' } }],
                },
            },
        })
        // Reddit-style: the author's post starts with their own upvote
        expect(mockVoteCreate).toHaveBeenCalledWith({
            data: { postId: POST_ID, userId: 'author1', type: 'UP' },
        })
        expect(mockRevalidate).toHaveBeenCalledWith('/home')
    })
})

describe('editPost', () => {
    it('rejects an unauthenticated caller before any lookup', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await editPost({ postId: POST_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockPostFind).not.toHaveBeenCalled()
    })

    it('rejects an invalid postId before any lookup', async () => {
        const result = await editPost({ postId: 'not-a-cuid', content: 'updated' })

        expect(result).toMatchObject({ error: 'Invalid data' })
        expect(mockPostFind).not.toHaveBeenCalled()
    })

    it('returns Not found when the post does not exist', async () => {
        mockPostFind.mockResolvedValue(null as never)

        const result = await editPost({ postId: POST_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockPostUpdate).not.toHaveBeenCalled()
    })

    it('refuses to edit a post the caller does not own', async () => {
        mockPostFind.mockResolvedValue({ authorId: 'someone-else', author: { username: 'eve' } } as never)

        const result = await editPost({ postId: POST_ID, content: 'updated' })

        expect(result).toEqual({ error: 'Forbidden' })
        expect(mockPostUpdate).not.toHaveBeenCalled()
    })

    it('updates the post and marks it edited when the caller owns it', async () => {
        mockPostFind.mockResolvedValue(ownedPost as never)

        const result = await editPost({ postId: POST_ID, content: 'updated' })

        expect(result).toEqual({ success: true })
        expect(mockPostUpdate).toHaveBeenCalledWith({
            where: { id: POST_ID },
            data: { content: 'updated', isEdited: true },
        })
        expect(mockRevalidate).toHaveBeenCalledWith(`/bob/${POST_ID}`)
        expect(mockRevalidate).toHaveBeenCalledWith('/bob')
    })
})

describe('deletePost', () => {
    it('rejects an unauthenticated caller before any lookup', async () => {
        mockGetSession.mockResolvedValue(null as never)

        const result = await deletePost({ postId: POST_ID })

        expect(result).toEqual({ error: 'Unauthorized' })
        expect(mockPostFind).not.toHaveBeenCalled()
    })

    it('rejects an invalid postId before any lookup', async () => {
        const result = await deletePost({ postId: 'not-a-cuid' })

        expect(result).toEqual({ error: 'Invalid data' })
        expect(mockPostFind).not.toHaveBeenCalled()
    })

    it('returns Not found when the post does not exist', async () => {
        mockPostFind.mockResolvedValue(null as never)

        const result = await deletePost({ postId: POST_ID })

        expect(result).toEqual({ error: 'Not found' })
        expect(mockPostDelete).not.toHaveBeenCalled()
    })

    it('refuses to delete a post the caller does not own', async () => {
        mockPostFind.mockResolvedValue({ authorId: 'someone-else', author: { username: 'eve' } } as never)

        const result = await deletePost({ postId: POST_ID })

        expect(result).toEqual({ error: 'Forbidden' })
        expect(mockPostDelete).not.toHaveBeenCalled()
    })

    it('deletes the post when the caller owns it', async () => {
        mockPostFind.mockResolvedValue(ownedPost as never)

        const result = await deletePost({ postId: POST_ID })

        expect(result).toEqual({ success: true })
        expect(mockPostDelete).toHaveBeenCalledWith({ where: { id: POST_ID } })
        expect(mockRevalidate).toHaveBeenCalledWith('/bob')
        expect(mockRevalidate).toHaveBeenCalledWith('/home')
    })
})
