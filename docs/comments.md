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
| `isDeleted` | `Boolean` | Set to true on soft-delete (see below) |

## Voting
Comments support upvote/downvote via the `Vote` model — see `votes.md`

## Deletion
- Deleting a post cascades to all its comments
- Deleting a user cascades to all their comments
- **Comment self-deletion** uses a soft-delete strategy to preserve thread integrity:
  - If the comment **has replies**: it is soft-deleted (`isDeleted = true`, `content = ''`). The row stays in the DB so child comments remain anchored. The UI renders the comment as `[deleted]` / *"Comment removed."*
  - If the comment **has no replies** (leaf node): it is hard-deleted and disappears from the UI entirely

## Status
- Schema: done
- UI: done — comment thread on post detail page (`CommentList`, `CommentItem`, `CommentComposer`)
- Comment creation: done (`createComment` server action) — top-level and replies supported
- Comment voting: done (`CommentVoteButtons`, `voteComment` server action)
- Inline reply: done — each `CommentItem` has a Reply button that shows `CommentComposer` inline; auto-closes on successful submit
- Edit/delete: done — author-only `...` menu (`CommentActionsMenu`); edit replaces the comment text with an inline textarea; delete uses soft-delete for comments with replies, hard-delete for leaf nodes; no "edited" indicator is shown in the UI
