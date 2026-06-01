# Skill: PR

## When to use
After review approval. Final step before human approval.

## Read before starting
- Analyzer output (user story, AC)
- Test results
- Review cycles count

## Requirements
- gh CLI must be installed and authenticated
- Branch must be pushed to remote
- All ACs must be checked [x]

## Command
gh pr create --title "..." --body "..." --base main --head <branch>

## PR title format
feat(<scope>): <description>
fix(<scope>): <description>

## After PR created
Report PR URL to orchestrator.
