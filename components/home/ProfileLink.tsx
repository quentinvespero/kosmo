'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export const ProfileLink = ({ username }: { username: string }) => {
    const router = useRouter()

    // Global keyboard shortcut: "p" navigates to the user's profile
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'p') return
            const target = e.target as HTMLElement
            // Don't intercept if the user is typing somewhere
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) return
            e.preventDefault()
            router.push(`/${username}`)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [router, username])

    return (
        <Button variant="outline" size="sm" asChild>
            <Link href={`/${username}`}>
                <User className="size-4" />
                My profile
                <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded border border-muted-foreground/30 font-mono text-[10px] text-muted-foreground/50">
                    p
                </kbd>
            </Link>
        </Button>
    )
}
