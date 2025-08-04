import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

const Home = () => {

    // ---- testing out ----
    const user1 = {username:"quentin4", email:"quentinvespero4@gmail.com"}

    const createUser = async () => {
        'use server'
        try {
            // const user = await prisma.user.create({data: user1})
            const userList = await prisma.user.findMany()
            console.log(userList)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }

    return (
        <div className="home">
            <button onClick={createUser}>TURLUTUTU</button>
        </div>
    )
}

export default Home