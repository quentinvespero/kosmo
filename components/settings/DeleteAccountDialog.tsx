'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "@/lib/authClient"
import { deleteAccount } from "@/lib/actions/settings"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const DeleteAccountDialog = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [confirmation, setConfirmation] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        const toastId = toast.loading('Deleting your account…')

        let result
        try {
            result = await deleteAccount()
        } catch {
            toast.error('Unexpected error', { id: toastId })
            setLoading(false)
            return
        }

        if (result.error) {
            toast.error('Failed to delete account', { id: toastId })
            setLoading(false)
            return
        }

        toast.success('Account deleted', { id: toastId })
        setOpen(false)
        try {
            await signOut()
        } finally {
            // Session is already invalid — redirect regardless of signOut outcome
            router.push('/signin')
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={(v) => { setOpen(v); setConfirmation('') }}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your account, posts, comments, and all associated data.
                        This action <strong>cannot be undone</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2 py-2">
                    <Label htmlFor="confirm-delete" className="text-sm">
                        Type <span className="font-mono font-semibold">DELETE</span> to confirm
                    </Label>
                    <Input
                        id="confirm-delete"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder="DELETE"
                        autoComplete="off"
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={confirmation !== 'DELETE' || loading}
                        onClick={handleDelete}
                    >
                        {loading ? 'Deleting…' : 'Delete account'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
