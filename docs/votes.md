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

## Status
- Schema: done
- UI: not yet implemented
