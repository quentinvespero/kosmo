'use client'

import { Form, FormItem } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

const signUpSchema = z.object({
    name: z.string().min(1),
    email: z.email().min(1),
    password: z.string().min(8)
})

type SignUpForm = z.infer<typeof signUpSchema>

export const SignUpTab = () => {
    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const handleSignUp = (data: SignUpForm) => {
        console.log('signin up.........')
    }

    return <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
            <FormItem control={ } />
        </form>
    </Form>
}