import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { UpdateUsernameForm } from "@/components/settings/UpdateUsernameForm"
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog"
import { ExportDataButton } from "@/components/settings/ExportDataButton"
import { Separator } from "@/components/ui/separator"
import prisma from "@/lib/prisma"

const AccountSettingsPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    const userData = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: { lastDataExportAt: true }
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Account</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your account details</p>
            </div>

            <Separator />

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Username</h3>
                <p className="text-sm text-muted-foreground">
                    Your username is how others find and mention you.
                </p>
                <UpdateUsernameForm currentUsername={session!.user.username ?? ''} />
            </div>

            <Separator />

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Your data</h3>
                <p className="text-sm text-muted-foreground">
                    Download a copy of all your personal data (GDPR Art. 20 — right to data portability).
                    The export includes your profile, posts, comments, votes, drafts, and more.
                </p>
                <ExportDataButton lastExportedAt={userData?.lastDataExportAt?.toISOString() ?? null} />
            </div>

            <Separator />

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Account actions</h3>
                <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This cannot be undone.
                </p>
                <DeleteAccountDialog />
            </div>
        </div>
    )
}

export default AccountSettingsPage
