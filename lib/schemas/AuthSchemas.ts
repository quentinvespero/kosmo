import z from "zod"

// signin schema
export const signInSchema = z.object({
    email: z
        .email({ error: 'email is required' }),
    password: z
        .string()
        .min(1, { error: 'password is required' })
})

// signup schema
export const signUpSchema = z.object({
    name: z
        .string()
        .min(3),
    email: z
        .email()
        .min(3),
    password: z
        .string()
        .min(8)
})