import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { magicLink } from "better-auth/plugins"
import { Resend } from "resend"
import prisma from "./prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
    user: {
        // expose username in the session so layouts can check it without an extra DB query
        additionalFields: {
            username: {
                type: "string",
                required: false,
            }
        }
    },
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
            '/sign-in/magic-link': {
                window: 60,
                max: 3
            }
        }
    },
    plugins: [
        nextCookies(),
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                // in dev, print the link to the console instead of sending an email
                if (process.env.NODE_ENV === "development") {
                    console.log(`[Magic Link] To: ${email}\n${url}`)
                    return
                }

                const { error } = await resend.emails.send({
                    from: "Kosmo <noreply@yourdomain.com>", // to update when I'll have the domain
                    to: email,
                    subject: "Your Kosmo sign-in link",
                    html: `<p>Click the link below to sign in to Kosmo. It expires in 5 minutes.</p><a href="${url}">${url}</a>`
                })

                if (error) throw new Error(`Failed to send magic link: ${error.message}`)
            },
            expiresIn: 300,
        })
    ],
    database: prismaAdapter(prisma, { provider: "postgresql" })
})