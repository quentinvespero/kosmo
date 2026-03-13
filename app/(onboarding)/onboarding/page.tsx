import { OnboardingForm } from "@/components/auth/OnboardingForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const OnboardingPage = () => {
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
