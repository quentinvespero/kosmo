# Comments

## Overview
Comments are attached to posts and support **threaded replies** via `parentCommentId`. The data layer and UI both support arbitrary nesting depth — in practice the creation flow currently produces one level of replies.

## Fields
| Field | Type | Notes |
|---|---|---|
| `content` | `String` | Required |
| `source` | `String?` | Optional source URL |
| `postId` | `String` | Parent post |
| `parentCommentId` | `String?` | If set, this is a reply to another comment |
| `isEdited` | `Boolean` | Set to true on edit |

## Voting
Comments support upvote/downvote via the `Vote` model — see `votes.md`

## Deletion
- Deleting a post cascades to all its comments
- Deleting a user cascades to all their comments

## Status
- Schema: done
- UI: done — comment thread on post detail page (`CommentList`, `CommentItem`, `CommentComposer`)
- Comment creation: done (`createComment` server action) — top-level and replies supported
- Comment voting: done (`CommentVoteButtons`, `voteComment` server action)
- Edit/delete: not yet implemented
