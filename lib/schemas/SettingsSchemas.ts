import { z } from 'zod'

export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
    bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
})

export const updateUsernameSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be 30 characters or less')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
})

export const updatePrivacySchema = z.object({
    isPrivate: z.boolean(),
    allowSubscribersOnPrivateProfile: z.boolean(),
})
