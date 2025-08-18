export const LoginForm = () => {

    const login = async (formData:FormData) => {
        'use server'
        
    }

    return (
        <div className='loginForm flex flex-col'>
            <div>
                <label htmlFor="email">Email</label>
                <input 
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                />
            </div>
            <button>login</button>
        </div>
    )
}