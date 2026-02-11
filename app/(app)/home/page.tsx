import HomeContent from "@/components/home/HomeContent"
import prisma from "@/lib/prisma"

const Home = async () => {

    // tests 020226
    const users = await prisma.user.findMany()

    return (
        <div>
            <h1>Home</h1>
            <HomeContent users={users} />
        </div>
    )
}

export default Home