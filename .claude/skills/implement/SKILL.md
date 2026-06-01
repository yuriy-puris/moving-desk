# Skill: Implement

## When to use
After exploration. Only when you have full context.

## Read before starting
- CLAUDE.md (full, every time)
- Explorer output
- Analyzer output (especially acceptance criteria)

## Order of implementation
1. DB migration (if needed)
2. Types
3. Service (business logic)
4. Route (HTTP layer)
5. Frontend hook
6. Frontend component/page

## Before committing
- npm run typecheck → zero errors
- npm run lint → zero errors
- All new files follow patterns from explorer

## Branch
Always on feat/sprint-N-feature-name
Never commit directly to main
