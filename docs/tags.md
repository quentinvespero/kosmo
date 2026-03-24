# Tags

## Overview
Tags are labels attached to posts for categorization and discovery.

## Properties
- `name` — unique tag name
- Tags are **global** (not scoped to a community or user)
- A post can have multiple tags; a tag can appear on multiple posts (many-to-many)

## Notes
- Tags are created implicitly when used on a post
- No dedicated tag management UI planned — tags emerge from post creation

## Status
- Schema: done (direct many-to-many relation on `Post.tags[]`)
- UI: tags displayed on `PostItem` (read-only)
- Tag input on post creation: not yet implemented
