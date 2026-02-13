'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

    const pathname = usePathname()
    const showNav = pathname !== "/verify"

    return (
        <div className="flex flex-col items-center mx-auto max-w-lg py-6 px-4 gap-5">
            {children}
            {showNav && (
                <nav className="flex gap-2 self-start text-sm text-muted-foreground">
                    {pathname === "/signin"
                        ? (<>Don&apos;t have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Sign Up</Link></>)
                        : (<>Already have an account? <Link href="/signin" className="text-primary font-medium hover:underline">Sign In</Link></>)
                    }
                </nav>
            )}
        </div>
    )
}

export default AuthLayout