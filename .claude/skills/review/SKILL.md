# Skill: Review

## When to use
After validation passes. Final code quality check.

## Read before starting
- CLAUDE.md (security and code rules)
- Full diff of feature branch

## Non-negotiable blocks
- Any `any` type → blocking
- Missing tenantId filter → blocking (security)
- console.log in code → blocking
- Function > 40 lines → blocking
- No auth middleware on protected route → blocking

## Approve only when
All checklist items in reviewer.md pass.
Maximum 2 cycles — escalate to human if still failing after 2.
