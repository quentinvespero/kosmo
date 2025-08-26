import { AuthContainer } from "@/components/auth/authContainer"
import { BackButton } from "@/components/auth/backButton"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authLayout flex items-center justify-center flex-col">
            <p>Authentication</p>
            <br />
            <AuthContainer>
                {children}
            </AuthContainer>
        </div>
    )
}

export default AuthLayout