import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const VerifyPage = async ({ searchParams }: { searchParams: Promise<{ email?: string }> }) => {

    const { email } = await searchParams

    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <CardTitle>Check your email</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                        We sent a magic link{email
                            ? <> to <span className='text-foreground font-medium'>{email}</span></>
                            : ' to your email address'
                        }.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        Click the link to sign in — it expires in 5 minutes.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyPage
