import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import prisma from "./prisma"

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
    // socialProviders: { 
    //     github: { 
    //         clientId: process.env.GITHUB_CLIENT_ID as string, 
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    //     }, 
    // },
})