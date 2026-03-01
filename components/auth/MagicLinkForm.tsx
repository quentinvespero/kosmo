'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/authClient"
import { magicLinkSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type MagicLinkForm = z.infer<typeof magicLinkSchema>

export const MagicLinkForm = () => {

    const router = useRouter()

    const form = useForm<MagicLinkForm>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: { email: "" }
    })

    const handleSubmit = async ({ email }: MagicLinkForm) => {
        await signIn.magicLink(
            { email, callbackURL: '/home' },
            {
                onRequest: () => {
                    toast.loading('sending magic link...', { id: 'magiclink' })
                },
                onSuccess: () => {
                    toast.dismiss('magiclink')
                    router.push(`/verify?email=${encodeURIComponent(email)}`)
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "something went wrong", { id: 'magiclink' })
                }
            }
        )
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
                    <Button type='submit' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Sending...' : 'Send magic link'}
                    </Button>
                </FieldGroup>
            </form>
        </Form>
    )
}
