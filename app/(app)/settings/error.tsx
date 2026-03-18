'use client'

import { useEffect } from "react"
import ErrorFallback from "@/components/ErrorFallback"

export default function SettingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorFallback
            title="Could not load settings"
            message="There was a problem loading your settings. Try again or refresh."
            reset={reset}
        />
    )
}
