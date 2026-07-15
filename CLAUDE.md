# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pocki** is a fintech app for teens (15-20) to manage irregular digital income (UPI transfers, allowance, gig work) by allocating money into purpose-driven jars (Save, Spend, Give) and tracking savings goals. The product is designed around three core experience principles: *Quiet*, *Honest*, and *Non-preachy*.

**Key Repository Links:**
- GitHub: https://github.com/mahimodi136-dotcom/glyph
- Google Drive (assets, docs, design): https://drive.google.com/drive/folders/1CSFtq7iO59ZuJgahIQXWtxLnINMejZP2?usp=sharing
- Team: mahimodi136@gmail.com (lead), nipunnegi30@gmail.com, simisain03@gmail.com, shorya.sikarwar12@gmail.com

## Core Architecture

### Data Model: Jars vs Transactions

**Jars** (persistent containers):
- Base jars: `Save`, `Spend`, `Give` (always present)
- Goal jars: User-created savings goals with target amounts and progress tracking
- No fixed lifecycle — accumulate/drain over time, value is in progress, not just balance

**Transactions** (time-stamped logging events):
- `MoneyIn` and `Spend` types, always self-reported (never real payment/bank-synced)
- Each transaction allocates money to a jar and resolves instantly
- Transactions are how jars update; jars are where the meaning lives

**Design intent:** This separation ensures Pocki stays honest as a planning/ledger layer, not a banking product, and keeps the feature scope bounded.

### UI Structure

**Key screens:**
1. **Home** — Jar overview (jar cards showing balance/progress), one insight nudge, goal spotlight, recent activity
2. **Log Transaction** — Money In / Spend toggle, inline jar allocation at point of logging
3. **Savings Goals** — Goal cards with progress bars, target amounts, detailed goal views
4. **Spend Insights** — Category breakdown, Save/Spend/Give split visualization, plain-language observations

**Important:** No onboarding, login, or sign-up screens for the core build — experience starts directly at Home.

## Hard Constraints (Non-Negotiable)

These apply to every feature and must be checked before committing code:

1. **No real UPI/payment transfers, no bank-linking, no actual money movement.** Pocki is a self-reported ledger and planning layer, never a banking product.
2. **No investment, credit, lending, or "advance allowance" features** — genuine regulatory red line for minors.
3. **No real bank/UPI account linking or transaction-reading** — would require backend + bank APIs.
4. **No parent-monitoring or parent-control features by default.** If a parent view is ever added, it must be opt-in and strictly bounded (totals/goals only, never itemized spending or card-lock controls).
5. **No "trust score" or surveillance framing** — the teen must feel ownership, not evaluation.
6. **No complex financial jargon** (APR, compounding, credit scores) — this is habit-building, not a finance course.
7. **No large, granular category lists** — transaction logging should take seconds, not feel like data entry.

## Tech Stack & Build

**Architecture:**
- Pure frontend only — no backend, no server, no real payment integration
- All data persisted with `localStorage` (or equivalent artifact storage)
- Must work cleanly on real mobile phone screens, demoable in under 2 minutes

**Expected stack** (check repo for exact tooling):
- Framework: React (or similar frontend library)
- Styling: CSS-in-JS or CSS modules (check project structure)
- Build tool: Vite or similar (verify in package.json)
- State: localStorage-backed (verify in codebase)

**Build & Run Commands:**
(Check the GitHub repository's README or package.json for the authoritative commands — common patterns below)

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (check for localhost:5173 or similar)
npm run build           # Production build
npm run test            # Run tests (if suite exists)
npm run lint            # Run linter
```

To run a single test or specific feature test, check the test configuration in the repository.

## Design & Tone Notes

**Experience principles:**
- **Quiet:** Minimal information density, one clear focus per screen, no dashboard clutter
- **Honest:** Never imply real banking or payment functionality; always call Pocki a ledger
- **Non-preachy:** No lectures, shame, or guilt-based language around spending. Tone is a supportive friend, not a parent or bank.

**UI Reference Patterns** (from FinTeen, Behance research):
- Goal cards: progress bar, saved/target amount, Add Funds/Pause actions
- Spend Insights: spending-breakdown donut visualization
- Achievement/streak cards (inline, not a separate tab)
- Playful, non-lecturing copy tone

**Explicitly rejected patterns:**
- Virtual debit cards or real fund transfers
- Parent-side spending limits or card controls
- Numeric "trust score"
- Auto-calculated round-up savings (requires real transaction data Pocki doesn't have)

## Development Guidance

### Feature Checklist

Before implementing any feature, verify:
1. Does it imply real payment capability? ✗ (scope violation)
2. Does it require backend or bank APIs? ✗ (pure frontend only)
3. Can it be logged with `localStorage` alone? ✓
4. Is it listed in the hard constraints section above? If yes, reject.
5. Does it fit the "Quiet, Honest, Non-preachy" principles? ✓

### Scope: The Core Build (MVP)

**Done = Live URL + fully functional pure-frontend demo using localStorage, runs under 2 minutes on a real phone.**

Priority order:
1. Home screen with jar cards
2. Log Transaction flow (Money In / Spend allocation)
3. Savings Goals (create, view progress)
4. Spend Insights (category breakdown, Save/Spend/Give split)

### Tone & Microcopy

- Never use financial jargon; use plain language
- Supportive, friend-like tone (not authoritative)
- No guilt, shame, or judgment around spending
- Acknowledge the teen's autonomy: "This is your jar" not "You should save more"

### Testing & Verification

- Manual mobile testing is required before marking features complete (check behavior on a real phone screen)
- Test the golden path (log income → allocate to jar → check progress) and edge cases
- Monitor for regressions in other features after changes
- No backend/API tests needed (pure localStorage data)

## File Structure Tips

(Update this section as the repository structure becomes clear — common patterns below)

- `src/` — React components and utilities
- `src/components/` — UI components (Home, LogTransaction, SavingsGoals, SpendInsights, JarCard, etc.)
- `src/hooks/` — Custom hooks for data management and localStorage sync
- `src/lib/` — Utilities (jar calculations, transaction logic, localStorage helpers)
- `public/` — Static assets (icons, images)

## References & Context

- **Brief:** See brief.md for the full project brief, user personas, and pain points
- **GitHub Repo:** https://github.com/mahimodi136-dotcom/glyph
- **Design Assets:** Google Drive folder (link in brief.md)
