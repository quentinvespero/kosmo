# User Profile

## Overview
Each user has a public profile at `/@[username]` (route: `/[handle]`).
Profile visibility is controlled by a privacy setting on `UserPreferences`.

## Privacy Model
- `isPrivate: false` (default) — profile and posts are public
- `isPrivate: true` — profile and posts are visible to approved followers only (Twitter/X model)

Switching from private → public makes all profile posts public immediately (no per-post override).

Community posts are **not** affected by profile privacy — community visibility takes precedence.

## Subscriber-only on Private Profiles
Controlled by `UserPreferences.allowSubscribersOnPrivateProfile`:
- `false` (default): subscribers-only posts require being an approved follower AND a subscriber
- `true`: subscribing bypasses the follow approval requirement

## Profile Page Tabs (planned)
1. **Posts** — profile posts by this user
2. **Community posts** — posts made by this user in public communities

## Follow System
- Requires approval when profile is private
- `Follow` model: `followerId` + `followingId` + `status: PENDING | ACCEPTED`
- Public profiles: follows are auto-accepted (ACCEPTED immediately)

## Key Files
- `app/(app)/[handle]/page.tsx` — profile page (server component)
- `components/profile/ProfileHeader.tsx` — avatar, name, bio, stats
- `components/profile/PostList.tsx` + `PostItem.tsx` — post feed

## Status
- Schema: done (Follow model, UserPreferences fields)
- UI: profile header + post list implemented
- Follow system logic: not yet implemented
- Privacy enforcement in queries: not yet implemented (placeholder filter only)
