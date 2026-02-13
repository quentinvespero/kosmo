import { SignInTab } from '@/components/auth/signinTab'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SigninPage = () => {
    return (
        <div className='w-full'>
            <Card>
                <CardHeader className='text-xl'>
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignInTab />
                </CardContent>
            </Card>
        </div>
    )
}

export default SigninPage