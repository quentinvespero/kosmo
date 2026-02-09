'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/authClient"
import { signUpSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type SignUpForm = z.infer<typeof signUpSchema>

export const SignUpTab = () => {

    const router = useRouter()

    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const handleSignUp = async (authData: SignUpForm) => {
        // provide the data to signup.email, as well as the url to which we want the user to be redirected
        const { data, error } = await signUp.email(
            // the callback below is used for email verification, it's where the user is redirected after clicking on the email's link
            { ...authData, callbackURL: "/" },
            {
                onRequest: (ctx) => {
                    toast.loading('creating account...', { id: 'signup' })
                },
                onSuccess: (ctx) => {
                    router.push('/')
                    toast.success('account created', { id: 'signup' })
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "something went wrong while signing up...", { id: 'signup' })
                }
            }
        )
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