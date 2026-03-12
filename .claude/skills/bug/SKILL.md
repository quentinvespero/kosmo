---
name: bug
description: Reproduce and fix a bug following the project's test-first workflow
argument-hint: [bug description]
---

The user is reporting a bug: $ARGUMENTS

Follow this strict workflow — do NOT skip or reorder steps:

## Step 1 — Understand the bug
- Read the relevant code before forming any hypothesis
- Identify the exact failure condition

## Step 2 — Write a failing test
- Write a test that reproduces the bug
- Run it and confirm it fails for the right reason
- Do not proceed until the test is red

## Step 3 — Fix the bug
- Launch subagents to attempt fixes if the cause is non-obvious
- The fix is proven only when the test passes
- Do not delete or weaken the test to make it pass

## Step 4 — Verify nothing is broken
- Run the full test suite if available
- Check for regressions in related code

## Rules
- Never fix first, test later
- Never skip writing the test (even if the fix seems obvious)
- Keep the test in the codebase — it prevents regressions
