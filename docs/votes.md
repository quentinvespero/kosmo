# Votes

## Overview
Users can upvote or downvote posts and comments. A user can only cast one vote per target.

## Vote Types
- `UP` — upvote
- `DOWN` — downvote

## Targets
- A vote belongs to either a **post** or a **comment** (not both)
- Enforced via unique constraints: `[userId, postId]` and `[userId, commentId]`

## Constraints
- One vote per user per post
- One vote per user per comment
- Changing vote = update the existing record

## Authorization
Voting is gated by the same visibility rules as viewing (see `posts.md`):
- `votePost` and `voteComment` call `canViewPost` (`lib/access.ts`) and return `Forbidden`
  if the user cannot view the post — e.g. a private-profile post they don't follow, or a
  subscriber-only post. This keeps voting consistent with the post detail page's guards.
- `voteComment` additionally rejects votes on soft-deleted comments (`isDeleted`) with `Not found`.

## Status
- Schema: done
- UI: done — `VoteButtons` (generic), `PostVoteButtons` (posts), `CommentVoteButtons` (comments)
- Server actions: done — `votePost`, `voteComment` with toggle/switch logic and Serializable transactions
- Voting on feedback: done (`voteFeedback` in `lib/actions/feedback.ts`)
