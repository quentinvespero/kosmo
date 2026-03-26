'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TABS = [
    { value: "BUG", label: "Bug" },
    { value: "FEATURE_REQUEST", label: "Feature Request" },
    { value: "GENERAL", label: "General" },
] as const

type TabValue = (typeof TABS)[number]["value"]
type Counts = Partial<Record<TabValue, number>>

interface Props {
    activeTab: TabValue
    counts: Counts
}

export const FeedbackTabs = ({ activeTab, counts }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (value: string) => {
        // Preserve all existing params (e.g. ?sort=votes) and only update `tab`
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", value)
        router.push(`?${params.toString()}`)
    }

    return (
        <Tabs value={activeTab} onValueChange={handleChange}>
            <TabsList>
                {TABS.map(({ value, label }) => (
                    <TabsTrigger key={value} value={value}>
                        {label} ({counts[value] ?? 0})
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
