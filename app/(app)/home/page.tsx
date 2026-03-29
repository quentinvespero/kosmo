import { PostComposer } from "@/components/home/PostComposer"
import HomeFeed from "@/components/home/HomeFeed"
import { Suspense } from "react"

const Home = async () => (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        <PostComposer />
        <Suspense fallback={<p className="text-sm text-muted-foreground text-center py-8">Loading feed...</p>}>
            <HomeFeed />
        </Suspense>
    </div>
)

export default Home
