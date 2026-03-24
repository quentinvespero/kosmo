---
name: obsidian
description: Interact with the docs Obsidian vault using the Obsidian CLI
argument-hint: [action description or query]
---

The user wants to interact with the Obsidian vault: $ARGUMENTS

## Vault

- **Name:** `docs` — **Path:** `docs/` — **Absolute:** `/Users/quentin/dev/kosmo/kosmo/docs/`
- Always include `vault="docs"` in every command

---

## CLI Reference

```bash
obsidian <command> [options] vault="docs"
```

**File resolution:** `file=<name>` resolves by name like a wikilink (no path needed). `path=<path>` is exact (`folder/note.md`).

### Commands

| Command | Description |
|---|---|
| `obsidian files [sort=modified] [limit=N]` | List vault files |
| `obsidian search query="..."` | Search notes |
| `obsidian read [file=<name>]` | Read a note |
| `obsidian create name="..." [template=...]` | Create a note |
| `obsidian tasks [file=<name>]` | List tasks |
| `obsidian tags counts` | Tags with frequency |
| `obsidian daily` / `obsidian daily:append content="..."` | Daily note |
| `obsidian diff file=... from=... to=...` | Diff versions |

### Links & wikilinks

Obsidian connects notes with `[[wikilink]]` / `[[Note|alias]]` syntax. Use `obsidian aliases` to list aliases.

| Command | Description |
|---|---|
| `obsidian links file=<name>` | Outgoing links from a note |
| `obsidian backlinks file=<name>` | Notes that link to a note |
| `obsidian unresolved` | Broken wikilinks (target doesn't exist) |
| `obsidian orphans` | Notes with no incoming links |
| `obsidian deadends` | Notes with no outgoing links |

### Flags

`format=json` · `sort=modified` · `limit=N` · `--copy` · `counts` · `verbose` · `total`

---

## When to use CLI vs. file tools

Use the **CLI** for: link graph traversal, wikilink resolution by name, daily notes, templates, vault health checks.

Use **Read/Write/Edit/Grep/Glob** for: simple reads/writes/searches when Obsidian is not running or Obsidian context isn't needed.
