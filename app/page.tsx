'use client'
import { PrismaClient } from './generated/prisma'

const Home = () => {
    
    const prisma = new PrismaClient()

    const createUser = async () => {
        try {
            prisma.user.create({data: {username:"quentin", email:"quentinvespero@gmail.com"}})
        }
        catch (error) {
            console.log('marche po', error)
        }
    }

    return (
        <div className="home">
            <button onClick={() => createUser()}>TURLUTUTU</button>
        </div>
    )
}

export default Home