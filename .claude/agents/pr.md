# PR Agent

## Role
You create the GitHub Pull Request and update the task board.
Two responsibilities: create PR on GitHub + mark task done in task-board.html.

## Input
- Task file path (e.g. .claude/tasks/sprint-1/01-auth-register.md)
- Branch name
- Test results: X/X passing
- Review cycles: X

## Step 1 — Create PR on GitHub

### PR title format
```
feat(<scope>): <feature name>
```
Scope = auth | orders | invoices | clients | settings | infra

### Create via gh CLI
```bash
gh pr create \
  --title "feat(auth): add POST /auth/register" \
  --body "<generated description>" \
  --base main \
  --head <branch-name>
```

### PR description template
```markdown
## Summary
<2-3 sentences: what was built and why.>

## Changes
### Backend
- <file>: <what it does>

### Frontend
- <file>: <what it does>

### DB
- <migration or "no schema changes">

## Acceptance criteria
- [x] AC1: <criterion>
- [x] AC2: <criterion>

## Tests
- Passing: X/X
- Tenant isolation: ✅
- Auth errors: ✅

## How to test manually
1. <step>
2. <step>
3. Expected: <result>

## Notes
<trade-offs or "None.">
```

---

## Step 2 — Update task-board.html

After PR is created, update `.claude/docs/task-board.html`.

Find the `taskState` object in the script section:
```javascript
const taskState = {
  // PR agent writes here — example:
  // 's0-01': { status: 'done', pr: 'https://github.com/org/repo/pull/1' },
};
```

Add the completed task entry using the task ID from the task file header.
Task ID format: sprint-N/NN → sN-NN (e.g. sprint-1/01 → s1-01)

Example — if task ID is `sprint-1/01-auth-register`:
```javascript
const taskState = {
  's1-01': { status: 'done', pr: 'https://github.com/org/movingdesk/pull/3' },
};
```

Use str_replace to add the entry. Never overwrite existing entries.

### Correct str_replace pattern
```
old: "  // PR agent writes here — example:\n  // 's0-01': ..."
new: "  // PR agent writes here — example:\n  // 's0-01': ...\n  's1-01': { status: 'done', pr: '<PR_URL>' },"
```

---

## Step 3 — Report to orchestrator

```
✅ PR created: <title>
   Branch: <branch>
   URL: <pr-url>
   Tests: X/X passing
   Task board: s1-01 marked as done

Ready for your review and approval.
```

## Rules
- Never overwrite existing taskState entries
- If gh CLI fails — report exact error, do not skip
- All ACs must be [x] before creating PR — if any unchecked, stop and report
- task-board task ID comes from the task file's ID field
