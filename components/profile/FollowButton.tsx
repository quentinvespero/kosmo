'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { followUser, unfollowUser } from "@/lib/actions/follow"

type FollowStatus = 'NONE' | 'PENDING' | 'ACCEPTED'

type Props = {
    targetUserId: string
    targetUsername: string
    initialStatus: FollowStatus
}

export const FollowButton = ({ targetUserId, targetUsername, initialStatus }: Props) => {
    const [status, setStatus] = useState<FollowStatus>(initialStatus)
    const [isPending, startTransition] = useTransition()

    const handleFollow = () => {
        startTransition(async () => {
            const result = await followUser(targetUserId, targetUsername)
            if ('success' in result) setStatus(result.status ?? 'ACCEPTED')
        })
    }

    const handleUnfollow = () => {
        startTransition(async () => {
            const result = await unfollowUser(targetUserId, targetUsername)
            if ('success' in result) setStatus('NONE')
        })
    }

    if (status === 'NONE') {
        return (
            <Button onClick={handleFollow} disabled={isPending}>
                Follow
            </Button>
        )
    }

    if (status === 'PENDING') {
        return (
            // Clicking "Pending" cancels the follow request
            <Button variant="outline" onClick={handleUnfollow} disabled={isPending}>
                Pending
            </Button>
        )
    }

    // ACCEPTED — hover label changes to "Unfollow" via CSS group trick
    return (
        <Button variant="outline" onClick={handleUnfollow} disabled={isPending} className="group w-24">
            <span className="group-hover:hidden">Following</span>
            <span className="hidden group-hover:inline text-destructive">Unfollow</span>
        </Button>
    )
}
