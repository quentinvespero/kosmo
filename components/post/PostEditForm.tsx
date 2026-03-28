'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { editPostSchema, type EditPostInput } from "@/lib/schemas/PostSchemas"
import { editPost } from "@/lib/actions/post"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type Props = {
    postId: string
    initialContent: string
    onSave: () => void
    onCancel: () => void
}

export const PostEditForm = ({ postId, initialContent, onSave, onCancel }: Props) => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<EditPostInput>({
        resolver: zodResolver(editPostSchema),
        defaultValues: { postId, content: initialContent },
    })

    const content = form.watch('content')
    const remaining = 10000 - (content?.length ?? 0)

    const onSubmit = (data: EditPostInput) => {
        startTransition(async () => {
            const toastId = toast.loading('Saving...')
            const result = await editPost(data)
            if ('error' in result) {
                toast.error('Failed to save post', { id: toastId })
                return
            }
            toast.success('Post saved', { id: toastId })
            onSave()
        })
    }

    return (
        <div className="border rounded-xl p-4 space-y-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        className="border-0 shadow-none resize-none min-h-20 focus-visible:ring-0"
                                        maxLength={10000}
                                        {...field}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                e.preventDefault()
                                                form.handleSubmit(onSubmit)()
                                            }
                                            if (e.key === 'Escape') onCancel()
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-end gap-3">
                        <span className={`text-xs ${remaining < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {content?.length > 0 ? `${remaining} remaining` : ''}
                        </span>
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={isPending || !content?.trim()}>
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
