import { LoginForm } from '@/components/auth/loginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignUpTab } from './components/signupTab'
import { SignInTab } from './components/signinTab'

const LoginPage = () => {
    return (
        <div className='loginPage'>
            {/* <LoginForm /> */}
            <Tabs defaultValue='signing' className='max-auto w-full py-6 px-4'>
                <TabsList className='bg-gray-600'>
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