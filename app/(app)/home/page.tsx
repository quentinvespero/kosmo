import { PostComposer } from "@/components/home/PostComposer"
import HomeFeed from "@/components/home/HomeFeed"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

const Home = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: { username: true }
    })

    // in case the user has no username (handle) set yet, redirect to onboarding
    if (!user?.username) redirect('/onboarding')

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            <PostComposer />
            <Suspense fallback={<p className="text-sm text-muted-foreground text-center py-8">Loading feed...</p>}>
                <HomeFeed />
            </Suspense>
        </div>
    )
}

export default Home
