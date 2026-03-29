// Shown by Next.js while home page server components are fetching
const HomeLoading = () => (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        {/* Post composer */}
        <div className="h-28 bg-muted animate-pulse rounded-lg" />

        {/* Feed items */}
        {[0, 1, 2].map(i => (
            <div key={i} className="flex gap-3 py-4 border-b">
                <div className="size-10 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-full bg-muted animate-pulse rounded" />
                    <div className="h-3 w-4/5 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-16 bg-muted animate-pulse rounded mt-2" />
                </div>
            </div>
        ))}
    </div>
)

export default HomeLoading
