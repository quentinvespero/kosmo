'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/authClient"
import { magicLinkSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type MagicLinkForm = z.infer<typeof magicLinkSchema>

export const MagicLinkForm = () => {

    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    const form = useForm<MagicLinkForm>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: { email: "" }
    })

    const handleSubmit = async ({ email }: MagicLinkForm) => {
        setIsPending(true)
        try {
            await signIn.magicLink(
                { email, callbackURL: '/home', newUserCallbackURL: '/onboarding', errorCallbackURL: '/signin?error=link_invalid' },
                {
                    onRequest: () => {
                        toast.loading('sending magic link...', { id: 'magiclink' })
                    },
                    onSuccess: () => {
                        toast.dismiss('magiclink')
                        router.push(`/verify?email=${encodeURIComponent(email)}`)
                        // don't reset isPending — the redirect will unmount this component
                    },
                    onError: (ctx: { error: { message: any } }) => {
                        toast.error(ctx.error.message || "something went wrong", { id: 'magiclink' })
                        setIsPending(false)
                    }
                }
            )
        } catch {
            toast.error("something went wrong", { id: 'magiclink' })
            setIsPending(false)
        }
    }

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleSubmit)}
                toolname="magic-link"
                tooldescription="Sign in or sign up with a magic link sent to your email"
            >
                <FieldGroup>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder='you@example.com'
                                        {...field}
                                        toolparamdescription="User's email address"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' disabled={form.formState.isSubmitting || isPending}>
                        {form.formState.isSubmitting || isPending ? 'Sending...' : 'Send magic link'}
                    </Button>
                </FieldGroup>
            </form>
        </Form>
    )
}
