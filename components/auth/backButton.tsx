'use client'

import Link from "next/link"

interface BackButtonProps {
    urlPath:string
    label:string
}

export const BackButton = ({urlPath,label}:BackButtonProps) => {
    return (
        <button className="backButton">
            <Link href={urlPath}>{label}</Link>
        </button>
    )
}