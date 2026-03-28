'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createCommentSchema, type CreateCommentInput } from "@/lib/schemas/PostSchemas"
import { createComment } from "@/lib/actions/post"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Props {
    postId: string
    parentCommentId?: string
    onSuccess?: () => void
}

export const CommentComposer = ({ postId, parentCommentId, onSuccess }: Props) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateCommentInput>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: { postId, content: '', parentCommentId },
    })

    const content = form.watch('content')
    const remaining = 2000 - (content?.length ?? 0)

    const onSubmit = (data: CreateCommentInput) => {
        startTransition(async () => {
            const toastId = toast.loading('Posting comment...')
            const result = await createComment(data)
            if ('error' in result) {
                toast.error('Failed to post comment', { id: toastId })
                return
            }
            toast.success('Comment posted', { id: toastId })
            form.reset({ postId, content: '', parentCommentId })
            // Refresh Server Components so the new comment appears immediately
            router.refresh()
            onSuccess?.()
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Add a comment..."
                                    className="resize-none min-h-16"
                                    maxLength={2000}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-between">
                    <span className={`text-xs ${remaining < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {content?.length > 0 ? `${remaining} remaining` : ''}
                    </span>
                    <Button type="submit" size="sm" disabled={isPending || !content?.trim()}>
                        Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}
