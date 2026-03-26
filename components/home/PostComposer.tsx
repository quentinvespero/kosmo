'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition, useState } from "react"
import { createPostSchema, CreatePostInput } from "@/lib/schemas/PostSchemas"
import { createPost } from "@/lib/actions/post"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"

export const PostComposer = () => {
    const [isPending, startTransition] = useTransition()
    const [isFocused, setIsFocused] = useState(false)

    const form = useForm<CreatePostInput>({
        resolver: zodResolver(createPostSchema),
        defaultValues: { content: '' },
    })

    const content = form.watch('content')
    const remaining = 10000 - (content?.length ?? 0)
    // Show the shortcut hint only when the textarea is idle
    const showShortcut = !isFocused && !content

    // Global keyboard shortcut: "n" focuses the post composer
    useKeyboardShortcut('n', () => form.setFocus('content'))

    const onSubmit = (data: CreatePostInput) => {
        startTransition(async () => {
            const toastId = toast.loading('Publishing...')
            const result = await createPost(data)
            if ('error' in result) {
                toast.error('Failed to publish post', { id: toastId })
                return
            }
            toast.success('Post published', { id: toastId })
            form.reset()
        })
    }

    return (
        <div className="border rounded-xl p-4 space-y-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    {/* Content */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Textarea
                                            placeholder="What's on your mind?"
                                            className="border-0 shadow-none px-0 resize-none min-h-20 focus-visible:ring-0"
                                            {...field}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={(e) => {
                                                field.onBlur()
                                                setIsFocused(false)
                                            }}
                                            // Keyboard shortcut: Cmd+Enter (Mac) or Ctrl+Enter submits the post
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                    e.preventDefault()
                                                    form.handleSubmit(onSubmit)()
                                                }
                                            }}
                                        />
                                        {/* Keyboard shortcut hint — hidden while focused or when content exists */}
                                        {showShortcut && (
                                            <ShortcutKey className="absolute right-2 top-2">N</ShortcutKey>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        {/* Character counter — only shown when content is non-empty */}
                        <span className={`text-xs ${remaining < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {content?.length > 0 ? `${remaining} remaining` : ''}
                        </span>

                        <Button type="submit" disabled={isPending || !content?.trim()}>
                            Post
                            <ShortcutKey variant="inline"><span>⌘</span><span>ENTER</span></ShortcutKey>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
