'use client'

import { useSession } from "@/lib/authClient"
import ShowUsers from "../testingComponents/ShowUsers"
import ShowUserDetails from "../testingComponents/ShowUserDetails"

type User = { id: string; name: string | null }

const HomeContent = ({ users }: { users: User[] }) => {

    const { data, error, isPending } = useSession()

    if (isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex flex-col gap-5 bg-neutral-700 rounded-xl p-10">
            <ShowUserDetails data={data} />
            <p>-----------------------------------</p>
            <ShowUsers users={users} />
        </div>
    )
}

export default HomeContent