'use client'
import React from 'react'

interface LoginButtonProps {
    children:React.ReactNode
    mode?: 'modal' | 'redirect'
    asChild?: boolean
}

export const LoginButton = ({children,mode='redirect', asChild}:LoginButtonProps) => {

    const logFunction = () => {
        console.log('login button clicked')
    }

    if (mode === 'modal') return <p>implement modal</p>

    return (
        <div className='cursor-pointer' onClick={logFunction}>
            {children}
        </div>
    )
}