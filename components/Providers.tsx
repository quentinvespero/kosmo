'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <AppProgressBar
                height="2px"
                color="hsl(var(--primary))"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    )
}
