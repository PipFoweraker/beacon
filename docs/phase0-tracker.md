# Beacon Phase 0 Active Task Tracker

**Phase 0 Start:** 2026-02-04 (Week 1)
**Phase 0 Target End:** 2026-03-17 (Week 6)
**Last updated:** 2026-02-06

Status key: `[ ]` pending | `[~]` in progress | `[x]` done | `[!]` blocked | `[-]` dropped

---

## WEEK 1: Feb 4-10 — Legal Foundation & Board Search

### Pip
- [ ] Confirm engagement with PKK Legal (Paul K. Kim) `CRITICAL`
- [ ] Decide state of incorporation (likely Delaware) `CRITICAL`
- [ ] Define initial board composition requirements
- [ ] Identify and approach board candidates `CRITICAL`
- [ ] Decide employment model for AU staff `CRITICAL`
- [ ] Register domain name (beacongcr.org or similar)
- [ ] Assign CoS tasks to Lisha in Jira with `cos-handover` label

### CoS (Lisha holding)
- [ ] Review Phase 0 task breakdown and foundational docs
- [ ] Review IRS 1023 preparation guide (docs/irs-1023-preparation.md)
- [ ] Begin bank research: Mercury, First Republic, Chase, community banks
  - Deliverable: comparison matrix with recommendation
- [ ] Begin bookkeeping service research (Jitasa as lead candidate)

### Ella
- [ ] Set up Google Workspace (once domain registered)

### Attorney (blocked until engagement confirmed)
- [!] Awaiting engagement confirmation

---

## WEEK 2: Feb 11-17 — Incorporation & Core Setup

### Pip
- [ ] Confirm initial board members (minimum 3) `CRITICAL`
- [ ] Draft narrative description for 501(c)(3) (2-5 pages)
- [ ] Draft conflicts of interest policy
- [ ] Draft delegated authority matrix
- [ ] Start sourcing US Runner

### CoS (Lisha holding)
- [ ] Set up QuickBooks Online nonprofit account
- [ ] Design chart of accounts (FASB nonprofit standards)
- [ ] Design project/class coding structure (QBO classes)
- [ ] Establish virtual mailbox service
- [ ] Gather bank account opening documents (once EIN exists)

### Attorney
- [ ] Draft and file Articles of Incorporation
- [ ] Draft Bylaws

### Pip + Attorney
- [ ] Obtain EIN from IRS (after incorporation filed)

---

## WEEK 3: Feb 18-24 — Board Meeting & Banking

### Pip
- [ ] Prepare organizational board meeting agenda
- [ ] Hold organizational board meeting `CRITICAL`
- [ ] Document board meeting minutes
- [ ] Prepare 3-year financial projections for 1023
- [ ] Draft Certes-Beacon secondment agreement (if using)

### CoS (Lisha holding)
- [ ] Open US checking account `CRITICAL`
- [ ] Research nonprofit-friendly banks (complete matrix)
- [ ] Configure Drive as canonical record store
- [ ] Onboard bookkeeper to QBO (if engaged)
- [ ] Connect bank feeds to QBO

### CoS (Lisha holding) + Ella
- [ ] Create board communication channel

### Attorney
- [ ] Draft fiscal sponsorship agreement template
- [ ] Draft grant agreement template (incoming)
- [ ] Draft contractor agreement template

---

## WEEK 4: Feb 25-Mar 3 — 501(c)(3) Submission & Operations

### Pip
- [ ] Source US Runner (Constellation network, Rob Miles network)
- [ ] Draft whistleblower and complaints process
- [ ] Purchase D&O insurance

### CoS (Lisha holding)
- [ ] Set up Wise Business account
- [ ] Set up Ramp account
- [ ] Configure Ramp approval workflows
- [ ] Set up restricted fund tracking method (QBO)
- [ ] Draft restricted funds handling policy
- [ ] Draft procurement and reimbursement rules
- [ ] Draft document retention policy
- [ ] Research D&O insurance (get 2-3 quotes)

### Attorney
- [ ] Compile 501(c)(3) application package `CRITICAL`
- [ ] Submit Form 1023 via Pay.gov ($600 fee)
- [ ] Draft grant agreement template (outgoing/regranting)

### Ella
- [ ] Set up document signing solution
- [ ] Set up security basics (2FA, audit logging)

---

## WEEK 5: Mar 4-10 — Testing & Policy Adoption

### Pip
- [ ] Board adoption of policy set v1
- [ ] Draft public communications and privacy guidelines
- [ ] Create project diligence checklist
- [ ] Set up 501(c)(3) application tracking

