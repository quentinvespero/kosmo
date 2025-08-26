import { FaApple, FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"


export const OauthSection = () => {
    
    return (
        <div className="oauthSection flex flex-col gap-2">
            <div className="divider bg-gray-200 h-0.5 w-full"></div>
            <div className="oauthItems flex gap-1 justify-center">
                <button><FaGoogle/></button>
                <button><FaGithub/></button>
                <button><FaApple/></button>
                <button><FaMicrosoft/></button>
            </div>
        </div>
    )
}