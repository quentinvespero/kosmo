import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) redirect('/signin')
    if (!session.user.username) redirect('/onboarding')

    return <>{children}</>
}

export default AppLayout
