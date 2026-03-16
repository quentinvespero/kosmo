'use client'

import { useState } from "react"
import { updatePrivacy } from "@/lib/actions/settings"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Props = {
    isPrivate: boolean
    allowSubscribersOnPrivateProfile: boolean
}

export const PrivacySettingsForm = ({ isPrivate, allowSubscribersOnPrivateProfile }: Props) => {
    const [privacy, setPrivacy] = useState(isPrivate)
    const [allowSubs, setAllowSubs] = useState(allowSubscribersOnPrivateProfile)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        const id = 'update-privacy'
        toast.loading('Saving...', { id })

        const result = await updatePrivacy({
            isPrivate: privacy,
            allowSubscribersOnPrivateProfile: allowSubs
        })

        setSaving(false)

        if ('error' in result) {
            toast.error('Something went wrong', { id })
        } else {
            toast.success('Privacy settings saved', { id })
        }
    }

    return (
        <div className="space-y-6">
            <ToggleSetting
                label="Private profile"
                description="Only approved followers can see your posts"
                checked={privacy}
                onChange={setPrivacy}
            />

            <Separator />

            <ToggleSetting
                label="Allow subscribers on private profile"
                description="Subscribers can see your posts even without follow approval"
                checked={allowSubs}
                onChange={setAllowSubs}
                // only meaningful when the profile is private
                disabled={!privacy}
            />

            <Button onClick={handleSave} disabled={saving}>
                Save changes
            </Button>
        </div>
    )
}

type ToggleSettingProps = {
    label: string
    description: string
    checked: boolean
    onChange: (value: boolean) => void
    disabled?: boolean
}

const ToggleSetting = ({ label, description, checked, onChange, disabled }: ToggleSettingProps) => (
    <label className={cn(
        "flex items-center justify-between gap-4 cursor-pointer",
        disabled && "opacity-50 pointer-events-none"
    )}>
        <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Accessible native checkbox, hidden visually */}
        <input
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="sr-only"
            disabled={disabled}
        />

        {/* Custom toggle pill */}
        <div className={cn(
            "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
            checked ? "bg-primary" : "bg-input"
        )}>
            <span className={cn(
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
                checked ? "translate-x-5" : "translate-x-0"
            )} />
        </div>
    </label>
)
