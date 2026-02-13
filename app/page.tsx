import { Button } from "@/components/ui/button"
import Link from "next/link"

const LandingPage = async () => {

    return (
        <div className="flex flex-col items-center gap-10">
            <h1 className='text-3xl font-bold italic'>Kosmo</h1>
            <p>Landing page</p>
            <div className="flex gap-5">
                <Button className="flex">
                    <Link href='/signin' className='font-bold p-5 rounded-md'>Sign In</Link>
                </Button>
                <Button className="flex">
                    <Link href='/signup' className='font-bold p-5 rounded-md'>Sign Up</Link>
                </Button>
            </div>
        </div>
    )
}

export default LandingPage