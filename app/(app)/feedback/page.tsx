import { Suspense } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { FeedbackTabs } from "@/components/feedback/FeedbackTabs"
import { FeedbackSortSelector } from "@/components/feedback/FeedbackSortSelector"
import { FeedbackItem } from "@/components/feedback/FeedbackItem"
import { Separator } from "@/components/ui/separator"
import prisma from "@/lib/prisma"
import { isValidTab, isValidSort, type TabValue, type SortValue } from "@/lib/feedback"

const FeedbackPage = async ({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect("/signin")

    const { tab, sort } = await searchParams
    const activeTab: TabValue = isValidTab(tab) ? tab : "BUG"
    const activeSort: SortValue = isValidSort(sort) ? sort : "votes"
    const currentUserId = session.user.id

    const [feedbacks, rawCounts] = await Promise.all([
        prisma.feedback.findMany({
            where: { type: activeTab },
            include: {
                user: { select: { username: true, name: true } },
                votes: { select: { type: true, userId: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.feedback.groupBy({
            by: ["type"],
            _count: { _all: true },
        }),
    ])

    // Convert groupBy result to a flat record for easy lookup
    const counts = Object.fromEntries(
        rawCounts.map(({ type, _count }) => [type, _count._all])
    ) as Partial<Record<TabValue, number>>

    // Compute score and current user's vote for each feedback item
    const items = feedbacks.map((f) => ({
        id: f.id,
        username: f.user.username,
        name: f.user.name,
        showUsername: f.showUsername,
        content: f.content,
        createdAt: f.createdAt,
        score: f.votes.filter(v => v.type === "UP").length - f.votes.filter(v => v.type === "DOWN").length,
        currentUserVote: (f.votes.find(v => v.userId === currentUserId)?.type ?? null) as "UP" | "DOWN" | null,
    }))

    // Sort items based on the active sort mode.
    // For "votes": sort by score descending. Items with equal scores keep their
    // original DB order (createdAt desc), since JS array sort is stable.
    // For "date": items are already ordered by createdAt desc from the DB query.
    if (activeSort === "votes") {
        items.sort((a, b) => b.score - a.score)
    }

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            <h1 className="text-2xl font-bold">Feedback</h1>
            <Suspense fallback={
                <div className="h-10 w-fit rounded-md bg-muted flex items-center gap-1 p-1 animate-pulse">
                    {["w-16", "w-28", "w-16"].map((w, i) => (
                        <div key={i} className={`${w} h-7 rounded-sm bg-muted-foreground/20`} />
                    ))}
                </div>
            }>
                <FeedbackTabs activeTab={activeTab} counts={counts} />
            </Suspense>
            <Separator />
            <div className="flex justify-end">
                <Suspense fallback={
                    <div className="h-10 w-fit rounded-md bg-muted flex items-center gap-1 p-1 animate-pulse">
                        {["w-20", "w-16"].map((w, i) => (
                            <div key={i} className={`${w} h-7 rounded-sm bg-muted-foreground/20`} />
                        ))}
                    </div>
                }>
                    <FeedbackSortSelector activeSort={activeSort} />
                </Suspense>
            </div>
            {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No feedbacks yet.</p>
            ) : (
                <div className="divide-y">
                    {items.map((item) => (
                        <FeedbackItem key={item.id} {...item} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default FeedbackPage
