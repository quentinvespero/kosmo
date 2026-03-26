'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"

export const FeedbackButton = () => {
    const router = useRouter()

    // Global keyboard shortcut: "f" navigates to the feedback page
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'f') return
            const target = e.target as HTMLElement
            // Don't intercept if the user is already typing somewhere
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) return
            e.preventDefault()
            router.push('/feedback')
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [router])

    return (
        <Button variant="outline" size="sm" asChild>
            <Link href="/feedback">
                Feedback
                <ShortcutKey>F</ShortcutKey>
            </Link>
        </Button>
    )
}
