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
        <div className="flex flex-col items-center min-h-screen mx-auto max-w-lg py-6 px-4">
            {children}
            <footer className="mt-auto pt-8 text-xs text-muted-foreground">
                © 2026 Kosmo
            </footer>
        </div>
    )
}

export default AuthLayout
