'use client'

import { signOut } from "@/lib/authClient"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const SignoutButton = () => {

    const router = useRouter()

    return (
        <div>
            <Button
                size='sm'
                variant='destructive'
                onClick={() => signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push('/')
                        }
                    }
                })}
            >
                sign out
            </Button>
        </div>
    )
}

export default SignoutButton