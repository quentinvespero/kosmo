import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FollowButton } from "./FollowButton"
import Link from "next/link"

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

// Generates initials from a display name (e.g. "John Doe" → "JD")
const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const joinedDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export const ProfileHeader = ({ user, isOwnProfile, isPrivate, followStatus }: Props) => {
    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <Avatar className="size-20">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>

                {isOwnProfile ? (
                    <Button variant="outline" asChild>
                        <Link href="/settings/profile">Edit profile</Link>
                    </Button>
                ) : followStatus !== null ? (
                    <FollowButton
                        targetUserId={user.id}
                        targetUsername={user.username}
                        initialStatus={followStatus}
                    />
                ) : null}
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    {isPrivate && (
                        <Badge variant="secondary" className="text-xs">Private</Badge>
                    )}
                </div>
                <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {user.bio && <p className="text-sm">{user.bio}</p>}

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
