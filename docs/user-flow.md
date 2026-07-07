# SimPaddock — Ideal User Flow: Sim Racing League Hosting & Registration

**Purpose:** Define the step-by-step experience for both sides of the SimPaddock platform — drivers finding and joining leagues, and hosts creating and managing them.
**Goal:** A driver can discover and register for a league in under 3 minutes. A host can publish a full season in under 10 minutes.
**Architecture reference:** `react-hook-form` + Zod wizard, `Zustand`-persisted state, `@simpaddock/ui` (shadcn/Radix), per `paddockio.md`.

---

## Design Principles

Carried forward from the MotorsportReg critique and re-grounded in the sim racing context.

1. **One CTA, always visible.** Every screen has one primary action as a real sticky button — never a text link.
2. **Ask once, reuse everywhere.** Driver profile data (sim ID, safety rating, timezone, preferred number) is entered once and pre-filled into every future registration.
3. **Sim-first auth.** Login via Steam or Discord — the two platforms every sim racer already has — not email/password. No 14-field account form on first use.
4. **Terminology is consistent.** One word for each concept: **League** (the championship), **Round** (a single race night), **Split** (a skill-tiered sub-group of the grid), **Seat** (a driver's confirmed spot).
5. **Two-sided clarity.** The product serves both drivers and hosts. Navigation and language makes it immediately obvious which path you're on.
6. **Status is always explicit.** A driver always knows if they're confirmed, waitlisted, or ineligible — shown as a badge, never buried in copy.
7. **Progressive disclosure for hosts.** League creation shows common options first; advanced config (split logic, incident point rules, live stewarding setup) is opt-in and collapsed.
8. **Autosave, no data loss.** Zustand-persisted wizard state so a host building a 12-round season schedule can close the tab and resume.

---

## Platform Flow Overview

```
Landing Page
   │
   ├─── I want to RACE ──────────────────────────────────────────────────────┐
   │                                                                          │
   ▼                                                                          ▼
League Discovery                                              Host Dashboard (create / manage)
   │                                                                          │
   ▼                                                                          ▼
League Detail Page  ──► [sticky "Register for this Season" CTA]       League Setup Wizard
   │                                                                          │
   ▼                                                            ┌─────────────────────────────────┐
Lightweight Auth (Steam / Discord)                             Step 1: League Setup
   │                                                           Step 2: Season Builder
   ▼                                                           Step 3: Rules & Eligibility
Driver Registration Wizard                                     Step 4: Publish
   │
   ├─ Step 1: Driver Profile
   ├─ Step 2: Car Class & Team
   ├─ Step 3: Season Review
   └─ Step 4: Confirm & Pay
         │
         ▼
   Season Dashboard (driver view)
```

---

## Flow A: Driver Registration

### A0. Landing Page

**Purpose:** Immediately communicate what SimPaddock is and split traffic cleanly between drivers and hosts.

- Hero split layout: "Find a League" (primary, left) and "Host a League" (secondary, right). No ambiguity about who the product is for.
- "Find a League" leads to League Discovery. "Host a League" leads to Host Dashboard.
- Social proof: live counters (leagues active, drivers registered this season) — pulled from mock data for the portfolio build.
- No ad units. No sponsored content mixed into organic results.

### A1. League Discovery

**Purpose:** Let a driver find the right league for their sim, skill level, and schedule in seconds.

- Filter bar with four fields, each clearly labeled with icon + text: **Sim/Game** (dropdown: iRacing, ACC, LMU, rF2, AMS2...), **Car Class** (GT3, LMP2, Hypercar, Formula...), **Skill Tier** (Beginner / Intermediate / Advanced), **Day & Time** (day-of-week picker + timezone-aware time range).
- League cards show the six things a driver actually cares about: **sim logo**, **car class**, **round count**, **next round date**, **grid size + spots remaining**, **entry fee** (or "Free"). No organizer's marketing copy above the fold.
- Spots-remaining bar on each card (e.g., "34 / 40 seats filled") creates honest urgency without dark-pattern copy.
- Filter state persists in the URL so results are shareable.

*Friction fixed from competitors:* SimGrid's card grid buries key metadata; terminology ("communities," "events," "leagues") is inconsistent. SimPaddock uses one word per concept.

### A2. League Detail Page

**Purpose:** Give a driver everything needed to decide to register — with the registration CTA always in reach.

- **Sticky header CTA**: "Register for Season — Free" or "Register — $X" always pinned to the top-right, visible regardless of scroll position.
- **Season summary card** above the fold: sim, car class, round count, schedule (list of dates + tracks), grid size, skill tier badge, organizer name + logo. The facts, not the pitch.
- **Eligibility check** below the summary card: a real-time inline check against the driver's profile (or a prompt to sign in to check). Shows `seat-confirmed`, `on-waitlist`, or `ineligible` badge before the driver even clicks Register.
- **Rounds tab**: expandable list of each round with date, track, format (sprint / endurance), and estimated duration.
- **Registered drivers tab**: grid of confirmed drivers with `split-a`/`b`/`c` tier badge — useful for judging the competition level at a glance.
- **Organizer card** at the bottom: host name, logo, link to their other leagues.
- Full rules and conduct policy behind a "View Rules" disclosure — not the first thing the page loads.

*Friction fixed from competitors:* No wall-of-text description to read before finding price/dates. Eligibility shown proactively so the driver knows their status before committing.

### A3. Lightweight Auth (Steam / Discord)

**Purpose:** Get out of the driver's way. Don't gate momentum with a form.

- Triggered only when the driver clicks "Register." Presents two buttons: **Continue with Steam** and **Continue with Discord**. Nothing else.
- Existing user with a completed profile: authenticated and dropped straight into Step 2 of the wizard (profile already filled in). Entire auth step is invisible for returning drivers.
- New user: auth completes, then Step 1 of the wizard collects the sim-specific profile fields once. On every future registration, Step 1 is pre-filled and presented as a confirmation, not re-entry.

*Friction fixed from competitors:* SimGrid's email/password fallback and separate login form adds a step for the majority of drivers who prefer platform auth. MotorsportReg forced full name/email/address/password/emergency contact before the driver had even confirmed a spot existed.

### A4. Driver Registration Wizard — Step 1: Driver Profile

**Purpose:** Capture sim-specific identity once; reuse forever.

- **Returning driver:** profile card shown in read-only mode (display name, sim account ID, safety rating, preferred number, timezone) with a single "Edit" affordance. Advance in one click.
- **New driver:** four fields only — **Display Name**, **Sim Account ID** (with inline format hint per game, e.g., iRacing customer ID is numeric), **Safety Rating** (numeric, with an inline tooltip explaining where to find it in-game), **Timezone** (auto-detected, overridable).
- Preferred race number is optional and collected here — a nice domain-specific touch that signals the platform understands sim racing culture.
- No emergency contact, no postal address, no marketing opt-ins.

*Friction fixed:* MotorsportReg's 14-field account creation form. SimGrid's sign-up path collects only Discord/Steam identity but then has no structured driver profile — leading to organizers chasing info via DM.

### A5. Driver Registration Wizard — Step 2: Car Class & Team

**Purpose:** Confirm the driver's slot within the league's structure.

- Available car classes within this league shown as selectable cards (not a dropdown) — each card shows the class name, car examples, and current seat availability.
- If the league uses splits, the driver's tier badge (`split-a`, `split-b`, `split-c`) is auto-assigned based on their safety rating and the league's split thresholds — shown as a read-only field with a tooltip explaining the assignment logic, not a choice the driver makes manually.
- Optional **Team** field: text input to enter a team name, or leave blank to race as an independent. No team management complexity in v1.

### A6. Driver Registration Wizard — Step 3: Season Review

**Purpose:** One full-page confirmation before money or commitment changes hands.

- Full season schedule displayed as a visual calendar list: every round's date, track, and format in one scannable view. The driver knows exactly what they're signing up for — no surprises mid-season.
- Conflict detection: if the driver is already registered for another SimPaddock league with overlapping round dates, a soft warning appears ("Round 4 conflicts with your GT3 Sprint Series registration"). Not a hard block, just visible context.
- Entry fee itemized: base fee + any applied discounts (early-bird, multi-round).
- Conduct summary: one short paragraph, plain language. "View full rules" opens a modal — never an embedded scroll box. No duplicate consent blocks.

### A7. Driver Registration Wizard — Step 4: Confirm & Pay

**Purpose:** One action, immediate confirmation.

- Single checkbox: "I agree to the league rules and SimPaddock terms of conduct." Linked to the rules modal, not repeated inline.
- For free leagues: "Confirm Seat" button, no payment fields shown.
- For paid leagues: payment fields appear (simulated in portfolio build), then a single "Pay & Confirm Seat — $X" button — sticky, always visible.
- `seat-confirmed` badge rendered immediately on success.

### A8. Season Dashboard (Driver View)

**Purpose:** The ongoing home for a driver's active leagues — replaces the Discord pinned-message chaos.

- One card per registered league showing: upcoming round (date, track, countdown), current standings position, and seat status badge.
- "My Rounds" timeline: all upcoming race nights across all registered leagues, sorted chronologically — one view, no cross-referencing multiple Discord servers.
- No contradictory empty-state copy. If the driver has leagues, they appear. If not, the empty state says exactly "You haven't joined a league yet" with a link to League Discovery.

---

## Flow B: League Host

### B0. Host Dashboard

**Purpose:** A host's home base — all their leagues, at a glance.

- Shows all leagues the host owns with status: `drafting`, `registration-open`, `season-active`, `completed`.
- Primary CTA: "Create New League" — always visible, top-right.
- At-a-glance registration stats per league: seats filled / total grid, waitlist count.

### B1. League Host Wizard — Step 1: League Setup

**Purpose:** Define the league's identity in four fields.

- **League Name**, **Sim/Game** (dropdown), **Format** (Sprint Series / Endurance / Championship), **Visibility** (Public — anyone can find and apply; Invite-only — host approves each driver).
- Cover image upload (optional) — shown on the league card in Discovery.
- That's it for Step 1. No over-asking.

### B2. League Host Wizard — Step 2: Season Builder

**Purpose:** Build the race calendar without needing a spreadsheet.

- Round list with an "Add Round" button. Each round: **Date & Time** (timezone-aware), **Track**, **Car Class**, **Format**, **Grid Size**.
- Drag-to-reorder handles on each row.
- Rounds shown as a preview calendar alongside the list — visual confirmation the schedule makes sense.
- "Use same car class for all rounds" toggle for consistency across a series.

### B3. League Host Wizard — Step 3: Rules & Eligibility

**Purpose:** Set the guardrails that SimPaddock enforces automatically.

- **Minimum Safety Rating**: numeric threshold — the `leagueSchema` Zod validation will surface `ineligible` status to any driver who doesn't meet it before they even attempt to register.
- **Incident Limit Per Round**: sets the threshold above which a driver is flagged for steward review (optional).
- **Conduct Policy**: free-text field for league-specific rules, separate from SimPaddock's platform-level terms.
- **Steward Contact**: optional Discord handle or email for incident appeals.
- Advanced options (split assignment logic, custom eligibility criteria) collapsed under "Advanced Settings" — progressive disclosure, not visible by default.

### B4. League Host Wizard — Step 4: Publish

**Purpose:** Let the host see exactly what drivers will see before going live.

- Full preview of the League Detail page (Flow A, Step A2) rendered with the host's data and mock driver content.
- Two options: **Save as Draft** (invisible in Discovery, editable) or **Publish** (live in Discovery, registration opens immediately).
- Post-publish: host lands on their Host Dashboard with the new league shown as `registration-open`.

---

## Friction Point → Resolution Quick Reference

| Friction point (from sim racing competitor research) | Resolved at |
|---|---|
| Discord-spreadsheet-DM workflow for league management | Host Wizard (B1–B4) replaces the whole stack |
| Inconsistent terminology across competitors (community / event / league / championship) | Glossary locked to: League, Round, Split, Seat — used everywhere without variation |
| No unified driver dashboard across multiple leagues | Season Dashboard (A8) — all leagues and rounds in one place |
| Discord/Steam auth friction handled poorly | Lightweight Auth (A3) — two buttons, returning users skip it entirely |
| Eligibility not surfaced until after registration attempt | League Detail (A2) — inline eligibility check before the driver clicks Register |
| No structured driver profile (organizers chase info via DM) | Driver Profile (A4) — one-time structured entry, reused forever |
| Split assignment opaque or manual | Car Class step (A5) — auto-assigned from safety rating, shown with explanation |
| No season-wide schedule view before committing | Season Review (A6) — full calendar before payment |
| Duplicate/stacked legal consent blocks | Single checkbox at Confirm step (A7) — one consent, one modal for full terms |
