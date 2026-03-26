'use client'

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Plus, Pencil } from "lucide-react"
import { RoadmapStatus, FeedbackType } from "@prisma/client"
import { createRoadmapItem, updateRoadmapItem } from "@/lib/actions/roadmap"
import { STATUS_META, FEEDBACK_TYPE_LABELS, ROADMAP_STATUSES } from "@/lib/roadmap"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Sentinel used in the Select UI for "no linked feedback"
const NO_FEEDBACK = "__none__"

// Looser form schema: feedbackId just needs to be a string (or absent);
// the server action validates the cuid format.
const formSchema = z.object({
    title:       z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    description: z.string().max(500, "Max 500 characters").optional(),
    status:      z.nativeEnum(RoadmapStatus),
    feedbackId:  z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export interface AvailableFeedback {
    id: string
    content: string
    type: FeedbackType
}

interface ExistingItem {
    id: string
    title: string
    description: string | null
    status: RoadmapStatus
    feedbackId: string | null
}

interface Props {
    defaultStatus: RoadmapStatus
    availableFeedbacks: AvailableFeedback[]
    existingItem?: ExistingItem
    // The currently-linked feedback (included in the dropdown even when editing)
    linkedFeedback?: AvailableFeedback | null
}

export const RoadmapItemDialog = ({
    defaultStatus,
    availableFeedbacks,
    existingItem,
    linkedFeedback,
}: Props) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const isEditing = !!existingItem

    // When editing, prepend the currently-linked feedback to the list so it remains selectable
    const feedbackOptions = linkedFeedback
        ? [linkedFeedback, ...availableFeedbacks.filter(f => f.id !== linkedFeedback.id)]
        : availableFeedbacks

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: isEditing
            ? {
                title:       existingItem.title,
                description: existingItem.description ?? undefined,
                status:      existingItem.status,
                feedbackId:  existingItem.feedbackId ?? NO_FEEDBACK,
              }
            : {
                status:     defaultStatus,
                feedbackId: NO_FEEDBACK,
              },
    })

    const resetAndClose = () => {
        setOpen(false)
        form.reset(
            isEditing
                ? {
                    title:       existingItem.title,
                    description: existingItem.description ?? undefined,
                    status:      existingItem.status,
                    feedbackId:  existingItem.feedbackId ?? NO_FEEDBACK,
                  }
                : { status: defaultStatus, feedbackId: NO_FEEDBACK }
        )
    }

    const onSubmit = (data: FormValues) => {
        // Convert sentinel back to undefined/null
        const feedbackId = data.feedbackId === NO_FEEDBACK ? undefined : data.feedbackId

        startTransition(async () => {
            const toastId = toast.loading(isEditing ? 'Updating item...' : 'Adding item...')

            const result = isEditing
                ? await updateRoadmapItem({
                    id:          existingItem.id,
                    title:       data.title,
                    description: data.description || null,
                    status:      data.status,
                    feedbackId:  feedbackId ?? null,
                  })
                : await createRoadmapItem({
                    title:       data.title,
                    description: data.description || undefined,
                    status:      data.status,
                    feedbackId,
                  })

            if ('error' in result) {
                toast.error(isEditing ? 'Failed to update item' : 'Failed to add item', { id: toastId })
                return
            }

            toast.success(isEditing ? 'Item updated' : 'Item added', { id: toastId })
            resetAndClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetAndClose(); else setOpen(true) }}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Edit item">
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                ) : (
                    <Button variant="ghost" size="sm" className="w-full border border-dashed text-muted-foreground hover:text-foreground">
                        <Plus className="h-4 w-4 mr-1" />
                        Add item
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit item' : 'Add roadmap item'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Dark mode" maxLength={100} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description{' '}
                                        <span className="text-muted-foreground font-normal">(optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief explanation of what this feature does..."
                                            className="resize-none min-h-20"
                                            maxLength={500}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ROADMAP_STATUSES.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {STATUS_META[status].label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Linked feedback */}
                        <FormField
                            control={form.control}
                            name="feedbackId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Linked feedback{' '}
                                        <span className="text-muted-foreground font-normal">(optional)</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NO_FEEDBACK}>None</SelectItem>
                                            {feedbackOptions.map((f) => (
                                                <SelectItem key={f.id} value={f.id}>
                                                    <span className="text-xs text-muted-foreground mr-1">
                                                        [{FEEDBACK_TYPE_LABELS[f.type]}]
                                                    </span>
                                                    {f.content.length > 60
                                                        ? f.content.slice(0, 60) + '…'
                                                        : f.content}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {isEditing ? 'Save changes' : 'Add item'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
