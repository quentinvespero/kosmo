import { LoginButton } from "@/components/auth/loginButton"
import { RegisterForm } from "@/components/auth/registerForm"

const RegisterPage = () => {
    return (
        <div className='register'>
            <RegisterForm/>
            <LoginButton>
                <button>sign in</button>
            </LoginButton>
        </div>
    )
}

export default RegisterPage