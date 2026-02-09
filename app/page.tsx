import prisma from '@/lib/prisma'
import HomeContent from '@/components/auth/HomeContent'

const Home = async () => {

    // tests 020226
    const users = await prisma.user.findMany()

    return (
        <div className="home flex flex-col items-center gap-10">
            <h1 className='text-3xl font-bold italic'>Kosmo</h1>
            <HomeContent users={users} />
        </div>
    )
}

export default Home