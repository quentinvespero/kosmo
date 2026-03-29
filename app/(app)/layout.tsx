import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/layout/AppSidebar"

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) redirect('/signin')
    if (!session.user.username) redirect('/onboarding')

    return (
        <div className="flex justify-center min-h-screen">
            <AppSidebar
                username={session.user.username}
                userName={session.user.name}
                userImage={session.user.image ?? null}
            />
            <main className="flex-1 min-w-0 max-w-3xl">
                {children}
            </main>
        </div>
    )
}

export default AppLayout
