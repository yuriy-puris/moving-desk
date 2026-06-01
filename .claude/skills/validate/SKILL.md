# Skill: Validate

## When to use
After tests pass. Check business requirements.

## Read before starting
- Analyzer output (acceptance criteria, user story)
- Feature branch code

## What to check
- Every AC: satisfied or not?
- User story: achievable with what was built?
- USA formats: dates, phone, currency
- Risks from analyzer: addressed?

## Hard fails (cannot approve)
- Any AC not implemented
- Wrong date/phone/currency format
- tenantId missing on any DB query
