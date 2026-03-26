'use client'

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { User } from "lucide-react"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"

export const ProfileLink = ({ username }: { username: string }) => {
    const router = useRouter()

    useKeyboardShortcut('p', () => router.push(`/${username}`))

    return (
        <Button variant="outline" size="sm" asChild>
            <Link href={`/${username}`}>
                <User className="size-4" />
                My profile
                <ShortcutKey>P</ShortcutKey>
            </Link>
        </Button>
    )
}
