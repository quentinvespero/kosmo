// Shown by Next.js while profile page server components are fetching
const ProfileLoading = () => (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        {/* Back button */}
        <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />

        {/* Profile header */}
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="h-16 w-16 bg-muted animate-pulse rounded-full shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
            </div>
            {/* Bio */}
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
            {/* Stats */}
            <div className="flex gap-6">
                {[0, 1, 2].map(i => (
                    <div key={i} className="h-3 w-16 bg-muted animate-pulse rounded" />
                ))}
            </div>
        </div>

        {/* Post list */}
        {[0, 1, 2].map(i => (
            <div key={i} className="space-y-2 py-4 border-b">
                <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-4/5 bg-muted animate-pulse rounded" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded mt-2" />
            </div>
        ))}
    </div>
)

export default ProfileLoading
