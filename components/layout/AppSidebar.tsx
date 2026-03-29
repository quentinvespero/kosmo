'use client'

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Home, User, Settings, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { cn, getInitials } from "@/lib/utils"

type Props = {
    username: string
    userName: string
    userImage: string | null
}

export const AppSidebar = ({ username, userName, userImage }: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
        { label: 'Home',     href: '/home',        icon: Home,          shortcut: 'h' },
        { label: 'Profile',  href: `/${username}`, icon: User,          shortcut: 'p' },
        { label: 'Settings', href: '/settings',    icon: Settings,      shortcut: 's' },
        { label: 'Feedback', href: '/feedback',    icon: MessageSquare, shortcut: 'f' },
    ]

    // Global nav shortcuts
    useKeyboardShortcut('h', () => router.push('/home'))
    useKeyboardShortcut('p', () => router.push(`/${username}`))
    useKeyboardShortcut('s', () => router.push('/settings'))
    useKeyboardShortcut('f', () => router.push('/feedback'))

    const isActive = (href: string) =>
        href === '/settings' ? pathname.startsWith('/settings') : pathname === href

    return (
        <aside className="sticky top-0 h-screen w-16 sm:w-20 xl:w-64 shrink-0 flex flex-col border-r border-border px-2 xl:px-4 py-4">
            {/* Logo */}
            <Link href="/home" className="mb-6 flex items-center gap-3 px-2 py-1 justify-center xl:justify-start">
                <Image
                    src="/logo_light.png"
                    alt="Kosmo"
                    width={32}
                    height={32}
                    className="size-8 dark:hidden"
                />
                <Image
                    src="/logo_dark.png"
                    alt="Kosmo"
                    width={32}
                    height={32}
                    className="size-8 hidden dark:block"
                />
                <span className="hidden xl:block font-bold text-lg">Kosmo</span>
            </Link>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors justify-center xl:justify-start",
                            isActive(item.href)
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        <item.icon className="size-5 shrink-0" />
                        {/* Label + shortcut key — only visible when sidebar is expanded */}
                        <span className="hidden xl:flex xl:flex-1 xl:items-center xl:justify-between">
                            {item.label}
                            <ShortcutKey>{item.shortcut.toUpperCase()}</ShortcutKey>
                        </span>
                    </Link>
                ))}
            </nav>

            {/* User identity */}
            <div className="flex items-center gap-3 px-2 py-2 justify-center xl:justify-start">
                <Avatar className="shrink-0">
                    <AvatarImage src={userImage ?? undefined} alt={userName} />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex flex-col min-w-0 leading-tight">
                    <span className="text-sm font-medium truncate">{userName}</span>
                    <span className="text-xs text-muted-foreground truncate">@{username}</span>
                </div>
            </div>
        </aside>
    )
}
