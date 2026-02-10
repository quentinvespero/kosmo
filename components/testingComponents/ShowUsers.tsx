'use client'

type User = { id: string; name: string | null }

const ShowUsers = ({ users }: { users: User[] }) => {
    return (
        <div>
            <h4 className='size'>user's list in db:</h4>
            <ol className='flex flex-col pl-5'>
                {users.map((user, index) => (
                    <li key={user.id} className='mb-2'>{index}. {user.name}</li>
                ))}
            </ol>
        </div>
    )
}

export default ShowUsers