import { AuthWrapper } from "@/components/auth/authWrapper"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authLayout flex items-center justify-center flex-col">
            <p>Authentication</p>
            <br />
            <div className="authenticationContainer bg-gray-500 p-3 rounded-lg">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout