import { MagicLinkForm } from '@/components/auth/MagicLinkForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const SigninPage = () => {
    return (
        <div className='w-full'>
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
