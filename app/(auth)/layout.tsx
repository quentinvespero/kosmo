const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col items-center mx-auto max-w-lg py-6 px-4">
            {children}
        </div>
    )
}

export default AuthLayout
