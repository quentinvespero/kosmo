import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const OnboardingLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) redirect('/signin')
    // if already onboarded, no need to be here
    if (session.user.username) redirect('/home')

    return <>{children}</>
}

export default OnboardingLayout
