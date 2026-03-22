'use client'

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { completeOnboarding } from "@/lib/proxies/updateHandle"
import { onboardingSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const NAME_MAX_CHARACTERS = 50
const HANDLE_MAX_CHARACTERS = 30

type OnboardingForm = z.infer<typeof onboardingSchema>

export const OnboardingForm = () => {
    const form = useForm<OnboardingForm>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: { name: '', handle: '' }
    })

    const nameValue = form.watch('name')
    const handleValue = form.watch('handle')

    const handleSubmit = async (data: OnboardingForm) => {
        const result = await completeOnboarding(data)
        if (result?.error) {
            // "handle already taken" is a field-level error; anything else is unexpected
            if (result.error === 'This handle is already taken') {
                form.setError('handle', { message: result.error })
            } else {
                toast.error(result.error)
            }
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Display name</FormLabel>
                                    <span className="text-xs text-muted-foreground">
                                        {nameValue.length}/{NAME_MAX_CHARACTERS}
                                    </span>
                                </div>
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Handle</FormLabel>
                                    <span className="text-xs text-muted-foreground">
                                        {handleValue.length}/{HANDLE_MAX_CHARACTERS}
                                    </span>
                                </div>
                                <FormControl>
                                    <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">@</span>
                                        <Input
                                            placeholder='yourhandle'
                                            autoComplete='off'
                                            {...field}
                                            // normalize to lowercase as the user types to match what gets saved
                                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Letters, numbers, and underscores only. Must start with a letter or number.
                                </FormDescription>
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
