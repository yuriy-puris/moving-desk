# Skill: Test

## When to use
After implementation, before validation.

## Read before starting
- Analyzer output (acceptance criteria)
- Implementer output (files created)

## Mandatory test cases
1. Happy path
2. Validation errors (400)
3. Auth errors (401/403)
4. Tenant isolation — ALWAYS

## Run tests
cd backend && npm run test
All must be green before reporting done.

## File location
Test file lives next to source: auth.ts → auth.test.ts
