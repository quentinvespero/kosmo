import { useSession } from "@/lib/authClient"

type Session = ReturnType<typeof useSession>['data']

const ShowUserDetails = ({ data }: { data: Session }) => {
    return (
        <div>
            <div>
                <p className="font-black">id session : </p>
                <p>{data?.session.id}</p>
            </div>
            <div>
                <p className="font-black">userId : </p>
                <p>{data?.session.userId}</p>
            </div>
            <div>
                <div>
                    <p className="font-black">name : </p>
                    <p>{data?.user.name}</p>
                </div>
                <div>
                    <p className="font-black">email : </p>
                    <p>{data?.user.email}</p>
                </div>
                <div>
                    <p className="font-black">email verified : </p>
                    <p>{data?.user.emailVerified ? 'yes' : 'nope'}</p>
                </div>
            </div>
        </div>
    )
}

export default ShowUserDetails