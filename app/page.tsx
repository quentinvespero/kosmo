
import Link from 'next/link'
import { PrismaClient, Language } from './generated/prisma'

const prisma = new PrismaClient()

const Home = () => {

    // ---- testing out prisma ----
    // ----------------------------------------------------------------
    const user1 = { username: "quentin7", email: "quentin7@gmail.com" }
    const user1Preferences = { userPreferences: { create: { language: Language.GERMAN } } }
    
    const createUser = async () => {
        'use server'
        try {
            const user = await prisma.user.create({ data: user1 })
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
            const user = await prisma.user.create({ data: { ...user1, ...user1Preferences }, include: { userPreferences: true } })
            console.log(user)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }
    
    const listUsers = async () => {
        'use server'
        try {
            const userList = await prisma.user.findMany({ include: { userPreferences: true, posts: true, drafts: true } })
            console.log(userList)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }
    
    const findUser1 = async () => {
        'use server'
        try {
            const userFound = await prisma.user.findUnique({ where: user1 })
            console.log(userFound)
        }
        catch (error) {
            console.log('marche po', error)
        }
    }
    
    const deleteUser = async () => {
        'use server'
        try {
            const userList = await prisma.user.delete({ where: user1 })
            console.log(userList)
        }
        catch (error) {
            console.log('######### marche po #########', error)
        }
    }
    
    // update the email address of the user with the email quentinvespero@gmail.com to quentinvespera@gmail.com
    const updateUser = async () => {
        'use server'
        try {
            const userToUpdate = await prisma.user.update({
                where: {
                    email: 'quentinvespero@gmail.com'
                },
                data: {
                    email:'quentinvespera@gmail.com'
                }
            })
            console.log(userToUpdate)
        }
        catch (error) {
            console.log('######### marche po #########', error)
        }
    }
    
    const updateManyUser = async () => {
        'use server'
        try {
            const userToUpdate = await prisma.user.updateMany({
                where: {
                    email: {startsWith:'quentinvespero'}
                },
                data: {
                    displayName:'quentinV'
                }
            })
            console.log(userToUpdate)
        }
        catch (error) {
            console.log('######### marche po #########', error)
        }
    }
    
    // function with missing id for user preference.
    // But basically, connect or disconnect, is for connecting / disconnecting object to a user
    // Here with the object userPreference, but it could have been post or any object related to user (or other) here
    const connectObjectToUser = async () => {
        'use server'
        try {
            const userToUpdate = await prisma.user.update({
                where: {
                    email: 'quentinvespero@gmail.com'
                },
                data: {
                    userPreferences:{
                        connect:{
                            id:''
                        }
                    }
                }
            })
            console.log(userToUpdate)
        }
        catch (error) {
            console.log('######### marche po #########', error)
        }
    }
    
    // ----------------------------------------------------------------
    // ------------------- end testing prisma -------------------

    return (
        <div className="home">
            <button style={{ cursor: 'pointer' }} onClick={createUser}>create user</button>
            <p>•</p>
            <button style={{ cursor: 'pointer' }} onClick={createUserWithPreferences}>create user with preferences</button>
            <p>•</p>
            <button style={{ cursor: 'pointer' }} onClick={listUsers}>list users</button>
            <p>•</p>
            <button style={{ cursor: 'pointer' }} onClick={findUser1}>find user1</button>
            <p>•</p>
            <button style={{ cursor: 'pointer' }} onClick={deleteUser}>delete user</button>
            <p>•</p>
            <button style={{ cursor: 'pointer' }} onClick={updateUser}>update user</button>
            
            <p>-------------------------------------------</p>
            
            <br />
            <div className="authenticationButtons flex flex-col">
                <Link href='/login'>Login</Link>
                <Link href='/register'>Register</Link>
            </div>
        </div>
    )
}

export default Home