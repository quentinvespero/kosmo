'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

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

    const handleSignUp = async (data: SignUpForm) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('signin up.........')
    }

    return <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
            <FieldGroup>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type='text' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type='email' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type='password' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' >Sign Up</Button>
            </FieldGroup>
        </form>
    </Form>
}