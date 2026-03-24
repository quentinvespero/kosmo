import Link from "next/link"

interface Props {
    username: string | null
    name: string | null
    content: string
    createdAt: Date
}

// Format date as "Mar 20, 2026"
const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const FeedbackItem = ({ username, name, content, createdAt }: Props) => (
    <div className="py-4 space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {username ? (
                <Link href={`/@${username}`} className="font-medium text-foreground hover:underline">
                    @{username}
                </Link>
            ) : (
                // Deleted or anonymous user fallback
                <span className="font-medium text-foreground">{name ?? "Unknown"}</span>
            )}
            <span>—</span>
            <span>{formatDate(createdAt)}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
)
