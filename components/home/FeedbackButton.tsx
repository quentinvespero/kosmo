'use client'

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"

export const FeedbackButton = () => {
    const router = useRouter()

    useKeyboardShortcut('f', () => router.push('/feedback'))

    return (
        <Button variant="outline" size="sm" asChild>
            <Link href="/feedback">
                Feedback
                <ShortcutKey>F</ShortcutKey>
            </Link>
        </Button>
    )
}