### CoS (Lisha holding)
- [ ] Test domestic USD payment flow
- [ ] Test international payment flow (USD to AUD via Wise)
- [ ] Issue Ramp cards
- [ ] Connect Ramp to QBO
- [ ] Document payment procedures
- [ ] Document expense and reimbursement procedures
- [ ] Create project onboarding checklist
- [ ] Create vendor onboarding checklist
- [ ] Create project intake form
- [ ] Draft donor receipt/acknowledgment template
- [ ] Set up pipeline tracking sheet (pre-CRM)
- [ ] Publish policy set v1 internally
- [ ] Set up time tracking system

### CoS (Lisha holding) + Ella
- [ ] Schedule recurring board meetings (monthly)
- [ ] Create board onboarding pack
- [ ] Create conflict of interest register

### Attorney
- [ ] Legal review of all templates

---

## WEEK 6: Mar 11-17 — Close & Stabilize

### Pip
- [ ] Research state charitable registration (CA, NY priority)
- [ ] Purchase professional indemnity (if needed)

### CoS (Lisha holding)
- [ ] Document accounting policies
- [ ] Run test month-end close `CRITICAL`
  - Reconcile bank accounts, review coding
  - Generate trial balance and financial statements
  - Target: T+5 business days
- [ ] Document HR policies (lightweight)
- [ ] Procure initial hardware/equipment (if needed)

---

## Critical Path Summary

These items gate everything else:

```
Attorney engaged (W1)
  → Incorporation filed (W2)
    → EIN obtained (W2)
      → Bank account opened (W3)
        → Wise/Ramp/QBO connected (W4)
          → Payment testing (W5)
            → Month-end close (W6)

Board candidates identified (W1)
  → Board confirmed (W2)
    → Board meeting held (W3)
      → Policies adopted (W5)
        → Templates finalized (W5)

Narrative + Projections + EIN + Bylaws (W2-3)
  → 1023 application compiled (W4)
    → 1023 submitted (W4)
```

---

## Blockers & Risks Register

| # | Blocker | Impact | Status | Owner |
|---|---------|--------|--------|-------|
| 1 | Attorney engagement not confirmed | Blocks all legal work | OPEN | Pip |
| 2 | Board candidates not identified | Blocks governance track | OPEN | Pip |
| 3 | EIN depends on incorporation | Blocks banking + 1023 | WAITING | Attorney |
| 4 | CoS hiring in progress | Blocks ops execution | OPEN | Pip |
| 5 | | | | |

---

## Decisions Pending

| # | Decision | Options | Owner | Due |
|---|----------|---------|-------|-----|
| 1 | State of incorporation | Delaware (default) / CA / Other | Pip + Attorney | W1 |
| 2 | Employment model (AU staff) | Certes secondment / EOR / Direct | Pip | W1 |
| 3 | Form 1023 vs 1023-EZ | Full 1023 (likely) | Attorney | W3 |
| 4 | CoS employment arrangement | Certes secondment / Other | Pip | When hired |
| 5 | CoS Beacon email domain | beacongcr.org / other | Pip | When hired |

---

## Weekly Check-in Notes

### Week 1 (Feb 4-10)
_Notes from this week:_
- Phase 0 tracker created
- IRS 1023 preparation guide created (docs/irs-1023-preparation.md)
- CoS task delegation documented (docs/cos-tasks.md)
- Jira pending updates captured (docs/jira-pending-updates.md)
- Atlassian MCP auth failing - Jira updates deferred
-

### Week 2
-

### Week 3
-

### Week 4
-

### Week 5
-

### Week 6
-

---

## Completion Metrics

| Workstream | Total Tasks | Done | % |
|------------|------------|------|---|
| Legal: Incorporation & 501(c)(3) | 12 | 0 | 0% |
| Governance: Board Establishment | 10 | 0 | 0% |
| Finance: Banking & Payment Rails | 9 | 0 | 0% |
| Finance: Accounting System | 9 | 0 | 0% |
| Operations: Spend Management | 5 | 0 | 0% |
| Governance: Core Policy Set v1 | 9 | 0 | 0% |
| Operations: Templates & Onboarding | 10 | 0 | 0% |
| HR & Payroll Setup | 8 | 0 | 0% |
| Technology & Admin Setup | 7 | 0 | 0% |
| Insurance | 5 | 0 | 0% |
| **TOTAL** | **84+** | **0** | **0%** |
