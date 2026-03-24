# Feeds

## Overview
Feeds are custom, curated timelines. A user can create feeds that aggregate content
from selected communities and/or users.

## Properties
- `name` — feed name
- `description` — optional description
- `isPublic: false` (default) — whether other users can subscribe to this feed

## Composition
A feed can include:
- **Communities** — via `FeedCommunity` junction
- **Users** — via `FeedUser` junction

## Ownership
- Each feed has an owner (`User`)
- Feeds are deleted when the owner deletes their account (`onDelete: Cascade`)

## Status
- Schema: done
- UI: not yet implemented
