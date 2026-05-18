'use client'

import { type MouseEventHandler } from "react"
import { Button } from "@/components/ui/button"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tag as TagIcon, ImageIcon, Link as LinkIcon, BarChart2, Plus } from "lucide-react"

interface ComposerToolbarProps {
    // Which icons to show
    showTags?: boolean
    showImage?: boolean
    showLink?: boolean
    showPoll?: boolean

    // Tag button state (only when showTags)
    tagActive?: boolean
    onTagButtonMouseDown?: MouseEventHandler<HTMLButtonElement>

    // Character counter — hidden when remaining === maxLength (content is empty)
    remaining: number
    maxLength: number

    // Submit button
    submitDisabled: boolean
    submitLabel?: string
}

export const ComposerToolbar = ({
    showTags,
    showImage,
    showLink,
    showPoll,
    tagActive,
    onTagButtonMouseDown,
    remaining,
    maxLength,
    submitDisabled,
    submitLabel = 'Post',
}: ComposerToolbarProps) => {
    const comingSoonItems = [
        showImage && { icon: <ImageIcon size={15} />, label: 'Media', title: 'Media — coming soon' },
        showLink  && { icon: <LinkIcon  size={15} />, label: 'Link',  title: 'Link — coming soon' },
        showPoll  && { icon: <BarChart2 size={15} />, label: 'Poll',  title: 'Poll — coming soon' },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; title: string }[]

    return (
        <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {/* Tag button — stays inline, never collapsed into the dropdown */}
                    {showTags && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onMouseDown={onTagButtonMouseDown}
                            aria-label="Add tags"
                            aria-pressed={tagActive}
                            className={tagActive ? 'text-primary' : 'text-muted-foreground'}
                        >
                            <TagIcon size={15} />
                        </Button>
                    )}

                    {/* Coming-soon icons — shown individually on sm+, collapsed into "+" on mobile */}
                    {comingSoonItems.length > 0 && (
                        <>
                            <div className="hidden sm:flex items-center gap-1">
                                {comingSoonItems.map(item => (
                                    <Button key={item.label} type="button" variant="ghost" size="icon-sm" disabled title={item.title} className="text-muted-foreground opacity-50">
                                        {item.icon}
                                    </Button>
                                ))}
                            </div>

                            <div className="flex sm:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="More options">
                                            <Plus size={15} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {comingSoonItems.map(item => (
                                            <DropdownMenuItem key={item.label} disabled>
                                                <span className="mr-2">{item.icon}</span>
                                                {item.label} — coming soon
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className={`text-xs ${remaining < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {remaining < maxLength ? `${remaining} remaining` : ''}
                    </span>

                    <Button type="submit" size="sm" variant="secondary" disabled={submitDisabled}>
                        {submitLabel}
                        <ShortcutKey variant="inline"><span className="text-base">⌘</span><span>ENTER</span></ShortcutKey>
                    </Button>
                </div>
        </div>
    )
}
