import { cn } from "@/lib/utils"

type ShortcutKeyProps = {
    children: React.ReactNode
    variant?: 'default' | 'inline'
    className?: string
}

export const ShortcutKey = ({ children, variant = 'default', className }: ShortcutKeyProps) => (
    <kbd className={cn(
        "pointer-events-none flex h-5 items-center justify-center rounded border font-mono text-[10px] font-bold",
        variant === 'default' && "w-5 border-muted-foreground/30 text-muted-foreground/50",
        variant === 'inline' && "gap-1 border-current px-1 opacity-60",
        className,
    )}>
        {children}
    </kbd>
)
