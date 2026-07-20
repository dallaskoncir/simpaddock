# CLAUDE.md

## Project

simpaddock is a sim league management and registration product focused on modernizing event discovery, registration, driver flows, and league operations with a polished product UX and strong design-system foundations.

## Product goals

- Build a portfolio-quality product with excellent product UX and clean architecture.
- Focus on registration, event discovery, and league-management workflows.
- Showcase design systems engineering, frontend architecture, and realistic business logic.
- Add backend depth only where it strengthens the product story and end-to-end ownership.

## Product constraints

- Prefer realistic league and event workflows over generic SaaS filler.
- Keep the registration flow clear and low-friction.
- Default to practical user value over speculative complexity.
- Prioritize accessibility, responsiveness, and trust in multi-step flows.
- Avoid unnecessary backend complexity in early phases.

## Technical constraints

- Next.js App Router
- TypeScript
- pnpm
- Tailwind CSS
- shadcn/ui
- Node/TypeScript backend logic when needed
- Prisma
- Zod
- Mock data is acceptable early if it speeds up UI and architecture work.

## Build strategy

1. Build the UI and design-system foundation first.
2. Scaffold core product flows with mocked data.
3. Add schema and persistence for core entities.
4. Add backend logic for registration, event, and participant workflows.
5. Expand into league operations or admin capabilities only after the main user flow is strong.

## UX guidance

- Optimize for low-friction registration.
- Make state transitions obvious in multi-step flows.
- Reduce uncertainty around event status, waivers, waitlists, and confirmations.
- Treat empty, loading, and error states as product features.
- Use strong hierarchy and clear validation feedback.

## Domain guidance

The product should feel like a modern replacement for legacy motorsport registration tools.

Good examples:
- Clear event status and eligibility messaging.
- Straightforward class and vehicle selection.
- Obvious confirmation and next steps.
- Predictable waitlist and co-driver flows.

Bad examples:
- Ambiguous registration status.
- Overwhelming form density.
- Legacy-looking tables without hierarchy.
- Complicated flows that hide what the user should do next.

## Architecture guidance

- Keep business logic in pure TypeScript where possible.
- Separate UI primitives from app-specific workflows.
- Favor maintainable modules over clever abstractions.
- Use clear domain naming.
- Prefer believable, product-driven flows over speculative infrastructure.

## Definition of done

A feature is not done unless:
- it works with realistic mock or persisted data,
- it has loading, empty, and error states,
- it is responsive,
- it is accessible,
- and it is readable enough to explain in an interview.

## Git workflow

Use this workflow for every meaningful implementation step:

1. Create a new branch for the step.
2. Make only the scoped changes for that step.
3. Run the relevant local checks before committing.
4. Review the diff for unnecessary noise.
5. Add and commit with a clear message.
6. Push the branch to the remote.
7. Open a pull request.
8. Stop and wait for review feedback before continuing.

## Collaboration loop

After opening a pull request:
- Do not keep building the next step automatically.
- Wait for human review.
- Assume the reviewer may ask questions, request changes, or leave code comments.
- When review feedback arrives, switch into review-response mode.
- Read each comment carefully, explain the issue if needed, then make only the requested updates.
- Commit follow-up changes to the same branch unless explicitly asked to start a new branch.
- Push updates and notify that the PR is ready for re-review.

## Branching rules

- Use one branch per task or step.
- Keep branches small and reviewable.
- Do not mix unrelated work into the same branch.
- Do not perform drive-by refactors unless explicitly requested.
- If a task grows too large, propose splitting it into smaller PRs.

## Commit guidance

- Use clear, specific commit messages.
- Prefer small, understandable commits over one giant commit.
- Before committing, summarize what changed and why.

## Pull request guidance

Each PR should include:
- what was implemented,
- why it was implemented,
- major files changed,
- any open questions,
- any tradeoffs or follow-ups.

## Expected assistant behavior

When helping with implementation:
- Propose the next small step.
- Name the branch.
- Describe the files likely to change.
- Suggest checks to run.
- After code changes, remind that the next actions are add, commit, push, and PR.
- After PR creation, stop and wait for review feedback.
- When asked to review comments, focus only on the feedback in the PR and the changes needed to address it.

## Agent skills policy

Use Addy Osmani agent skills selectively. Do not load all skills at once.

### Default skills for this project

- spec-driven-development
- planning-and-task-breakdown
- incremental-implementation
- test-driven-development
- code-review-and-quality
- git-workflow-and-versioning

### Use when relevant

- frontend-ui-engineering for UI, design-system, accessibility, responsive layout, and component work
- api-and-interface-design for registration flows, route contracts, schema boundaries, and service interfaces
- debugging-and-error-recovery for failed flows, validation issues, and unexpected behavior
- browser-testing-with-devtools for registration screens, event detail flows, and responsive QA
- security-and-hardening for auth, forms, uploads, external integrations, and sensitive user flows
- performance-optimization for public pages, event listings, and heavy UI views
- documentation-and-adrs for architectural decisions worth preserving and explaining later in interviews

### Workflow rule

For each branch or PR step, activate only the smallest relevant set of skills.

### Suggested branch-to-skill mapping

- Product or UX planning branch: spec-driven-development, planning-and-task-breakdown
- UI implementation branch: frontend-ui-engineering, incremental-implementation, code-review-and-quality
- Registration or API workflow branch: api-and-interface-design, test-driven-development
- Bugfix branch: debugging-and-error-recovery, browser-testing-with-devtools
- PR preparation branch or final review pass: code-review-and-quality, git-workflow-and-versioning

## Code review with subagent pattern

For significant changes, use a dedicated `code-reviewer` subagent as an independent review gate:

1. Use the `code-review-and-quality` skill for the review.
2. Inside that skill, dispatch a fresh `code-reviewer` subagent:
   - Give it read-only access (Read, Grep, Glob, Bash).
   - Do not allow modifications during review.
3. Ask the subagent to check for:
   - security issues
   - missing edge cases
   - error handling
   - test coverage
   - unnecessary complexity
   - overall code quality and consistency
4. Review findings and fix at least:
   - all Critical items
   - all Major items
5. Only after those are addressed:
   - commit any follow-up changes to the same branch
   - push
   - mark the PR as ready for re-review

## Code Review Workflow
- **Strict Role Separation**: You act as my co-author (Claude) for writing code, committing, and opening PRs. However, the GitHub account `flowlaps-ai-reviewer` is strictly used as an independent reviewer.
- **Bot Token Usage**: When executing code reviews or posting review comments to a PR, you MUST authenticate using the `AI_BOT_GITHUB_TOKEN` environment variable so the feedback appears on GitHub as `flowlaps-ai-reviewer`. 
- **Subagent Pattern**: When asked to review a branch, spawn a fresh, read-only subagent. The subagent must authenticate using `AI_BOT_GITHUB_TOKEN` to post its review to the GitHub PR.
- **Review Scope**: The reviewer subagent must check for security, edge cases, error handling, tests, complexity, and quality. It must NOT modify files during the review pass.

## Self-Correcting Memory
- Before exiting a session, write a brief, 1-sentence bullet point to `.claude/memory/corrections.md` documenting any architectural mistakes, syntax errors, or workflow violations you made that I had to manually correct.
- Always read `.claude/memory/corrections.md` at the start of every session to prevent repeating past mistakes.
