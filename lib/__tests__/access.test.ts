/// <reference types="vitest/globals" />
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the Prisma singleton so canViewPost can be unit-tested without a database
vi.mock('@/lib/prisma', () => ({
    default: {
        post: { findUnique: vi.fn() },
        follow: { findUnique: vi.fn() },
    },
}))

import prisma from '@/lib/prisma'
import { canViewPost } from '../access'

const mockPostFind = vi.mocked(prisma.post.findUnique)
const mockFollowFind = vi.mocked(prisma.follow.findUnique)

// Helper to shape a post record as canViewPost selects it
const post = (opts: { authorId?: string; isPrivate?: boolean; isSubscribersOnly?: boolean }) => ({
    isSubscribersOnly: opts.isSubscribersOnly ?? false,
    author: {
        id: opts.authorId ?? 'author1',
        userPreferences: { isPrivate: opts.isPrivate ?? false },
    },
})

describe('canViewPost', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns false for a non-existent post', async () => {
        mockPostFind.mockResolvedValue(null as never)
        expect(await canViewPost('postX', 'user1')).toBe(false)
    })

    it('allows anyone (even anonymous) to view a public post', async () => {
        mockPostFind.mockResolvedValue(post({}) as never)
        expect(await canViewPost('post1', null)).toBe(true)
        expect(await canViewPost('post1', 'someone')).toBe(true)
    })

    it('lets the author view their own subscriber-only post', async () => {
        mockPostFind.mockResolvedValue(post({ authorId: 'me', isSubscribersOnly: true }) as never)
        expect(await canViewPost('post1', 'me')).toBe(true)
    })

    it('hides a subscriber-only post from non-owners', async () => {
        mockPostFind.mockResolvedValue(post({ authorId: 'me', isSubscribersOnly: true }) as never)
        expect(await canViewPost('post1', 'intruder')).toBe(false)
    })

    it('hides a private-profile post from anonymous users', async () => {
        mockPostFind.mockResolvedValue(post({ authorId: 'me', isPrivate: true }) as never)
        expect(await canViewPost('post1', null)).toBe(false)
    })

    it('hides a private-profile post from a non-follower', async () => {
        mockPostFind.mockResolvedValue(post({ authorId: 'me', isPrivate: true }) as never)
        mockFollowFind.mockResolvedValue(null as never)
        expect(await canViewPost('post1', 'stranger')).toBe(false)
    })

    it('hides a private-profile post from a follower whose request is still PENDING', async () => {
        mockPostFind.mockResolvedValue(post({ authorId: 'me', isPrivate: true }) as never)
        mockFollowFind.mockResolvedValue({ status: 'PENDING' } as never)
        expect(await canViewPost('post1', 'pending')).toBe(false)
    })

    it('shows a private-profile post to an ACCEPTED follower', async () => {
        mockPostFind.mockResolvedValue(post({ authorId: 'me', isPrivate: true }) as never)
        mockFollowFind.mockResolvedValue({ status: 'ACCEPTED' } as never)
        expect(await canViewPost('post1', 'friend')).toBe(true)
    })
})
