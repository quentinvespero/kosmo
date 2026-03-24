import { PostComposer } from "@/components/home/PostComposer"
import HomeFeed from "@/components/home/HomeFeed"
import { ProfileLink } from "@/components/home/ProfileLink"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Suspense } from "react"

const Home = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    // session is guaranteed by the layout, but guard for type safety
    const username = session?.user.username

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            {/* Top bar */}
            <div className="flex justify-end">
                {username && <ProfileLink username={username} />}
            </div>
            <PostComposer />
            <Suspense fallback={<p className="text-sm text-muted-foreground text-center py-8">Loading feed...</p>}>
                <HomeFeed />
            </Suspense>
        </div>
    )
}

export default Home
