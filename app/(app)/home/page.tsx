import SignoutButton from "@/components/auth/signoutButton"
import HomeContent from "@/components/home/HomeContent"
import prisma from "@/lib/prisma"

const Home = async () => {

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