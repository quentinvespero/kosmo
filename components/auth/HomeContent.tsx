'use client'

import { useSession } from "@/lib/authClient"
import ShowUsers from "./ShowUsers"
import Link from "next/link"

type User = { id: string; name: string | null }

const HomeContent = ({ users }: { users: User[] }) => {

    const { data: session, error, isPending: loading } = useSession()

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            {session == null
                ? (
                    <p>Not connected</p>
                )
                : (
                    <>
                        <h4 className='size'>user's list in db:</h4>
                        <ShowUsers users={users} />

                        <p>-------------------------------------------</p>

                        <br />
                        <div className="authenticationButtons">
                            <Link href='/login' className='font-bold p-5 bg-gray-500 rounded-md'>Login / Register</Link>
                        </div>
                    </>
                )}
        </div>
    )
}

export default HomeContent