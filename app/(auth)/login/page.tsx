import { LoginButton } from '@/components/auth/loginButton'
import { LoginForm } from '@/components/auth/loginForm'
import React from 'react'

const LoginPage = () => {
    return (
        <div className='loginPage'>
            <LoginForm mode='login'/>
        </div>
    )
}

export default LoginPage