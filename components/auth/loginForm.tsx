'use client'
import { Form, useForm } from "react-hook-form"
import { OauthSection } from "./oauthSection"
import z from "zod"
import { LoginSchema } from "@/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"

export const LoginForm = () => {

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    return (
        <div className='loginForm flex flex-col'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(() => { })}>
                    <div className="inputs">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="tyler.durden@example.com"
                                            {...field}
                                            type="email"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            {/* <label htmlFor="email">Email</label>
            <input 
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                required
            />
            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
            /> */}
            <div className="loginButtonsSection flex flex-col items-center gap-4">
                <button>login</button>
                <OauthSection />
            </div>
        </div>
    )
}