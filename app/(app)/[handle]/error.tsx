'use client'

import { useEffect } from "react"
import ErrorFallback from "@/components/ErrorFallback"

export default function ProfileError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorFallback
            title="Could not load this profile"
            message="There was a problem fetching this profile. Try again in a moment."
            reset={reset}
        />
    )
}
