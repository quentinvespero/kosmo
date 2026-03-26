# Keyboard Shortcuts

All global shortcuts are inactive while the user is typing in an `INPUT`, `TEXTAREA`, or `contentEditable` element.

## Navigation

| Key | Action | Condition |
|-----|--------|-----------|
| `F` | Go to the Feedback page | Always active |
| `P` | Go to your profile | Always active |
| `S` | Go to Settings | Own profile page only |

## Composer

| Shortcut | Action | Condition |
|----------|--------|-----------|
| `N` | Focus the post composer | Always active on home page |
| `⌘ Enter` / `Ctrl Enter` | Submit the post | Composer must be focused |

## Implementation

Global shortcuts use the `useKeyboardShortcut` hook (`hooks/useKeyboardShortcut.ts`).

- Accepts `key`, `callback`, and an optional `{ enabled }` flag
- Uses `callbackRef` internally — the window listener is only (re-)registered when `key` or `enabled` changes, not on every render
- The `⌘ Enter` shortcut in the composer is element-scoped (inline `onKeyDown`) and does not use the hook
