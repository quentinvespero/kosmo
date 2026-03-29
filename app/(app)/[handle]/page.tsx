import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { PostList } from "@/components/profile/PostList"
import { BackButton } from "@/components/ui/BackButton"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

type Props = {
    params: Promise<{ handle: string }>
}

const ProfilePage = async ({ params }: Props) => {

    // gather the handle from the url "/[handle]"
    const { handle } = await params

    // fetching user profile data & current session in parallel
    const [profileUser, session] = await Promise.all([
        prisma.user.findUnique({
            where: { username: handle },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                image: true,
                createdAt: true,
                userPreferences: { select: { isPrivate: true } },
                _count: { select: { posts: true, followers: true, following: true } }
            }
        }),
        auth.api.getSession({ headers: await headers() })
    ])

    // guard against user profile non-existing
    if (!profileUser) notFound()
    // guard against users who never completed onboarding (no username set)
    if (!profileUser.username) notFound()

    // check ownership of the profile by the currently connected user
    const isOwnProfile = session?.user.id === profileUser.id

    // check if the profile is set to private or not
    const isPrivate = profileUser.userPreferences?.isPrivate ?? false

    // Determine viewer's follow status (only relevant for other people's profiles)
    let followStatus: 'NONE' | 'PENDING' | 'ACCEPTED' = 'NONE'
    if (!isOwnProfile && session) {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: profileUser.id
                }
            },
            select: { status: true }
        })
        if (follow) followStatus = follow.status as 'PENDING' | 'ACCEPTED'
    }

    // Private profile: only the owner and accepted followers can see posts
    const canViewPosts = isOwnProfile || !isPrivate || followStatus === 'ACCEPTED'

    // query posts
    const posts = canViewPosts ? await prisma.post.findMany({
        where: {
            authorId: profileUser.id,
            // non-owners never see subscribers-only posts (full gating logic comes later)
            ...(!isOwnProfile && { isSubscribersOnly: false })
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            authorId: true,
            isSubscribersOnly: true,
            _count: { select: { comments: true, votes: true } },
            tags: { select: { name: true } },
            author: { select: { name: true, username: true } }
        },
        orderBy: { createdAt: 'desc' }
    }) : []

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            <BackButton />
            <ProfileHeader
                user={{ ...profileUser, username: profileUser.username }}
                isOwnProfile={isOwnProfile}
                isPrivate={isPrivate}
                // null = viewer not logged in → no follow button
                followStatus={session && !isOwnProfile ? followStatus : null}
            />
            {canViewPosts ? (
                <PostList posts={posts} isOwnProfile={isOwnProfile} currentUserId={session?.user.id ?? null} />
            ) : (
                <p className="text-center text-sm text-muted-foreground py-12">
                    This account is private. Follow to see their posts.
                </p>
            )}
        </div>
    )
}

export default ProfilePage
