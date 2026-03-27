import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/ui/BackButton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PostVoteButtons } from "@/components/post/PostVoteButtons"
import { CommentComposer } from "@/components/post/CommentComposer"
import { CommentList } from "@/components/post/CommentList"
import type { CommentItemProps } from "@/components/post/CommentItem"

type Props = {
    params: Promise<{ handle: string; postId: string }>
}

const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const PostDetailPage = async ({ params }: Props) => {
    const { handle, postId } = await params

    // Step A — fetch post and session in parallel
    const [post, session] = await Promise.all([
        prisma.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                isEdited: true,
                isSubscribersOnly: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        userPreferences: { select: { isPrivate: true } },
                    },
                },
                tags: { select: { name: true } },
                _count: { select: { comments: true } },
            },
        }),
        auth.api.getSession({ headers: await headers() }),
    ])

    // Step B — guards
    if (!post) notFound()
    // Enforce canonical URL: the post must belong to the given handle
    if (post.author.username !== handle) notFound()

    const isOwnProfile = session?.user.id === post.author.id
    const isPrivate = post.author.userPreferences?.isPrivate ?? false

    // Step C — visibility check (mirrors [handle]/page.tsx)
    let followStatus: 'NONE' | 'PENDING' | 'ACCEPTED' = 'NONE'
    if (!isOwnProfile && session) {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: post.author.id,
                },
            },
            select: { status: true },
        })
        if (follow) followStatus = follow.status as 'PENDING' | 'ACCEPTED'
    }

    // Basic profile visibility: owner, public profile, or accepted follower
    const canViewProfile = isOwnProfile || !isPrivate || followStatus === 'ACCEPTED'
    if (!canViewProfile) notFound()

    // Subscriber-only posts: only the owner can view them until subscriptions are implemented
    // TODO: replace with actual subscriber check once the subscription model is in place
    if (post.isSubscribersOnly && !isOwnProfile) notFound()

    const currentUserId = session?.user.id

    // Step D — fetch post vote data and comments in parallel
    const [upCount, downCount, topLevelComments] = await Promise.all([
        prisma.vote.count({ where: { postId, type: 'UP' } }),
        prisma.vote.count({ where: { postId, type: 'DOWN' } }),
        prisma.comment.findMany({
            where: { postId, parentCommentId: null },
            select: {
                id: true,
                content: true,
                createdAt: true,
                isEdited: true,
                author: { select: { name: true, username: true } },
                votes: { select: { type: true } },
                replies: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        isEdited: true,
                        author: { select: { name: true, username: true } },
                        votes: { select: { type: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'asc' },
        }),
    ])

    // Fetch current user's vote on the post separately (conditional query avoids breaking Promise.all inference)
    const currentPostVote = currentUserId
        ? await prisma.vote.findUnique({
            where: { userId_postId: { userId: currentUserId, postId } },
            select: { type: true },
        })
        : null

    // Step E — build comment vote map for the current user
    const allCommentIds = topLevelComments.flatMap(c => [c.id, ...c.replies.map(r => r.id)])
    const voteMap = new Map<string, 'UP' | 'DOWN'>()

    if (currentUserId && allCommentIds.length > 0) {
        const userCommentVotes = await prisma.vote.findMany({
            where: { userId: currentUserId, commentId: { in: allCommentIds } },
            select: { commentId: true, type: true },
        })
        userCommentVotes.forEach(v => voteMap.set(v.commentId!, v.type))
    }

    // Step F — build typed comment props with computed scores
    const commentProps: CommentItemProps[] = topLevelComments.map(c => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        isEdited: c.isEdited,
        author: c.author,
        score: c.votes.filter(v => v.type === 'UP').length - c.votes.filter(v => v.type === 'DOWN').length,
        currentUserVote: voteMap.get(c.id) ?? null,
        replies: c.replies.map(r => ({
            id: r.id,
            content: r.content,
            createdAt: r.createdAt,
            isEdited: r.isEdited,
            author: r.author,
            score: r.votes.filter(v => v.type === 'UP').length - r.votes.filter(v => v.type === 'DOWN').length,
            currentUserVote: voteMap.get(r.id) ?? null,
        })),
    }))
    const postScore = upCount - downCount

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            <BackButton />

            {/* Post */}
            <article className="space-y-3">
                {/* Author */}
                <div className="text-sm font-medium">
                    <a href={`/${post.author.username ?? ''}`} className="hover:underline">
                        {post.author.name}
                    </a>
                    <span className="text-muted-foreground"> @{post.author.username ?? '—'}</span>
                </div>

                {/* Date + badges */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(post.createdAt)}</span>
                    {isOwnProfile && post.isSubscribersOnly && (
                        <Badge variant="secondary" className="text-xs py-0">
                            Subscribers only
                        </Badge>
                    )}
                </div>

                {/* Full content — no truncation */}
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {post.tags.map(tag => (
                            <Badge key={tag.name} variant="secondary" className="text-xs">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Vote buttons */}
                <PostVoteButtons
                    postId={post.id}
                    score={postScore}
                    currentUserVote={currentPostVote?.type ?? null}
                />
            </article>

            <Separator />

            {/* Comments section */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold">
                    {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
                </h2>

                <CommentComposer postId={post.id} />

                <Separator />

                <CommentList comments={commentProps} />
            </div>
        </div>
    )
}

export default PostDetailPage
