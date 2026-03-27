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
        <div className="flex flex-col items-center gap-10">
            {/* Logo switches based on color scheme */}
            <Image
                src="/logo_light.svg"
                alt="Kosmo"
                width={80}
                height={80}
                className="dark:hidden"
            />
            <Image
                src="/logo_dark.svg"
                alt="Kosmo"
                width={80}
                height={80}
                className="hidden dark:block"
            />
            <h1 className='text-3xl font-bold italic'>Kosmo</h1>
            <p>Landing page</p>
            <div className="flex gap-5">
                <Button className="flex">
                    <Link href='/signin' className='font-bold p-5 rounded-md'>Login</Link>
                </Button>
                <Button className="flex">
                    <Link href='/signin?intent=signup' className='font-bold p-5 rounded-md'>Get started</Link>
                </Button>
            </div>
            <Button variant="outline" asChild>
                <Link href="/roadmap">See what we&apos;re building on the roadmap →</Link>
            </Button>
        </div>
    )
}

export default LandingPage