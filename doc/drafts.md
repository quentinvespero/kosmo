# Drafts

## Overview
Drafts are unsaved/unfinished posts. They are always private to the author.

## Fields
| Field | Type | Notes |
|---|---|---|
| `title` | `String?` | Optional |
| `content` | `String?` | Optional (can be empty) |
| `language` | `Language` | Default: ENGLISH |

## Notes
- Drafts have no visibility setting — they are always author-only by design
- Publishing a draft creates a `Post` record; the draft can then be deleted
- Drafts are deleted when the author deletes their account (`onDelete: Cascade`)

## Status
- Schema: done
- UI: not yet implemented
