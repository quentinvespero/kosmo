'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { completeOnboarding } from "@/lib/proxies/updateHandle"
import { onboardingSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

type OnboardingForm = z.infer<typeof onboardingSchema>

export const OnboardingForm = () => {
    const form = useForm<OnboardingForm>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: { name: '', handle: '' }
    })

    const handleSubmit = async (data: OnboardingForm) => {
        const result = await completeOnboarding(data)
        if (result?.error) {
            form.setError('handle', { message: result.error })
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Your Name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='handle'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Handle</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">@</span>
                                        <Input
                                            placeholder='yourhandle'
                                            autoComplete='off'
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Continue'}
                    </Button>
                </FieldGroup>
            </form>
        </Form>
    )
}
