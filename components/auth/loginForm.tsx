import { OauthSection } from "./oauthSection"

export const LoginForm = () => {

    const login = async (formData:FormData) => {
        'use server'

    }

    return (
        <div className='loginForm flex flex-col'>
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