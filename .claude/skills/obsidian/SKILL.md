---
name: obsidian
description: Interact with the kosmo_vault Obsidian vault using the Obsidian CLI
argument-hint: [action description or query]
---

The user wants to interact with the Obsidian vault: $ARGUMENTS

## Vault

- **Vault name:** `kosmo_vault`
- **Vault path:** `doc/kosmo_vault/` (relative to project root)
- **Absolute path:** `/Users/quentin/dev/kosmo/kosmo/doc/kosmo_vault/`

## Prerequisites

The Obsidian CLI requires the **Obsidian app to be running**. The binary is at:
```
/Applications/Obsidian.app/Contents/MacOS/Obsidian
```

If `obsidian` is not in PATH, use the full path or check that CLI is enabled in:
`Obsidian → Settings → General → Command Line Interface`

Always target the correct vault with the `vault="kosmo_vault"` flag.

For info, the vault is written in French

---

## CLI Reference

### Basic syntax

```bash
obsidian <command> [options] [vault="kosmo_vault"]
```

### Core commands

| Command | Description |
|---|---|
| `obsidian` | Open interactive TUI with autocomplete |
| `obsidian help` | Show all available commands |
| `obsidian files [sort=modified] [limit=N] [--copy]` | List vault files |
| `obsidian search query="..."` | Search notes in vault |
| `obsidian unresolved` | List all broken/unresolved links |
| `obsidian create name="..." [template=...]` | Create a new note (optionally from template) |
| `obsidian read` | Read the current (focused) file |
| `obsidian tasks [file]` | List tasks from a note |
| `obsidian tags counts` | Show all tags with frequency |
| `obsidian daily` | Open today's daily note |
| `obsidian daily:append content="..."` | Append content to today's daily note |
| `obsidian diff file=... from=... to=...` | Compare two versions of a file |

### Developer commands (rarely needed)

```bash
obsidian devtools                        # Open DevTools
obsidian plugin:reload [plugin-name]     # Reload a plugin
obsidian eval "[JavaScript code]"        # Execute JS in Obsidian context
obsidian dev:errors                      # Show JS errors
obsidian dev:css selector="..."          # Inspect CSS
obsidian dev:dom selector="..."          # Query DOM
```

### Common flags

| Flag | Description |
|---|---|
| `vault="kosmo_vault"` | Target this specific vault |
| `format=json` | Output results as JSON |
| `--copy` | Copy output to clipboard |
| `sort=modified` | Sort files by last modified |
| `limit=N` | Limit number of results |

### Usage examples

```bash
# Search for notes about authentication
obsidian search query="authentication" vault="kosmo_vault"

# List 10 most recently modified files
obsidian files sort=modified limit=10 vault="kosmo_vault"

# Check for broken links
obsidian unresolved vault="kosmo_vault"

# Create a new task note
obsidian create name="tasks/new-feature" vault="kosmo_vault"

# Append to today's daily note
obsidian daily:append content="- Fixed login bug" vault="kosmo_vault"

# Get results as JSON
obsidian files format=json vault="kosmo_vault"
```

---

## When to use CLI vs. file tools

Use the **Obsidian CLI** when:
- Obsidian-specific features are needed (daily notes, templates, link resolution)
- Searching vault content semantically via `search`
- Checking vault health (`unresolved`)

Use **Read/Write/Edit/Grep/Glob tools** directly when:
- Obsidian is not running
- Doing simple file reads, writes, or content searches
- The operation doesn't need Obsidian context

---

## Workflow

1. Check if Obsidian is running before issuing CLI commands
2. Always include `vault="kosmo_vault"` to avoid targeting the wrong vault
3. For task/roadmap notes, look in `doc/kosmo_vault/docs/`
4. Use `format=json` when processing output programmatically
