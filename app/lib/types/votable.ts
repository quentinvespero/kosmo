interface VotableElement {
    id: string
    content: string
    authorId: string
    author: User
    upvotes: number
    downvotes: number
    ratio: number
    createdAt: Date
    updatedAt: Date
    isEdited: boolean
}

export interface Post extends VotableElement {
    title: string
    comments: Comment[]
    commentCount: number
}

export interface Comment extends VotableElement {
    postId: string
    parentCommentId?: string
    replies?: Comment[]
}