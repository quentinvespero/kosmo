import { PrismaClient, Language } from './generated/prisma'

const prisma = new PrismaClient()

const Home = () => {

    // ---- testing out ----
    const user1 = {username:"quentin7", email:"quentin7@gmail.com"}
    const user1Preferences = {userPreferences:{create: {language: Language.GERMAN}}}

    const createUser = async () => {
        'use server'
        try {
            const user = await prisma.user.create({data: user1})
            console.log(user)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }
    const createUserWithPreferences = async () => {
        'use server'
        try {
            // const user = await prisma.user.create({data: user1})
            const user = await prisma.user.create({data: {...user1, ...user1Preferences}, include:{userPreferences:true}})
            console.log(user)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }
    
    const listUsers = async () => {
        'use server'
        try {
            const userList = await prisma.user.findMany({include:{userPreferences:true,posts:true, drafts:true}})
            console.log(userList)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }
    
    const findUser1 = async () => {
        'use server'
        try {
            const userFound = await prisma.user.findUnique({where:{email:'quentin'}})
            console.log(userFound)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }

    const deleteUser = async () => {
        'use server'
        try {
            // const user = await prisma.user.create({data: user1})
            const userList = await prisma.user.delete({where:user1})
            console.log(userList)
        }
        catch (error) {
            console.log('######### marche po #########', error)
        }
    }

    return (
        <div className="home">
            <button style={{cursor:'pointer'}} onClick={createUser}>create user</button>
            <p>•</p>
            <button style={{cursor:'pointer'}} onClick={createUserWithPreferences}>create user with preferences</button>
            <p>•</p>
            <button style={{cursor:'pointer'}} onClick={listUsers}>list users</button>
            <p>•</p>
            <button style={{cursor:'pointer'}} onClick={findUser1}>find user1</button>
            <p>•</p>
            <button style={{cursor:'pointer'}} onClick={deleteUser}>delete user</button>
        </div>
    )
}

export default Home