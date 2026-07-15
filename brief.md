# Pocki — Project Brief

## Project links
- **Git repository:** https://github.com/mahimodi136-dotcom/glyph
- **Google Drive (assets, docs, design files):** https://drive.google.com/drive/folders/1CSFtq7iO59ZuJgahIQXWtxLnINMejZP2?usp=sharing
- **Contact emails:** mahimodi136@gmail.com (primary), nipunnegi30@gmail.com, simisain03@gmail.com, shorya.sikarwar12@gmail.com
- **Team size:** 4

## Design brief

**Product name**
Pocki

**Primary user**
A 15-year-old trying to save irregular festival and birthday money for a new bike.
All money reaches them digitally — UPI transfers from parents, relatives on
festivals/birthdays, occasional gig/tutoring payments — never physical cash. Money
is irregular, not a fixed weekly allowance, and lands as one blended balance with
no built-in sense of what it's for.

Two adjoining personas sit under this one primary user, sharing the same product:
- **15–17, dependent:** money mostly gifted/allowance from parents, no independent
  income, low financial literacy, high impulse-spend tendency.
- **18–20, semi-independent:** starting to earn (tutoring, internships, gig work)
  alongside family money, slightly more financial awareness, still no budgeting habit.

**Pain**
They receive money from scattered sources with no structure, so they spend
impulsively without tracking it, understanding their patterns, or forming saving
habits. Because the money is digital, it never "feels" allocated for anything —
it lands as one invisible number and gets spent as fast as it arrives, faster
than physical cash would.

**How Might We**
How might we help teens give digital money a sense of purpose and structure —
so saving feels as natural as spending?

**Experience principles**
Quiet · Honest · Non-preachy
- *Quiet* — minimal information density, one clear focus per screen, no
  dashboard crammed with competing stats.
- *Honest* — never implies real banking or payment functionality. Pocki is a
  self-reported ledger and planning layer, not a bank.
- *Non-preachy* — never lectures, shames, or uses guilt-based language around
  spending. Tone is a supportive friend, not a parent or a bank.

**Core journey**
Open app (no login/sign-up) → land on Home → log irregular income → allocate
money into Save / Spend / Give jars at the moment it's logged → check progress
on a specific savings goal → withdraw from a jar when spending, with a soft,
informative prompt if withdrawing from a Save/Goal jar.

**Key screens**
- Home (Jars Overview — jar cards, one insight nudge, goal spotlight, recent
  activity)
- Log Transaction (Money In / Spend toggle, inline jar allocation)
- Savings Goals (goal cards with progress, goal detail view)
- Spend Insights (category breakdown, Save/Spend/Give split, plain-language
  observations)

**Done =**
Live URL, fully functional pure-frontend demo using localStorage, runs under
2 minutes on a real phone.

---

## Core concept: Jars vs Transactions

**Jars** = ongoing, persistent containers that exist independently of any single
moment (Save, Spend, Give, and individual Goal jars). No fixed end — money
accumulates or drains from them over time, and their whole value is in showing
*progress*, not just a balance.

**Transactions** = one-off, time-stamped logging events (a "Money In" or a
"Spend"). Each transaction resolves instantly — the moment it's logged and
allocated to a jar, it's done. Transactions are how jars change; jars are where
the meaning lives.

**Scoping rule (locked decision):** Transactions are always self-reported and
manual — never a real payment, transfer, or bank-synced event. This is what
keeps Pocki honest about being a planning layer rather than a banking product,
avoids the regulatory/security problems of minors moving real money, and keeps
the product to one clean story: jars are where money gets purpose, transactions
are how that purpose gets updated.

## Hard constraints (non-negotiable, apply to every feature)
- **No real UPI ID transfers, no payment scanner, no actual money movement of
  any kind.** Every feature must be checked against this — if it starts to
  imply real payment or bank-linking capability, it's out of scope.
- No investment, credit, lending, or "advance allowance" features — a genuine
  regulatory red line for minors, not just a scope choice.
- No real bank/UPI account linking or transaction-reading (needs backend + bank
  APIs, out of reach for this build).
- No parent-monitoring or parent-control features by default. If a parent view
  is ever added, it must be opt-in and boundaried (totals/goals only, never
  itemized spending, never card-lock or spending-limit controls) — Pocki should
  feel owned by the teen, not supervised.
- No "trust score" or any feature that frames the teen as being evaluated or
  surveilled.
- No complex financial jargon (APR, compounding, credit scores) — this is a
  habit-building tool, not a finance course.
- No large, granular category lists at first — logging a transaction should
  take seconds, not feel like data entry.
- No onboarding, login, or sign-up screens for the core build — the experience
  starts directly at Home.

## UI reference notes (from prior pattern research — FinTeen, Behance)
Patterns worth adapting: goal cards (progress bar, saved/target amount, Add
Funds/Pause actions), a spending-breakdown donut for Spend Insights, small
inline achievement/streak cards rather than a separate gamification tab, and
playful non-lecturing onboarding-style copy tone.

Explicitly rejected from that reference: virtual debit cards or real fund
transfers, parent-side spending limits/card controls, numeric "trust score,"
and auto-calculated round-up savings (requires real transaction data Pocki
doesn't have access to).

## Tech constraints
- Pure frontend only — no backend, no server, no real payment/bank integration.
- Persist all data with `localStorage` (or `window.storage` for Artifacts-style
  persistence) — everything must survive a reload without a server.
- Must work cleanly on a real mobile phone screen, demoable in under 2 minutes.

## Rubric
Not yet provided — add scoring criteria here once available from the hackathon
brief or mentor, so build priorities can be checked against it directly (as
done for Ambit above).
