/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ProfileHeader } from '../ProfileHeader'

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/actions/settings', () => ({
    updateProfile: vi.fn(),
}))

vi.mock('../FollowButton', () => ({
    FollowButton: () => null,
}))

// sonner toast is used in the component but irrelevant for this test
vi.mock('sonner', () => ({
    toast: { loading: vi.fn(), success: vi.fn(), error: vi.fn() },
}))

const mockUser = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: null,
    image: null,
    createdAt: new Date('2024-01-01'),
    _count: { posts: 0, followers: 0, following: 0 },
}

describe('ProfileHeader', () => {
    it('does not crash when the name field is fully cleared in edit mode', () => {
        render(
            <ProfileHeader
                user={mockUser}
                isOwnProfile={true}
                isPrivate={false}
                followStatus={null}
            />
        )

        // Enter edit mode
        fireEvent.click(screen.getByText('Edit profile'))

        // Clear the name — triggers getInitials("") which crashes on parts[0][0]
        const nameInput = screen.getByPlaceholderText('Your name')
        fireEvent.change(nameInput, { target: { value: '' } })

        // Component should still be mounted and the input visible
        expect(nameInput).toBeTruthy()
    })
})
