import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { nextCookies } from "better-auth/next-js"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
    emailAndPassword: { enabled: true },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 120 // caches (2min)
        }
    },
    plugins: [nextCookies()],
    database: prismaAdapter(prisma, { provider: "postgresql" })
})