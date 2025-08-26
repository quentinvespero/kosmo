import { BackButton } from "./backButton"

export const AuthContainer = ({children}:{ children: React.ReactNode }) => {
    return (
        <div className="authContainer bg-gray-500 p-3 rounded-lg">
            {children}
            <BackButton urlPath="" label=""/>
        </div>
    )
}