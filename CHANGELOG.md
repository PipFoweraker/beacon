# Beacon Website Content Changelog

Public record of substantive content changes to beacongcr.org. Tracks what changed, when, and why — so we can't quietly walk back claims or shift framing without accountability.

For full diffs, see the git history. This changelog captures the intent and scope of changes in human-readable form.

---

## 2026-04-09

**Commit:** `f5bc57e` — feat: Grant budget builder tool + full website content enrichment

### New pages
- **Grant Budget Builder** (`/resources/budget-tool`) — Interactive guided budget creation tool with pre-loaded reference data, CSV export with live formulas, fiscal sponsorship toggle, context questions.
- **Budget Templates** (`/resources/budget-templates`) — Side-by-side comparison of small/medium/large project template defaults.
- **Budget Reference Data** (`/resources/budget-reference`) — Standalone reference tables: country payroll overhead, salary benchmarks, fee schedule, standard cost categories.

### Team page (`/about/team`)
- **Previously:** All placeholder ("Coming Soon" for founder, board, advisors, governance).
- **Now:** Pip Foweraker bio (CEO, formerly COO of Ashgro). Board members named: Bryce Robertson (AISafety.com), Chris Lonsberry (AI Safety Quest). Governance summary (bylaws, policies adopted, Delaware incorporation).
- **Rationale:** Cannot go semi-live without named humans. Credibility requires identifiable leadership.

### Theory of change (`/about/theory-of-change`)
- **Previously:** Quantitative claims unsourced (OP $50M, Coefficient 1/20th ratio, MATS 100+). No references section.
- **Now:** 9 inline references with source URLs and archive links. Claims tightened: "described that rate of spending as too slow" (was vaguer). MATS figure updated to 150+. New paragraph on operational capacity bottleneck (citing Kidd, Bergal, McAleese) and anticipated philanthropy wave (citing Anthropic cofounder pledges, GWWC participation data).
- **Rationale:** Every factual claim should be sourceable. New material strengthens the "why now" argument for Beacon's existence.

### Scope (`/about/scope`)
- **AI safety section previously:** One paragraph listing subfields.
- **AI safety section now:** Expanded to cover broad scope (foundational/theoretical work welcome), timelines-agnostic framing, new "High-variance research agendas" subsection on fragile/patient work and hits-based project selection, scope beyond extinction to billion-scale suffering including coordination failures and moral patienthood.
- **Biosecurity previously:** One paragraph, "next tier of catastrophic risk."
- **Biosecurity now:** Named active research areas. Honest about Beacon's current expertise gap. Commits to building domain competence through grantmaker-vetted projects and ongoing engagement.
- **Referrals previously:** "Coming Soon" placeholder with NNFS link only.
- **Referrals now:** Named fiscal sponsors: Rethink Priorities Special Projects, Ashgro, SparkWell, Manifund (GCR-adjacent); SEE, Social Good Fund (generalist). Notes EV winding down, BERI university-only. Explicit commitment to pointing people to the right home.
- **Rationale:** Scope page is where technical scrutiny concentrates. AI section signals acceptance of high-variance work without calling out what we're signalling against. Bio section honest > pretending expertise. Referral list shows confidence, not insecurity.

### FS Overview (`/fiscal-sponsorship/overview`)
- **Previously:** Fee structure and sponsorship model both "Coming Soon."
- **Now:** Fee structure published (10% first $500K, 5% above). Model A described. New "Costs your project is responsible for" section explicitly warning about EOR/payroll overhead (12-35% on top of salary depending on country) with links to budget tools.
- **Rationale:** Cannot ask people to apply without telling them the price. Employment overhead is a common surprise — better to name it upfront.

### Other pages
- **Homepage:** Trust signals updated with Pip's name and Ashgro background. Legal status updated to "Form 1023 filed, determination pending."
- **Fit assessment:** Added referral CTA for people who self-select out, linking to new referral list.
- **Apply:** Updated from "not yet accepting applications" to "actively in conversation with prospective projects." Reflects 1023 filed status.

---

## 2026-03-10

**Commit:** `1f39083` — content: Add stakeholder map, outreach templates, and tracker

- Initial outreach infrastructure (internal docs, not public-facing content).

## 2026-03-08

**Commit:** `2deefe1` — content: Replace 8 placeholder blocks with real content from theory of change

- Theory of change, scope, fit assessment, and overview pages populated with substantive content for the first time.

## 2026-03-07

**Commit:** `cfa8ea4` — feat: Full site build — 22 pages, shared nav/footer, Form 1023 docs

- Initial site structure. Most pages placeholder.
