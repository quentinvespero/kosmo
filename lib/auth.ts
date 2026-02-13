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
    rateLimit: { // limit requests (feature disabled in dev mode by default)
        storage: 'database', // location to store the info of users making the requests
        window: 30, // time window in seconds
        max: 10, // max request
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