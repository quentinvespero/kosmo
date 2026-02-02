import { LoginForm } from '@/components/auth/loginForm'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const LoginPage = () => {
    return (
        <div className='loginPage'>
            <LoginForm />
            <Tabs defaultValue='signing' className='max-auto w-full py-6 px-4'>
                <TabsList>
                    <TabsTrigger value='signin'>Sign In</TabsTrigger>
                    <TabsTrigger value='signup'>Sign Up</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}

export default LoginPage