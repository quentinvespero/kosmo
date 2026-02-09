import { signIn } from "@/lib/authClient"

export const SignInTab = () => {
    // will have to check authData's type
    const handleSignIn = async (authData) => {
        const { data, error } = await signIn.email({
            ...authData,
            callbackURL: '/',
            rememberMe: true
        })
    }
    return null
}