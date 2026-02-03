import { BackButton } from "./backButton"

export const AuthContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authContainer">
            {children}
            <BackButton urlPath="" label="" />
        </div>
    )
}