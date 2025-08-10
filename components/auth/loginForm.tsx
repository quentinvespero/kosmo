import React from 'react'
import { AuthWrapper } from './authWrapper'

export const LoginForm = () => {
    return (
        <div className='loginform'>
            <AuthWrapper headerLabel='Welcome' backButtonLabel='back' backButtonHref='/register'>
                <p>login form</p>
            </AuthWrapper>
        </div>
    )
}