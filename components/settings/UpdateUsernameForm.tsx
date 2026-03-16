'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateUsernameSchema } from "@/lib/schemas/SettingsSchemas"
import { updateUsername } from "@/lib/actions/settings"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type FormData = z.infer<typeof updateUsernameSchema>

type Props = {
    currentUsername: string
}

export const UpdateUsernameForm = ({ currentUsername }: Props) => {
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(updateUsernameSchema),
        defaultValues: { username: currentUsername }
    })

    const onSubmit = async (data: FormData) => {
        const id = 'update-username'
        toast.loading('Updating username...', { id })
        const result = await updateUsername(data)

        if ('error' in result) {
            toast.error(
                result.error === 'Username already taken'
                    ? 'That username is already taken'
                    : result.error,
                { id }
            )
        } else {
            toast.success('Username updated', { id })
            router.refresh()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>username</FormLabel>
                            <div className="flex items-center gap-3">
                                <p className="text-lg">@</p>
                                <FormControl>
                                    <Input {...field} placeholder="your_username" />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                >
                    Save
                </Button>
            </form>
        </Form>
    )
}
