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
        <div className="min-h-dvh flex flex-col items-center px-4">
            <div className="flex flex-col items-center text-center w-full max-w-sm flex-1 justify-center">

                {/* Logo — light/dark swap, margin instead of flex gap to avoid doubling */}
                <Image
                    src="/logo_light.svg"
                    alt="Kosmo"
                    width={64}
                    height={64}
                    className="dark:hidden mb-6"
                />
                <Image
                    src="/logo_dark.svg"
                    alt="Kosmo"
                    width={64}
                    height={64}
                    className="hidden dark:block mb-6"
                />

                {/* Headline + description */}
                <div className="space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Get into the Field.
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        Kosmo brings together some features from Reddit, with the instantaneity of X.
                    </p>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        It aims to be a quality-focused social network, providing a comfortable and enriching space.
                        A space where your time would feel well-spent.
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

            </div>

            {/* Roadmap — pinned to bottom of viewport */}
            <div className="pb-8">
                <Link
                    href="/roadmap"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted hover:bg-muted/70 px-6 py-[.4rem] rounded-full"
                >
                    See what we&apos;re building on the <span className="font-bold underline">roadmap</span> →
                </Link>
            </div>
        </div>
    )
}

export default LandingPage
