'use client'

import { useState } from "react"
import Link from "next/link"
import { Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { FollowButton } from "./FollowButton"
import { updateProfile } from "@/lib/actions/settings"
import { toast } from "sonner"
import { getInitials } from "@/lib/utils"

type FollowStatus = 'NONE' | 'PENDING' | 'ACCEPTED'

type Props = {
    user: {
        id: string
        name: string
        username: string
        bio: string | null
        image: string | null
        createdAt: Date
        _count: { posts: number; followers: number; following: number }
    }
    isOwnProfile: boolean
    isPrivate: boolean
    // null when the viewer is not logged in — no follow button shown
    followStatus: FollowStatus | null
}

const joinedDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export const ProfileHeader = ({ user, isOwnProfile, isPrivate, followStatus }: Props) => {
    const [editing, setEditing] = useState(false)

    // local state so the UI reflects changes immediately after save
    const [displayName, setDisplayName] = useState(user.name)
    const [displayBio, setDisplayBio] = useState(user.bio ?? '')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        const id = 'update-profile'
        toast.loading('Saving...', { id })

        const result = await updateProfile({
            name: displayName,
            bio: displayBio || undefined
        })

        setSaving(false)

        if ('error' in result) {
            toast.error('Something went wrong', { id })
        } else {
            toast.success('Profile updated', { id })
            setEditing(false)
        }
    }

    const handleCancel = () => {
        // revert unsaved changes
        setDisplayName(user.name)
        setDisplayBio(user.bio ?? '')
        setEditing(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <Avatar className="size-20">
                    <AvatarImage src={user.image ?? undefined} alt={displayName} />
                    <AvatarFallback className="text-2xl">{getInitials(displayName)}</AvatarFallback>
                </Avatar>

                {isOwnProfile ? (
                    editing ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel} disabled={saving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving || !displayName.trim()}>
                                Save
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                                Edit profile
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/settings">
                                    <Settings className="size-4" />
                                    Settings
                                    <ShortcutKey>S</ShortcutKey>
                                </Link>
                            </Button>
                        </div>
                    )
                ) : followStatus !== null ? (
                    <FollowButton
                        targetUserId={user.id}
                        targetUsername={user.username}
                        initialStatus={followStatus}
                    />
                ) : null}
            </div>

            <div>
                {editing ? (
                    <Input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="text-xl font-bold h-auto py-1"
                        maxLength={50}
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">{displayName}</h1>
                        {isPrivate && (
                            <Badge variant="secondary" className="text-xs">Private</Badge>
                        )}
                    </div>
                )}
                <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {editing ? (
                <div className="space-y-1">
                    <Textarea
                        value={displayBio}
                        onChange={e => setDisplayBio(e.target.value)}
                        placeholder="Tell the world about yourself"
                        maxLength={160}
                        rows={3}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {displayBio.length}/160
                    </p>
                </div>
            ) : (
                displayBio && <p className="text-sm">{displayBio}</p>
            )}

            <p className="text-sm text-muted-foreground">
                Joined {joinedDate(user.createdAt)}
            </p>

            <Separator />

            <div className="flex gap-4 text-sm">
                <span>
                    <span className="font-semibold">{user._count.posts}</span>{' '}
                    <span className="text-muted-foreground">{user._count.posts === 1 ? 'post' : 'posts'}</span>
                </span>
                <span>
                    <span className="font-semibold">{user._count.followers}</span>{' '}
                    <span className="text-muted-foreground">followers</span>
                </span>
                <span>
                    <span className="font-semibold">{user._count.following}</span>{' '}
                    <span className="text-muted-foreground">following</span>
                </span>
            </div>
        </div>
    )
}
