import { SignUpTab } from "@/components/auth/signupTab"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SignupPage = () => {
    return (
        <div className="w-full">
            <Card>
                <CardHeader className='text-xl'>
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpTab />
                </CardContent>
            </Card>
        </div>
    )
}

export default SignupPage