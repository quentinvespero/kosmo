'use client'

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createFeedbackSchema, type CreateFeedbackInput } from "@/lib/schemas/FeedbackSchemas"
import { submitFeedback } from "@/lib/actions/feedback"
import { Button } from "@/components/ui/button"
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

interface FeedbackFormProps {
    onSuccess?: () => void
}

export const FeedbackForm = ({ onSuccess }: FeedbackFormProps) => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateFeedbackInput>({
        resolver: zodResolver(createFeedbackSchema),
        defaultValues: { content: '', showUsername: true },
    })

    const content = form.watch('content')
    const remaining = 1000 - content.length

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
            onSuccess?.()
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Type selector */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
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
    )
}
