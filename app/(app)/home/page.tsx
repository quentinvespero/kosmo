import { PostComposer } from "@/components/home/PostComposer"
import HomeFeed from "@/components/home/HomeFeed"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

const Home = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    // session is guaranteed by the layout, but guard for type safety
    const username = session?.user.username

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            {/* Top bar */}
            <div className="flex justify-end">
                {username && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/${username}`}>
                            <User className="size-4" />
                            My profile
                        </Link>
                    </Button>
                )}
            </div>
            <PostComposer />
            <Suspense fallback={<p className="text-sm text-muted-foreground text-center py-8">Loading feed...</p>}>
                <HomeFeed />
            </Suspense>
        </div>
    )
}

export default Home
