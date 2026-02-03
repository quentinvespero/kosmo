import { AuthContainer } from "@/components/auth/authContainer"
import { BackButton } from "@/components/auth/backButton"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authLayout">
            <p>Authentication</p>
            <br />
            <AuthContainer>
                {children}
            </AuthContainer>
        </div>
    )
}

export default AuthLayout