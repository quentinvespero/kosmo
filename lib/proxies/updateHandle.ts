'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { onboardingSchema } from "@/lib/schemas/AuthSchemas"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const completeOnboarding = async (data: { name: string, handle: string }): Promise<{ error: string } | void> => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/signin')

    const result = onboardingSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    const handle = result.data.handle.toLowerCase()

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { username: handle, name: result.data.name }
        })
    } catch {
        return { error: 'This handle is already taken' }
    }

    redirect('/home')
}
