import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect('/home')
    }

    return (
        <div className="flex flex-col items-center mx-auto max-w-lg py-6 px-4">
            {children}
        </div>
    )
}

export default AuthLayout
