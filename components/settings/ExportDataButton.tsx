'use client'

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { EXPORT_COOLDOWN_MS } from "@/lib/constants"

interface Props {
    lastExportedAt?: string | null
}

export const ExportDataButton = ({ lastExportedAt }: Props) => {
    const [loading, setLoading] = useState(false)
    const [exportedAt, setExportedAt] = useState(lastExportedAt)
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (!exportedAt) return
        const endMs = new Date(exportedAt).getTime() + EXPORT_COOLDOWN_MS
        const msUntilEnd = endMs - Date.now()
        if (msUntilEnd <= 0) return

        // Update the countdown label every minute
        const interval = setInterval(() => setNow(Date.now()), 60_000)
        // Re-enable the button exactly when the cooldown expires
        const timeout = setTimeout(() => setNow(Date.now()), msUntilEnd)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [exportedAt])

    const { isOnCooldown, minutesLeft, formattedDate } = useMemo(() => {
        if (!exportedAt) return { isOnCooldown: false, minutesLeft: 0, formattedDate: null }
        const exportedAtMs = new Date(exportedAt).getTime()
        const msLeft = exportedAtMs + EXPORT_COOLDOWN_MS - now
        return {
            isOnCooldown: msLeft > 0,
            minutesLeft: Math.ceil(msLeft / 60000),
            formattedDate: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(exportedAt)),
        }
    }, [exportedAt, now])

    const handleExport = async () => {
        const toastId = 'export-data'
        toast.loading('Preparing your data export...', { id: toastId })
        setLoading(true)

        try {
            const response = await fetch('/api/export-data')

            if (!response.ok) {
                const body = await response.json()
                if (response.status === 429 && body.lastExportedAt) setExportedAt(body.lastExportedAt)
                toast.error(body.error ?? 'Failed to export data. Please try again.', { id: toastId })
                return
            }

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            // Filename comes from the server's Content-Disposition header
            const filename = response.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] ?? 'kosmo-data-export.json'

            const a = document.createElement('a')
            a.href = url
            a.download = filename
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
