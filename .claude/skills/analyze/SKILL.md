# Skill: Analyze

## When to use
Before any code is written. Always first step.

## Read before starting
- CLAUDE.md (full)
- .claude/context/decisions.md
- .claude/context/feature-queue.md

## Output goes to
- .claude/context/task-log.md (append)
- Passed to explorer, implementer, validator, pr agents

## Key questions to answer
1. What exactly is being built? (not how)
2. Who uses it? (owner / dispatcher / public)
3. What DB tables are touched?
4. What are the tenant isolation requirements?
5. What are the acceptance criteria?

## Time box
Do not spend more than 15 minutes on analysis.
If requirements are too vague — list assumptions and proceed.
