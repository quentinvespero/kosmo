import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { PostList } from "@/components/profile/PostList"
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

    // fetching user profile data & current session
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
                _count: { select: { posts: true } }
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

    // query posts
    const posts = await prisma.post.findMany({
        where: {
            authorId: profileUser.id,
            // non-owners only see public posts
            ...(!isOwnProfile && { privacy: 'GLOBAL' })
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            privacy: true,
            isEdited: true,
            _count: { select: { comments: true, votes: true } },
            tags: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            <ProfileHeader user={{ ...profileUser, username: profileUser.username }} isOwnProfile={isOwnProfile} />
            <PostList posts={posts} isOwnProfile={isOwnProfile} />
        </div>
    )
}

export default ProfilePage
