import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { cache } from "react"
import type { Metadata } from "next"
import { BackButton } from "@/components/ui/BackButton"
import { Separator } from "@/components/ui/separator"
import { CommentComposer } from "@/components/post/CommentComposer"
import { CommentList } from "@/components/post/CommentList"
import { PostDetailClient } from "@/components/post/PostDetailClient"
import type { CommentItemProps } from "@/components/post/CommentItem"

type Props = {
    params: Promise<{ handle: string; postId: string }>
}

// Cached so generateMetadata and PostDetailPage share one DB round-trip per request
const getPost = cache((postId: string) =>
    prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
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
    })
)

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { handle, postId } = await params
    const post = await getPost(postId)
    // Mirror the page's canonical-URL guard — don't emit metadata for wrong-handle URLs
    if (!post || post.author.username !== handle) return {}

    const isPrivate = post.author.userPreferences?.isPrivate ?? false
    // Only expose real content when publicly accessible — avoid leaking private/subscriber-only content
    if (isPrivate || post.isSubscribersOnly) {
        return { title: 'Post — Kosmo' }
    }

    const displayTitle = post.title ?? (
        post.content.length > 60 ? post.content.slice(0, 60) + '…' : post.content
    )
    return {
        title: `${post.author.name} — ${displayTitle}`,
        description: post.content.length > 150 ? post.content.slice(0, 150) + '…' : post.content,
    }
}

const PostDetailPage = async ({ params }: Props) => {
    const { handle, postId } = await params

    // Step A — fetch post and session in parallel (getPost is cached — no extra DB hit if metadata ran first)
    const [post, session] = await Promise.all([
        getPost(postId),
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

    // Step D — fetch post vote counts + all comments (flat) in parallel
    const [upCount, downCount, allComments] = await Promise.all([
        prisma.vote.count({ where: { postId, type: 'UP' } }),
        prisma.vote.count({ where: { postId, type: 'DOWN' } }),
        prisma.comment.findMany({
            where: { postId },
            select: {
                id: true,
                content: true,
                createdAt: true,
                isEdited: true,
                isDeleted: true,
                parentCommentId: true,
                authorId: true,
                author: { select: { name: true, username: true } },
                votes: { select: { type: true } },
            },
            orderBy: { createdAt: 'asc' },
        }),
    ])

    // Step E — fetch current user's votes in parallel (post vote + all comment votes)
    const allCommentIds = allComments.map(c => c.id)
    const [currentPostVote, userCommentVotes] = await Promise.all([
        currentUserId
            ? prisma.vote.findUnique({
                where: { userId_postId: { userId: currentUserId, postId } },
                select: { type: true },
            })
            : Promise.resolve(null),
        currentUserId && allCommentIds.length > 0
            ? prisma.vote.findMany({
                where: { userId: currentUserId, commentId: { in: allCommentIds } },
                select: { commentId: true, type: true },
            })
            : Promise.resolve([]),
    ])

    // Step F — build comment vote map
    const voteMap = new Map<string, 'UP' | 'DOWN'>()
    userCommentVotes.forEach(v => voteMap.set(v.commentId!, v.type))

    // Step G — build comment tree (supports arbitrary nesting depth)
    // First pass: create all nodes
    const isAuthenticated = !!session

    const nodeMap = new Map<string, CommentItemProps>()
    allComments.forEach(c => nodeMap.set(c.id, {
        id: c.id,
        postId,
        content: c.content,
        createdAt: c.createdAt,
        isEdited: c.isEdited,
        isDeleted: c.isDeleted,
        // Scrub author identity from deleted comments so it's not exposed in the page source
        authorId: c.isDeleted ? '' : c.authorId,
        author: c.isDeleted ? { name: '[deleted]', username: null } : c.author,
        score: c.votes.filter(v => v.type === 'UP').length - c.votes.filter(v => v.type === 'DOWN').length,
        currentUserVote: voteMap.get(c.id) ?? null,
        replies: [],
    }))
    // Second pass: assign children to parents, collect roots
    // If a parent is absent from nodeMap (orphaned comment), the child is silently dropped
    const commentProps: CommentItemProps[] = []
    allComments.forEach(c => {
        const node = nodeMap.get(c.id)!
        if (c.parentCommentId) {
            nodeMap.get(c.parentCommentId)?.replies?.push(node)
        } else {
            commentProps.push(node)
        }
    })

    const postScore = upCount - downCount

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            <BackButton />

            <PostDetailClient
                post={post}
                isOwner={isOwnProfile}
                isOwnProfile={isOwnProfile}
                postScore={postScore}
                currentUserVote={currentPostVote?.type ?? null}
            />

            <Separator />

            {/* Comments section */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold">
                    {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
                </h2>

                {session
                    ? <CommentComposer postId={post.id} />
                    : <p className="text-sm text-muted-foreground">Sign in to comment.</p>
                }

                <Separator />

                <CommentList
                    comments={commentProps}
                    isAuthenticated={isAuthenticated}
                    currentUserId={currentUserId ?? null}
                />
            </div>
        </div>
    )
}

export default PostDetailPage
