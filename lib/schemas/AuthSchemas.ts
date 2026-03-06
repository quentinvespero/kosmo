import z from "zod"

export const magicLinkSchema = z.object({
    email: z.email({ error: 'valid email is required' })
})

export const onboardingSchema = z.object({
    name: z.string()
        .min(1, 'Display name is required')
        .max(50, 'Display name must be at most 50 characters'),
    handle: z.string()
        .min(3, 'Handle must be at least 3 characters')
        .max(30, 'Handle must be at most 30 characters')
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9_]*$/, 'Handle must start with a letter or number, and contain only letters, numbers, or underscores')
})