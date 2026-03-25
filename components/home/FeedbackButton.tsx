'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"

export const FeedbackButton = () => {
    const [open, setOpen] = useState(false)

    // Global keyboard shortcut: "f" opens the feedback popover
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
            setOpen(true)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    Feedback
                    <ShortcutKey>F</ShortcutKey>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96">
                <PopoverHeader className="mb-4">
                    <PopoverTitle className="font-semibold">Send feedback</PopoverTitle>
                </PopoverHeader>
                <FeedbackForm onSuccess={() => setOpen(false)} />
            </PopoverContent>
        </Popover>
    )
}
