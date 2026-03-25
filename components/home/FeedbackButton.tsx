'use client'

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createFeedbackSchema, type CreateFeedbackInput } from "@/lib/schemas/FeedbackSchemas"
import { submitFeedback } from "@/lib/actions/feedback"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const FEEDBACK_TYPE_LABELS: Record<CreateFeedbackInput['type'], string> = {
    BUG: "Bug report",
    FEATURE_REQUEST: "Feature request",
    GENERAL: "General feedback",
}

export const FeedbackButton = () => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateFeedbackInput>({
        resolver: zodResolver(createFeedbackSchema),
        defaultValues: { content: '', showUsername: true },
    })

    const content = form.watch('content')
    const remaining = 1000 - content.length

    // Global keyboard shortcut: "f" opens the feedback dialog
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'f') return
            const target = e.target as HTMLElement
            // Don't intercept if the user is already typing somewhere
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) return
            e.preventDefault()
            setOpen(true)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const onSubmit = (data: CreateFeedbackInput) => {
        startTransition(async () => {
            const toastId = toast.loading('Sending feedback...')
            const result = await submitFeedback(data)
            if ('error' in result) {
                toast.error('Failed to send feedback', { id: toastId })
                return
            }
            toast.success('Feedback sent — thank you!', { id: toastId })
            form.reset()
            setOpen(false)
        })
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) form.reset() }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Feedback
                    <ShortcutKey>F</ShortcutKey>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send feedback</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Type selector */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(FEEDBACK_TYPE_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Content textarea */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your feedback..."
                                            className="resize-none min-h-32"
                                            maxLength={1000}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Show username toggle */}
                        <FormField
                            control={form.control}
                            name="showUsername"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <FormLabel className="text-sm text-muted-foreground cursor-pointer">
                                        Show my name on this feedback
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between">
                            {/* Character counter — only shown when content is non-empty */}
                            <span className={`text-xs ${remaining < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {content.length > 0 ? `${remaining} remaining` : ''}
                            </span>
                            <Button type="submit" disabled={isPending || !content.trim()}>
                                Send
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
