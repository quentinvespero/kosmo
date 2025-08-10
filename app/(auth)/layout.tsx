const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authLayout flex items-center justify-center flex-col">
            <p>Authentication</p>
            <br />
            {children}
        </div>
    )
}

export default AuthLayout