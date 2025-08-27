'use client'
import { useForm } from "react-hook-form"
import { OauthSection } from "./oauthSection"
import z from "zod"
import { LoginSchema } from "@/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export const LoginForm = () => {

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email:'',
            password:''
        }
    })

    return (
        <div className='loginForm flex flex-col'>
            <form onSubmit={form.handleSubmit(() => {})}>
                
            </form>
            <label htmlFor="email">Email</label>
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
            />
            <div className="loginButtonsSection flex flex-col items-center gap-4">
                <button>login</button>
                <OauthSection/>
            </div>
        </div>
    )
}