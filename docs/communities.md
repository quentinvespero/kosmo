# Communities

## Overview
Communities are topic-based groups where users can post and interact.
Inspired by Reddit subreddits but integrated into a Twitter-like social graph.

## Visibility
- `isPublic: true` (default) — posts visible to everyone, anyone can join
- `isPublic: false` — posts visible to members only

## Membership & Roles
Managed via the `CommunityMember` junction table.

| Role | Permissions |
|---|---|
| `MEMBER` | Post, comment, vote |
| `MODERATOR` | + Pin posts, moderate content |
| `ADMIN` | + Manage members and settings |

## Ownership
- Each community has an `owner` (User)
- If the owner deletes their account, the community becomes **orphaned** (`isOrphan: true`) but is not deleted

## Posts in Communities
- A post can belong to multiple communities (`PostCommunity` junction)
- Posts can be **pinned** per community (`PostCommunity.isPinned`)
- Post visibility inside a community follows the community's `isPublic` flag, regardless of the author's profile privacy

## Feeds Integration
Communities can be added to custom Feeds — see `feeds.md`

## Status
- Schema: done
- UI: not yet implemented
