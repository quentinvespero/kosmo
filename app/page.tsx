import { Button } from "@/components/ui/button"
import Link from "next/link"

const LandingPage = async () => {

    return (
        <div className="flex flex-col items-center gap-10">
            <h1 className='text-3xl font-bold italic'>Kosmo</h1>
            <p>Landing page</p>
            <Button className="flex">
                <Link href='/login' className='font-bold p-5 rounded-md'>Login / Register</Link>
            </Button>
        </div>
    )
}

export default LandingPage