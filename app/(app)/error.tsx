'use client'

import { useEffect } from "react"
import ErrorFallback from "@/components/ErrorFallback"

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorFallback
            title="Something went wrong"
            message="An unexpected error occurred. Try again or come back later."
            reset={reset}
        />
    )
}
