import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { UpdateUsernameForm } from "@/components/settings/UpdateUsernameForm"
import { Separator } from "@/components/ui/separator"

const AccountSettingsPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })

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
        </div>
    )
}

export default AccountSettingsPage
