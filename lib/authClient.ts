import { createAuthClient } from "better-auth/react"

// export const authClient = createAuthClient({
//     baseURL: "http://localhost:3000" // not necessary
// })

// getting the methods instead of the whole authClient
export const { signIn, signUp, useSession } = createAuthClient()