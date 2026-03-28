// Shown by Next.js while post detail server components are fetching
const PostDetailLoading = () => (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        {/* Back button */}
        <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />

        {/* Post article */}
        <div className="space-y-3">
            <div className="h-3 w-40 bg-muted animate-pulse rounded" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
            {/* Tags */}
            <div className="flex gap-2 pt-1">
                <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
                <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            </div>
            {/* Vote buttons */}
            <div className="flex gap-2 pt-1">
                <div className="h-7 w-16 bg-muted animate-pulse rounded-md" />
                <div className="h-7 w-16 bg-muted animate-pulse rounded-md" />
            </div>
        </div>

        <div className="h-px bg-muted" />

        {/* Comments section */}
        <div className="space-y-4">
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
            <div className="h-px bg-muted" />
            {/* Comment skeletons */}
            {[0, 1].map(i => (
                <div key={i} className="space-y-2 py-2">
                    <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-full bg-muted animate-pulse rounded" />
                    <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
                </div>
            ))}
        </div>
    </div>
)

export default PostDetailLoading
