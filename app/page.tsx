import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

const LandingPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session) redirect('/home')

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center text-center w-full max-w-sm">

                {/* Logo — light/dark swap, margin instead of flex gap to avoid doubling */}
                <Image
                    src="/logo_light.svg"
                    alt="Kosmo"
                    width={96}
                    height={96}
                    className="dark:hidden mb-6"
                />
                <Image
                    src="/logo_dark.svg"
                    alt="Kosmo"
                    width={96}
                    height={96}
                    className="hidden dark:block mb-6"
                />

                {/* Headline + description */}
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Where communities think out loud.
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        Kosmo brings together the depth of Reddit and the pulse of X.
                        Post, discuss, and discover — with people who actually care.
                    </p>
                </div>

                {/* CTAs — asChild fixes the nested button/link invalid HTML */}
                <div className="flex gap-3 mt-8 w-full">
                    <Button asChild size="lg" className="flex-1">
                        <Link href="/signin?intent=signup">Get started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="flex-1">
                        <Link href="/signin">Log in</Link>
                    </Button>
                </div>

                {/* Roadmap — plain link, not a button; it's not a conversion action */}
                <Link
                    href="/roadmap"
                    className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    See what we&apos;re building →
                </Link>

            </div>
        </div>
    )
}

export default LandingPage
