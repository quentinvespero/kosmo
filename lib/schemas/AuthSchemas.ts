import z from "zod"

// deprecated
export const LoginSchema = z.object({
    email: z.email({ error: 'email is required' }),

    // password should be at least 1 character
    password: z.string().min(1, { error: 'password is required' })
})

// new auth schema
export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.email().min(1),
    password: z.string().min(8)
})