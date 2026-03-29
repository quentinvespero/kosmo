'use client'

import { useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { deletePost } from "@/lib/actions/post"

type Props = {
    postId: string
    authorUsername: string
    // If provided, clicking Edit triggers this callback (inline edit on detail page).
    // If omitted, clicking Edit navigates to the post detail page.
    onEditClick?: () => void
    // Controls context-specific behavior: 'home' hides Edit and stays on page after delete.
    context?: 'home' | 'profile'
}

export const PostActionsMenu = ({ postId, authorUsername, onEditClick, context = 'profile' }: Props) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleEdit = () => {
        if (onEditClick) {
            onEditClick()
        } else {
            router.push(`/${authorUsername}/${postId}`)
        }
    }

    const handleDelete = () => {
        startTransition(async () => {
            const toastId = toast.loading('Deleting post...')
            const result = await deletePost({ postId })
            if ('error' in result) {
                toast.error('Failed to delete post', { id: toastId })
                return
            }
            toast.success('Post deleted', { id: toastId })
            if (context === 'home') {
                // Re-render the feed in place so the deleted post disappears
                router.refresh()
            } else {
                router.push(`/${authorUsername}`)
            }
        })
    }

    return (
        // AlertDialog wraps DropdownMenu so the dialog can be triggered from within the dropdown
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Post actions" disabled={isPending}>
                        <MoreHorizontal size={15} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {context !== 'home' && (
                        <DropdownMenuItem onClick={handleEdit}>
                            Edit
                        </DropdownMenuItem>
                    )}
                    {/* Wrap delete in AlertDialogTrigger inside the dropdown */}
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
                    <AlertDialogTitle>Delete post?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the post and all its comments. This cannot be undone.
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
