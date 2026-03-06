import { OnboardingForm } from "@/components/auth/OnboardingForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const OnboardingPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: { username: true }
    })

    if (user?.username) redirect('/home')

    return (
        <div className="flex flex-col items-center mx-auto max-w-lg py-6 px-4 w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Choose your handle</CardTitle>
                    <CardDescription>This is how others will find and mention you. You can change it later.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OnboardingForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default OnboardingPage
