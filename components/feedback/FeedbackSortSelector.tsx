'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SortValue } from "@/lib/feedback"

const SORTS: { value: SortValue; label: string }[] = [
    { value: "votes", label: "Most voted" },
    { value: "date",  label: "Newest" },
]

interface Props {
    activeSort: SortValue
}

export const FeedbackSortSelector = ({ activeSort }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (value: string) => {
        // Preserve all existing params (e.g. ?tab=BUG) and only update `sort`
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", value)
        router.push(`?${params.toString()}`)
    }

    return (
        <Tabs value={activeSort} onValueChange={handleChange}>
            <TabsList>
                {SORTS.map(({ value, label }) => (
                    <TabsTrigger key={value} value={value}>
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
