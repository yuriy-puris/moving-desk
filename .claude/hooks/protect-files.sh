#!/bin/bash
# Protect critical files from agent modification

PROTECTED=(
  "CLAUDE.md"
  ".claude/context/decisions.md"
  ".env"
  ".env.production"
)

for file in "${PROTECTED[@]}"; do
  if git diff --cached --name-only | grep -q "^${file}$"; then
    echo "ERROR: Attempted to modify protected file: ${file}"
    echo "Agents must not modify this file directly."
    echo "Update requires human approval."
    exit 1
  fi
done

exit 0
