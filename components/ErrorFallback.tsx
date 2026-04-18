'use client'

import Image from "next/image"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
    title?: string
    message?: string
    reset: () => void
    showReset?: boolean
}

const ErrorFallback = ({
    title = "Something went wrong",
    message = "An unexpected error occurred.",
    reset,
    showReset = true,
}: ErrorFallbackProps) => {
    return (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Image src="/logo_light_broken.svg" alt="" width={96} height={96} className="mb-2 mx-auto dark:hidden" />
                    <Image src="/logo_dark_broken.svg" alt="" width={96} height={96} className="mb-2 mx-auto hidden dark:block" />
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                {showReset && (
                    <CardFooter>
                        <Button variant="outline" onClick={reset}>
                            Try again
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}

export default ErrorFallback
