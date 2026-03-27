# Posts

## Overview
Posts are the primary content unit. They can appear on a user's profile or in communities (many-to-many).

## Fields
| Field | Type | Notes |
|---|---|---|
| `title` | `String?` | Optional |
| `content` | `String` | Required |
| `source` | `String?` | Original source URL |
| `language` | `Language` | Default: ENGLISH |
| `isSubscribersOnly` | `Boolean` | Default: false — see visibility rules |
| `isEdited` | `Boolean` | Set to true on edit |

## Visibility Rules
A post's visibility is **never set on the post itself** — it is inherited from context.

| Context | `isSubscribersOnly` | Visible to |
|---|---|---|
| Public profile | `false` | Everyone |
| Public profile | `true` | Subscribers only |
| Private profile | `false` | Approved followers |
| Private profile | `true` (default) | Approved followers who are subscribers |
| Private profile | `true` (opt-in) | Subscribers only (bypasses follow approval) |
| Public community | — | Everyone |
| Private community | — | Community members only |

> Community posts ignore `isSubscribersOnly` — community visibility takes precedence.

## Communities
- A post can belong to **multiple communities** via the `PostCommunity` junction table
- A post with no community association is a **profile post**
- The author's profile page shows a separate tab for their posts in public communities

## Related Features
- Tags — see `tags.md`
- Comments — see `comments.md`
- Votes — see `votes.md`

## Status
- Schema: done
- UI: profile post list implemented (`PostItem`, `PostList`); post cards are clickable links to detail page
- Post creation: done (`PostComposer`, `createPost` server action)
- Post detail page: done (`app/(app)/[handle]/[postId]/page.tsx`) — full content, voting, comment thread
- Post voting: done (`PostVoteButtons`, `votePost` server action) — toggle/switch with optimistic UI
- Edit/delete: not yet implemented
