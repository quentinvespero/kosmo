import { SignInTab } from '@/components/auth/signinTab'
import { SignUpTab } from '@/components/auth/signupTab'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const LoginPage = () => {
    return (
        <div className='loginPage w-full'>
            {/* <LoginForm /> */}
            <Tabs defaultValue='signin' className='mx-auto max-w-lg py-6 px-4'>
                <TabsList>
                    <TabsTrigger value='signin'>Sign In</TabsTrigger>
                    <TabsTrigger value='signup'>Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value='signin'>
                    <Card>
                        <CardHeader className='text-xl'>
                            <CardTitle>Sign In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SignInTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='signup'>
                    <Card>
                        <CardHeader className='text-xl'>
                            <CardTitle>Sign Up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SignUpTab />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default LoginPage