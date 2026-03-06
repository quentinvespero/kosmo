import SignoutButton from "@/components/auth/signoutButton"
import HomeContent from "@/components/home/HomeContent"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const Home = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: { username: true }
    })

    // if the logged user has no username set yet, he's redirected to the onboarding where he can set one
    if (!user?.username) redirect('/onboarding')

    // tests 020226
    const users = await prisma.user.findMany()

    return (
        <div className="flex flex-col items-center gap-5">
            <h1>Home</h1>
            <HomeContent users={users} />
            <SignoutButton />
        </div>
    )
}

export default Home