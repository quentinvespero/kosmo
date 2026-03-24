# Comments

## Overview
Comments are attached to posts and support **threaded replies** (one level of nesting via `parentCommentId`).

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
- UI: not yet implemented
