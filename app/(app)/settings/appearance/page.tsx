import { Separator } from "@/components/ui/separator"

const AppearanceSettingsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground mt-1">Customize how Kosmo looks for you</p>
            </div>

            <Separator />

            <p className="text-sm text-muted-foreground">
                Appearance settings coming soon.
            </p>
        </div>
    )
}

export default AppearanceSettingsPage
