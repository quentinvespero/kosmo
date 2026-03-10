import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

type Props = {
    user: {
        name: string
        username: string
        bio: string | null
        image: string | null
        createdAt: Date
        _count: { posts: number }
    }
    isOwnProfile: boolean
}

// Generates initials from a display name (e.g. "John Doe" → "JD")
const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const joinedDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export const ProfileHeader = ({ user, isOwnProfile }: Props) => {
    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <Avatar className="size-20">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                    <Button variant="outline" asChild>
                        <Link href="/settings/profile">Edit profile</Link>
                    </Button>
                )}
            </div>

            <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {user.bio && <p className="text-sm">{user.bio}</p>}

            <p className="text-sm text-muted-foreground">
                Joined {joinedDate(user.createdAt)}
            </p>

            <Separator />

            <p className="text-sm">
                <span className="font-semibold">{user._count.posts}</span>{' '}
                <span className="text-muted-foreground">{user._count.posts === 1 ? 'post' : 'posts'}</span>
            </p>
        </div>
    )
}
