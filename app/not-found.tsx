import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const NotFound = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    redirect(session ? '/home' : '/')
}

export default NotFound