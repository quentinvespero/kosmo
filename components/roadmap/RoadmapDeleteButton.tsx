'use client'

import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteRoadmapItem } from "@/lib/actions/roadmap"

interface Props {
    id: string
}

export const RoadmapDeleteButton = ({ id }: Props) => {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!window.confirm("Delete this item? This cannot be undone.")) return
        startTransition(async () => {
            const toastId = toast.loading('Deleting item...')
            const result = await deleteRoadmapItem({ id })
            if ('error' in result) {
                toast.error('Failed to delete item', { id: toastId })
                return
            }
            toast.success('Item deleted', { id: toastId })
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete item"
        >
            <Trash2 className="h-3.5 w-3.5" />
        </Button>
    )
}
