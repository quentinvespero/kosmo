'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { createPostSchema } from "@/lib/schemas/PostSchemas"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export const createPost = async (data: unknown) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Unauthorized' as const }

    const parsed = createPostSchema.safeParse(data)
    if (!parsed.success) return { error: 'Invalid data' as const, issues: parsed.error.issues }

    await prisma.post.create({
        data: {
            content: parsed.data.content,
            authorId: session.user.id,
        }
    })

    revalidatePath('/home')
    return { success: true as const }
}
