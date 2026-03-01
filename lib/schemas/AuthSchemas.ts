import z from "zod"

export const magicLinkSchema = z.object({
    email: z.email({ error: 'valid email is required' })
})