# SimPaddock - Senior Staff Monorepo Architecture Blueprint

## The Concept
A modern, high-performance platform for sim racing league hosting and driver registration, built to replace the Discord-spreadsheet-DM workflow that tools like SimGrid and MotorsportReg never solved.

## 1. The Foundation (Tooling & Configs)
* **Package Manager:** `pnpm` (Industry standard for strict dependency trees)
* **Build System:** `TurboRepo` (For caching and orchestrating monorepo tasks)
* **Shared Configs (`packages/config`):**
  * Extracted `eslint`, `prettier`, `tsconfig`, and `tailwind.config.js`.
  * *Note: This is the exact architectural play to pitch in interviews — shared config as its own package, not copy-pasted per app.*

## 2. The Design System (`packages/ui` -> `@simpaddock/ui`)
* **Tech Stack:** `shadcn/ui` (Radix Primitives + Tailwind CSS)
* **The Architecture:** Components are isolated from the main app. You fully own the code and customize the Class Variance Authority (`cva`) configurations.
* **Domain-Specific Variants:**
  * `Badge`: `seat-confirmed` (green), `on-waitlist` (yellow), `ineligible` (red), `split-a` (gold), `split-b` (silver), `split-c` (bronze), `league-host` (purple).
* **Documentation:** Integrated `Storybook` so other developers can view the UI library independently.

## 3. The Business Logic Engine (`packages/api` -> `@simpaddock/api`)
* **Validation (Zod Schemas):**
  * `leagueSchema`: Validates league identity, format, minimum safety rating threshold, and car class eligibility rules.
  * `driverSchema`: Validates driver profile fields — sim account ID, safety rating range, timezone, preferred number.
  * `registrationSchema`: Validates a driver's registration against a league's rules (car class, split assignment, team name).
* **Pricing Utilities:** Pure TypeScript functions like `calculateSeasonFee()` that handle base entry fees, early-bird discounts, and multi-round discounts.
* **State Management:** `Zustand` slice to persist wizard state (both driver registration and league host wizards) across multiple steps.

## 4. The Consuming App (`apps/web`)
* **Tech Stack:** Next.js (App Router)
* **The UI Flow:** Two multi-step wizards using `react-hook-form` + `@hookform/resolvers/zod`, per `docs/user-flow.md`:
  * **Driver Registration:** Driver Profile → Car Class & Team → Season Review → Confirm & Pay.
  * **League Host:** League Setup → Season Builder → Rules & Eligibility → Publish.

## The Interview Narrative (The Flex)
"I built SimPaddock to solve the UX nightmare of legacy sim racing league tools — Discord-pinned schedules, spreadsheet grids, and DMs to chase down driver info. I used a TurboRepo monorepo to separate concerns: UI primitives live in their own package using Radix for accessibility, and eligibility/pricing business logic is isolated in a pure TypeScript package using Zod. This allowed the Next.js consuming app to remain incredibly lightweight, focusing purely on composing wizard flows and rendering — not on validation or design decisions."
