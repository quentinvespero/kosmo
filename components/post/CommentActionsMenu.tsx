'use client'

import { useTransition } from "react"
import { toast } from "sonner"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteComment } from "@/lib/actions/post"

type Props = {
    commentId: string
    onEditClick: () => void
}

export const CommentActionsMenu = ({ commentId, onEditClick }: Props) => {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            const toastId = toast.loading('Deleting comment...')
            const result = await deleteComment({ commentId })
            if ('error' in result) {
                toast.error('Failed to delete comment', { id: toastId })
                return
            }
            toast.success('Comment deleted', { id: toastId })
        })
    }

    return (
        // AlertDialog wraps DropdownMenu so the dialog can be triggered from within the dropdown
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Comment actions" disabled={isPending}>
                        <MoreHorizontal size={14} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEditClick}>
                        Edit
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={e => e.preventDefault()}
                        >
                            Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your comment will be removed. If others have replied to it, it will be kept as
                        {" "}<span className="italic">"Comment removed."</span>{" "}
                        to preserve the thread.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
