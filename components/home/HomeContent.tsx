'use client'

import { useSession } from "@/lib/authClient"
import ShowUsers from "../ShowUsers"
import Link from "next/link"

type User = { id: string; name: string | null }

const HomeContent = ({ users }: { users: User[] }) => {

    const { data, error, isPending } = useSession()

    if (isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex flex-col gap-5">
            {data == null
                ? (
                    <div className="flex flex-col gap-5 items-center">
                        <p>Not connected</p>
                        <div className="authenticationButtons flex">
                            <Link href='/login' className='font-bold p-5 bg-gray-500 rounded-md'>Login / Register</Link>
                        </div>
                    </div>

                )
                : (
                    <>
                        <div>
                            <p className="font-bold">id session : </p>
                            <p>{data?.session.id}</p>
                        </div>
                        <div>
                            <p className="font-bold">userId : </p>
                            <p>{data?.session.userId}</p>
                        </div>
                        <p>-----------------------------------</p>
                        <ShowUsers users={users} />
                    </>
                )}
        </div>
    )
}

export default HomeContent