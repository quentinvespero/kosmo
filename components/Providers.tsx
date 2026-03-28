'use client'

import NextTopLoader from 'nextjs-toploader'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <NextTopLoader
                height={2}

                showSpinner={false}
            />
            {children}
        </>
    )
}
