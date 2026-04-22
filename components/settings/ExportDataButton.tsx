'use client'

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { exportUserData, EXPORT_COOLDOWN_MS } from "@/lib/actions/settings"

interface Props {
    lastExportedAt?: string | null
}

export const ExportDataButton = ({ lastExportedAt }: Props) => {
    const [loading, setLoading] = useState(false)
    const [exportedAt, setExportedAt] = useState(lastExportedAt)
    const [now, setNow] = useState(() => Date.now())

    // Tick every minute while cooldown is active so the label stays accurate
    useEffect(() => {
        if (!exportedAt) return
        const endMs = new Date(exportedAt).getTime() + EXPORT_COOLDOWN_MS
        if (endMs <= Date.now()) return

        const interval = setInterval(() => {
            const current = Date.now()
            setNow(current)
            if (current >= endMs) clearInterval(interval)
        }, 60_000)

        return () => clearInterval(interval)
    }, [exportedAt])

    const { isOnCooldown, minutesLeft, formattedDate } = useMemo(() => {
        if (!exportedAt) return { isOnCooldown: false, minutesLeft: 0, formattedDate: null }
        const exportedAtMs = new Date(exportedAt).getTime()
        const msLeft = exportedAtMs + EXPORT_COOLDOWN_MS - now
        return {
            isOnCooldown: msLeft > 0,
            minutesLeft: Math.max(1, Math.ceil(msLeft / 60000)),
            formattedDate: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(exportedAt)),
        }
    }, [exportedAt, now])

    const handleExport = async () => {
        const toastId = 'export-data'
        toast.loading('Preparing your data export...', { id: toastId })
        setLoading(true)

        try {
            const result = await exportUserData()

            if ('error' in result) {
                toast.error(result.error, { id: toastId })
                return
            }

            const json = JSON.stringify(result.data, null, 2)
            const blob = new Blob([json], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const date = new Date().toISOString().split('T')[0]

            const a = document.createElement('a')
            a.href = url
            a.download = `kosmo-data-export-${date}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            setExportedAt(new Date().toISOString())

            toast.success('Your data has been downloaded', { id: toastId })
        } catch {
            toast.error('Failed to export data. Please try again.', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    const buttonLabel = loading
        ? 'Preparing export...'
        : isOnCooldown
            ? `Available in ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}`
            : 'Export my data'

    return (
        <div className="space-y-1">
            <Button variant="outline" onClick={handleExport} disabled={loading || isOnCooldown}>
                <Download className="size-4 mr-2" />
                {buttonLabel}
            </Button>
            {formattedDate && (
                <p className="text-xs text-muted-foreground">Last exported: {formattedDate}</p>
            )}
        </div>
    )
}
