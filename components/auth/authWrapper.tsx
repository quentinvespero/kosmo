'use client'
import Link from 'next/link'
import React from 'react'

interface AuthWrapperProps {
    children: React.ReactNode
    headerLabel: string
    backButtonLabel: string
    backButtonHref: string
}

export const AuthWrapper = ({children, headerLabel, backButtonHref,backButtonLabel}:AuthWrapperProps) => {
    return (
        <div className='authWrapper bg-indigo-400 m-4 p-4 rounded-xl'>
            <div className="title">{headerLabel}</div>
            {children}
            <Link href={backButtonHref}>{backButtonLabel}</Link>
        </div>
    )
}