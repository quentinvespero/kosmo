'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"

export const FeedbackFormSection = () => {
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)}>
                Submit feedback
            </Button>
        )
    }

    return <FeedbackForm onSuccess={() => setIsOpen(false)} />
}
