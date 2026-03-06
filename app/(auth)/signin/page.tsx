import { MagicLinkForm } from '@/components/auth/MagicLinkForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// it will uses the error message that matches the property name
const errorMessages: Record<string, string> = {
    link_invalid: 'Your magic link has expired or has already been used. Please request a new one.',
    test: 'testing stuff'
}

const SigninPage = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {

    // searchParams promise capture the params in the url
    const { error } = await searchParams

    return (
        <div className='w-full space-y-4'>
            {error && (
                <p className='text-sm text-destructive'>
                    {errorMessages[error] ?? 'Something went wrong. Please try again.'}
                </p>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>Enter your email to receive a magic link</CardDescription>
                </CardHeader>
                <CardContent>
                    <MagicLinkForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default SigninPage