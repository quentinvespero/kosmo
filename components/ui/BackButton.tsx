'use client'

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
    fallback?: string
}

export const BackButton = ({ fallback }: BackButtonProps) => {
    const router = useRouter()

    const handleBack = () => {
        if (fallback) {
            const isInternalReferrer = document.referrer.startsWith(window.location.origin)
            if (!document.referrer || !isInternalReferrer) {
                router.push(fallback)
                return
            }
        }
        router.back()
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-2">
            <ArrowLeft className="size-4" />
            Back
        </Button>
    )
}
