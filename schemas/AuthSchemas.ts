import z from "zod"

export const LoginSchema = z.object({
    email: z.email({error:'email is required'}),

    // password should be at least 1 character
    password: z.string().min(1,{error:'password is required'})
})