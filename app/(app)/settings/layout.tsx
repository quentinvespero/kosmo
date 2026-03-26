import { SettingsNav } from "@/components/settings/SettingsNav"
import { BackButton } from "@/components/ui/BackButton"

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <BackButton />
            <h1 className="text-2xl font-bold mb-8">Settings</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <SettingsNav />
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SettingsLayout
