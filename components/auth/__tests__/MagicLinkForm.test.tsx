import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MagicLinkForm } from '../MagicLinkForm'

// Hoisted so factory closures can reference them
const { mockPush, mockMagicLink, mockToastError } = vi.hoisted(() => ({
    mockPush: vi.fn(),
    mockMagicLink: vi.fn(),
    mockToastError: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

vi.mock('sonner', () => ({
    toast: {
        loading: vi.fn(),
        error: mockToastError,
        dismiss: vi.fn(),
        success: vi.fn(),
    },
}))

vi.mock('@/lib/authClient', () => ({
    signIn: { magicLink: mockMagicLink },
}))

describe('MagicLinkForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows error feedback and re-enables button when signIn.magicLink throws', async () => {
        // Simulate an unexpected throw (e.g. network failure before better-auth handles it)
        mockMagicLink.mockRejectedValue(new Error('Network error'))

        render(<MagicLinkForm />)

        const input = screen.getByRole('textbox')
        const button = screen.getByRole('button', { name: /send magic link/i })

        fireEvent.change(input, { target: { value: 'test@example.com' } })
        fireEvent.click(button)

        // Button should be re-enabled and show original label after an error
        await waitFor(() => {
            expect((button as HTMLButtonElement).disabled).toBe(false)
        })
        expect(button.textContent).toBe('Send magic link')

        // User should see an error toast
        expect(mockToastError).toHaveBeenCalled()
    })
})
