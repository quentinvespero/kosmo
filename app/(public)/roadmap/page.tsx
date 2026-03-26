import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ROADMAP_STATUSES } from "@/lib/roadmap"
import { RoadmapColumn } from "@/components/roadmap/RoadmapColumn"
import { BackButton } from "@/components/ui/BackButton"
import { RoadmapStatus } from "@prisma/client"

export const metadata = {
    title: "Roadmap — Kosmo",
    description: "See what we're building, what's planned, and what's already shipped.",
}

export default async function RoadmapPage() {
    // Optional session — no redirect if unauthenticated
    const session = await auth.api.getSession({ headers: await headers() })
    const isTeamMember = session?.user?.isTeamMember ?? false

    // Fetch all items (with optional linked feedback)
    const items = await prisma.roadmapItem.findMany({
        include: {
            feedback: { select: { id: true, content: true, type: true } },
        },
        orderBy: { createdAt: "asc" },
    })

    // Fetch feedbacks not yet linked to any roadmap item (for the add/edit dialog)
    const availableFeedbacks = isTeamMember
        ? await prisma.feedback.findMany({
            where: { roadmapItem: null },
            select: { id: true, content: true, type: true },
            orderBy: { createdAt: "desc" },
            take: 100,
          })
        : []

    // Group items by status
    const grouped = Object.fromEntries(
        ROADMAP_STATUSES.map((status) => [
            status,
            items.filter((item) => item.status === status),
        ])
    ) as Record<RoadmapStatus, typeof items>

    return (
        <main className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
                <BackButton />
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Roadmap</h1>
                    <p className="text-muted-foreground text-sm">
                        See what we&apos;re building, what&apos;s planned, and what&apos;s already shipped.
                    </p>
                </div>

                {/* Three-column kanban layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ROADMAP_STATUSES.map((status) => (
                        <RoadmapColumn
                            key={status}
                            status={status}
                            items={grouped[status]}
                            isTeamMember={isTeamMember}
                            availableFeedbacks={availableFeedbacks}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}
