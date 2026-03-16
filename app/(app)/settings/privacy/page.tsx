import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { PrivacySettingsForm } from "@/components/settings/PrivacySettingsForm"
import { Separator } from "@/components/ui/separator"

const PrivacySettingsPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })

    const prefs = await prisma.userPreferences.findUnique({
        where: { userId: session?.user.id ?? '' },
        select: { isPrivate: true, allowSubscribersOnPrivateProfile: true }
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Privacy</h2>
                <p className="text-sm text-muted-foreground mt-1">Control who can see your content</p>
            </div>

            <Separator />

            <PrivacySettingsForm
                isPrivate={prefs?.isPrivate ?? false}
                allowSubscribersOnPrivateProfile={prefs?.allowSubscribersOnPrivateProfile ?? false}
            />
        </div>
    )
}

export default PrivacySettingsPage
