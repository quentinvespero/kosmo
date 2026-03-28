'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useTransition, useState, useEffect, useRef, KeyboardEvent, MouseEvent } from "react"
import { createPostSchema, CreatePostInput, normalizeTag } from "@/lib/schemas/PostSchemas"
import { createPost } from "@/lib/actions/post"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { Tag as TagIcon, X, ImageIcon, Link, BarChart2 } from "lucide-react"

export const PostComposer = () => {
    const [isPending, startTransition] = useTransition()
    const [isFocused, setIsFocused] = useState(false)

    // Tag state — managed separately from RHF and synced via setValue
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [showTagInput, setShowTagInput] = useState(false)
    const tagInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreatePostInput>({
        resolver: zodResolver(createPostSchema),
        defaultValues: { content: '', tags: [] },
    })

    const content = form.watch('content')
    const remaining = 10000 - (content?.length ?? 0)
    // Show the shortcut hint only when the textarea is idle
    const showShortcut = !isFocused && !content

    // Focus the tag input whenever it becomes visible
    useEffect(() => {
        if (showTagInput) tagInputRef.current?.focus()
    }, [showTagInput])

    // Global keyboard shortcut: "n" focuses the post composer
    useKeyboardShortcut('n', () => form.setFocus('content'))

    // --- Tag helpers ---

    const tryAddTag = () => {
        const normalized = normalizeTag(tagInput)
        if (!normalized || tags.includes(normalized) || tags.length >= 3) {
            setTagInput('')
            return
        }
        const newTags = [...tags, normalized]
        setTags(newTags)
        form.setValue('tags', newTags)
        setTagInput('')
    }

    const removeTag = (name: string) => {
        const newTags = tags.filter(t => t !== name)
        setTags(newTags)
        form.setValue('tags', newTags)
    }

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            tryAddTag()
        } else if (e.key === 'Backspace' && tagInput === '') {
            // Backspace on empty input removes the last tag (standard chip convention)
            const newTags = tags.slice(0, -1)
            setTags(newTags)
            form.setValue('tags', newTags)
        } else if (e.key === 'Escape') {
            setShowTagInput(false)
        }
    }

    const handleTagInputBlur = () => {
        // Pre-compute whether tryAddTag will actually add something before calling it
        const normalized = normalizeTag(tagInput)
        const willAdd = !!normalized && !tags.includes(normalized) && tags.length < 3
        if (tagInput.trim()) tryAddTag()
        // Collapse only if there are no existing tags and none will be added
        if (tags.length === 0 && !willAdd) setShowTagInput(false)
    }

    const handleTagButtonMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
        // Prevent the mousedown from blurring the tag input before our toggle logic runs
        e.preventDefault()
        setShowTagInput(prev => !prev)
    }

    // Handle pasting a comma/space-separated list of tags
    const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text')
        // Only intercept if the pasted text looks like a list
        if (!text.includes(',') && !text.includes(' ')) return
        e.preventDefault()
        const tokens = text.split(/[,\s]+/)
        const remaining = 3 - tags.length
        const newTags = tokens
            .map(normalizeTag)
            .filter(t => t && !tags.includes(t))
            .slice(0, remaining)
        if (newTags.length > 0) {
            const updatedTags = [...tags, ...newTags]
            setTags(updatedTags)
            form.setValue('tags', updatedTags)
        }
        setTagInput('')
    }

    // --- Form submit ---

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
            setTags([])
            setTagInput('')
            setShowTagInput(false)
        })
    }

    const showTagSection = tags.length > 0 || showTagInput

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
                                            className="border-0 shadow-none resize-none min-h-20 focus-visible:ring-0"
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

                    {/* Tag section — chips + input field */}
                    {showTagSection && (
                        <div className="space-y-2">
                            {/* Existing tag chips */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="rounded-full hover:bg-secondary-foreground/20 p-0.5"
                                                aria-label={`Remove tag ${tag}`}
                                            >
                                                <X size={10} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Tag text input */}
                            {showTagInput && (
                                <input
                                    ref={tagInputRef}
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    onBlur={handleTagInputBlur}
                                    onPaste={handleTagPaste}
                                    placeholder={tags.length >= 3 ? 'Max 3 tags reached' : 'Add a tag… (Enter or , to confirm)'}
                                    disabled={tags.length >= 3}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                                    aria-label="Add tag"
                                />
                            )}
                        </div>
                    )}

                    <Separator />

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {/* Tag button — highlighted when the tag panel is open or tags exist */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onMouseDown={handleTagButtonMouseDown}
                                aria-label="Add tags"
                                aria-pressed={showTagInput}
                                className={showTagInput || tags.length > 0 ? 'text-primary' : 'text-muted-foreground'}
                            >
                                <TagIcon size={15} />
                            </Button>

                            {/* Coming-soon placeholders */}
                            <Button type="button" variant="ghost" size="icon-sm" disabled title="Media — coming soon" className="text-muted-foreground opacity-50">
                                <ImageIcon size={15} />
                            </Button>
                            <Button type="button" variant="ghost" size="icon-sm" disabled title="Add link — coming soon" className="text-muted-foreground opacity-50">
                                <Link size={15} />
                            </Button>
                            <Button type="button" variant="ghost" size="icon-sm" disabled title="Poll — coming soon" className="text-muted-foreground opacity-50">
                                <BarChart2 size={15} />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Character counter — only shown when content is non-empty */}
                            <span className={`text-xs ${remaining < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {content?.length > 0 ? `${remaining} remaining` : ''}
                            </span>

                            <Button type="submit" size="sm" disabled={isPending || !content?.trim()}>
                                Post
                                <ShortcutKey variant="inline"><span>⌘</span><span>ENTER</span></ShortcutKey>
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
