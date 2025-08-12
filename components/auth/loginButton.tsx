'use client'

interface LoginButtonProps {
    children:React.ReactNode
}

export const LoginButton = ({children}:LoginButtonProps) => {

    const logFunction = () => {
        console.log('login button clicked')
    }


    return (
        <div className='cursor-pointer' onClick={logFunction}>
            {children}
        </div>
    )
}