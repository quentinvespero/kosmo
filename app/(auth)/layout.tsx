const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="authLayout">
            <p>Authentication</p>
            <br />
            {children}
        </div>
    )
}

export default AuthLayout