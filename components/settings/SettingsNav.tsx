'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { label: 'Account', href: '/settings/account' },
    { label: 'Privacy', href: '/settings/privacy' },
    { label: 'Appearance', href: '/settings/appearance' },
]

export const SettingsNav = () => {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop: vertical sidebar */}
            <nav className="hidden md:flex flex-col w-44 shrink-0 space-y-1">
                {NAV_ITEMS.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname.startsWith(item.href)
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Mobile: horizontal scrollable nav */}
            <nav className="md:hidden flex gap-1 border-b pb-2 overflow-x-auto">
                {NAV_ITEMS.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                            pathname.startsWith(item.href)
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </>
    )
}
