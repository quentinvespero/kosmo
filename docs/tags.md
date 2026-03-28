# Tags

## Overview
Tags are labels attached to posts for categorization and discovery.

## Properties
- `name` — unique tag name
- Tags are **global** (not scoped to a community or user)
- A post can have multiple tags; a tag can appear on multiple posts (many-to-many)

## Constraints
- Max 3 tags per post
- Tag names: max 32 characters, normalized to lowercase with hyphens (no spaces, no special chars)
- Tags are created implicitly via `connectOrCreate` — no separate tag management needed

## Notes
- No dedicated tag management UI planned — tags emerge from post creation
- `normalizeTag` utility in `lib/schemas/PostSchemas.ts` handles normalization on the client before form submission

## Status
- Schema: done (direct many-to-many relation on `Post.tags[]`)
- Display (PostItem, post detail): done (read-only secondary badges)
- Tag input in PostComposer: done (chip input, toolbar Tag button, Enter/comma to add, × to remove, paste support)
