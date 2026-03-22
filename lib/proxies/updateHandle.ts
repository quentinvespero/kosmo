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

    // Pre-check for duplicate handle before updating
    const existing = await prisma.user.findFirst({ where: { username: handle } })
    if (existing) {
        return { error: 'This handle is already taken' }
    }

    // Use auth.api.updateUser instead of prisma directly — this also refreshes the session
    // cookie cache, so the subsequent redirect to /home won't loop back to /onboarding
    await auth.api.updateUser({
        headers: await headers(),
        body: { name: result.data.name, username: handle }
    })

    redirect('/home')
}
