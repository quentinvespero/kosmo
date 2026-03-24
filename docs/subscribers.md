# Subscribers (Planned)

## Overview
A paid subscription system allowing users to monetize exclusive content.
Subscribers pay to access a creator's `isSubscribersOnly` posts.

## Visibility interaction
See `posts.md` for full visibility rules. In short:
- `isSubscribersOnly: true` on a public profile → subscribers only
- `isSubscribersOnly: true` on a private profile → depends on `UserPreferences.allowSubscribersOnPrivateProfile`
  - `false` (default): must be an approved follower AND a subscriber
  - `true`: subscriber access bypasses follow approval

## Status
- Schema: **not yet designed** — `Subscription` model needs to be added
- UI: not yet implemented
- Payment integration: not yet decided
