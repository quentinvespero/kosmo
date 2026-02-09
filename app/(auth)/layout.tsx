const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authLayout flex flex-col items-center">
            <p>Authentication</p>
            <br />
            {children}
        </div>
    )
}

export default AuthLayout