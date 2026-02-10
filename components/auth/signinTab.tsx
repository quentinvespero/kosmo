'use client'

import { signIn } from "@/lib/authClient"
import { signInSchema } from "@/lib/schemas/AuthSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

type SignInForm = z.infer<typeof signInSchema>

export const SignInTab = () => {

    const form = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    // will have to check authData's type
    const handleSignIn = async (authData: SignInForm) => {
        await signIn.email({
            ...authData,
            callbackURL: '/',
            rememberMe: true
        })
    }
    return
}