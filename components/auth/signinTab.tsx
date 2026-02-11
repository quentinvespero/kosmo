'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/authClient"
import { signInSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type SignInForm = z.infer<typeof signInSchema>

export const SignInTab = () => {

    const router = useRouter()

    const form = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const handleSignIn = async (authData: SignInForm) => {
        await signIn.email(
            { ...authData, callbackURL: '/home', rememberMe: true },
            {
                onRequest: () => {
                    toast.loading('signing in...', { id: 'signin' })
                },
                onSuccess: () => {
                    router.push('/home')
                    toast.success('signed in', { id: 'signin' })
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "something went wrong while signing in...", { id: 'signin' })
                }
            }
        )
    }

    return <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
            <FieldGroup>
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

                <Button type='submit' disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </FieldGroup>
        </form>
    </Form>
}
