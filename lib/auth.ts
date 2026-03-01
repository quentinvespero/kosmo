import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { magicLink } from "better-auth/plugins"
import prisma from "./prisma"

export const auth = betterAuth({
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
        customRules: {
            '/sign-in/email': {
                window: 20,
                max: 3
            },
            '/sign-up/email': {
                window: 20,
                max: 3
            }
        }
    },
    plugins: [
        nextCookies(),
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(`[Magic Link] To: ${email}\n${url}`)
                    return
                }
                // TODO: add production email provider (e.g. Resend, Nodemailer)
                throw new Error("Email sending not configured for production")
            },
            expiresIn: 300,
        })
    ],
    database: prismaAdapter(prisma, { provider: "postgresql" })
})