'use client'

import { signOut, useSession } from "@/lib/authClient"
import ShowUsers from "../testingComponents/ShowUsers"
import Link from "next/link"
import ShowUserDetails from "../testingComponents/ShowUserDetails"
import { Button } from "../ui/button"

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
                        <Button className="authenticationButtons flex">
                            <Link href='/login' className='font-bold p-5 rounded-md'>Login / Register</Link>
                        </Button>
                    </div>

                )
                : (
                    <>
                        <Button
                            size='sm'
                            variant='destructive'
                            onClick={() => signOut()}
                        >
                            sign out
                        </Button>
                        <ShowUserDetails data={data} />
                        <p>-----------------------------------</p>
                        <ShowUsers users={users} />
                    </>
                )}
        </div>
    )
}

export default HomeContent