# Beacon Legal Document Review

Status tracker for founder review of PKK Legal drafts (all dated Feb 2026).

## Documents

| Document | Draft Date | Status | Approval Date |
|---|---|---|---|
| Bylaws | Feb 11 | Reviewed, minor Qs for attorney | — |
| Conflict of Interest Policy | Feb 12 | Reviewed, minor clarification requested | — |
| Document Retention Policy | Feb 12 | Reviewed, no issues | — |
| Whistleblower Policy | Feb 12 | Reviewed, typo flagged | — |
| Anti-Bribery and Anti-Corruption Policy | Mar 9 (Beacon draft) | Draft created, sent to attorney | — |

## Review Notes

### Bylaws (Feb 11 draft)

**Structure:** 9 articles covering corporate offices/purposes, members, directors, committees, officers, indemnity, records/reports, general matters, amendments.

**Key parameters baked in:**
- Registered agent: Northwest Registered Agent, Inc., 8 The Green Ste B, Dover, DE
- Minimum board size: 3 directors
- No members (board-governed)
- President must be a director; Secretary and Treasurer cannot concurrently serve as President
- Annual board meeting: Q1 of each fiscal year
- Meeting notice: 7 days default, 48 hours for urgent matters
- Quorum: majority of directors in office
- Director removal: majority vote with notice and opportunity to be heard
- Mandatory audit committee (with enhanced requirements at $2M+ gross revenue)
- Dissolution assets go to 501(c)(3) purposes
- Bylaws amended by majority of total authorized directors

**Items to consider:**
- [ ] **Board size**: "three or more" — is 3 the right initial number? Odd numbers avoid ties. Who are the initial directors?
- [ ] **No members**: Standard for operating nonprofits. Means the board is self-perpetuating (fills its own vacancies, elects its own successors). Correct for Beacon's model?
- [ ] **President = CEO = must be director**: This means Pip must be on the board. Intentional and standard, but worth confirming.
- [ ] **Secretary/Treasurer can't be President**: Need at least 2 people to fill officer roles (President + someone who is both Secretary and Treasurer). Confirm this works with initial team.
- [ ] **Audit committee mandatory from day one**: The enhanced requirements (no staff, no finance committee overlap) only kick in at $2M+ revenue. But the committee itself is required immediately. With a 3-person board where one is President/CEO, that leaves 2 possible audit committee members. Workable?
- [ ] **Fiscal year**: Not set in bylaws — "fixed by resolution of the Board." Need to decide (calendar year is typical for new nonprofits).
- [ ] **Compensation review process** (Section 8.4): Requires advance Board approval with comparability data, documented in writing. This is the "rebuttable presumption of reasonableness" process from IRS intermediate sanctions rules. Good practice.
- [ ] **No loans to directors/officers** (Section 8.5): Standard and required.
- [ ] **Indemnification** (Article VI): Broad indemnification with advancement of expenses. Standard protective language for directors/officers. Consider whether D&O insurance is in the budget.
- [ ] **Written consent without meeting** (Section 3.11): Requires ALL directors to consent. This is standard under DGCL but means a single dissenter forces a meeting. Acceptable?

**Potential issues:**
- Section 3.3 references "Section 3.4" with `{.underline}` — this is a pandoc artifact from the docx, not a content issue.
- No explicit provision for electronic/remote-only operations (beyond meeting by telephone/electronic platform). Given Beacon is likely remote-first, may want to confirm this is sufficient.
- No term limits for directors. Intentional? (Many nonprofits don't have them, but some governance best practices suggest them.)
- Annual meeting "in the first quarter" — this is a hard deadline. Miss it and you're technically out of compliance with your own bylaws.

### Conflict of Interest Policy (Feb 12 draft)

**Structure:** 6 articles covering definitions, procedures, records, compensation, annual statements, periodic review. Includes annual disclosure form.

**Key features:**
- Covers directors, officers, employees, and identified contractors
- "Financial interest" broadly defined (ownership, investment, compensation arrangements)
- Includes "reasonable appearance" standard — errs on side of caution
- Recusal required; interested person provides info only
- Gift limit: $50/year/source
- Annual signed statement + disclosure form required
- Periodic review of compensation and arrangements

**Items to consider:**
- [ ] **Contractor coverage**: "identified contractors" — who identifies them? May need a process for designating which contractors are covered.
- [ ] **$50 gift threshold**: Is this appropriate? Some orgs use $25, others $100. $50 is reasonable.
- [ ] **Annual disclosure form**: The form at the end is fairly standard. Board members need to actually complete this annually.
- [ ] **Excess benefit transaction prohibition**: Explicitly stated. Good — this is the IRS's main enforcement tool for nonprofit governance.

**No significant concerns.** This is a well-drafted, IRS-aligned COI policy. The main practical question is: will Pip (as founder/CEO/director) have conflicts to disclose re: Certes or other entities?

### Document Retention Policy (Feb 12 draft)

**Structure:** General principles, litigation hold, administration, non-compliance, retention schedule table.

**Key features:**
- President administers the policy
- Litigation hold ("destruction halt") provision
- Retention tiers: permanent, active+30yr, active+10yr, active+6yr, active+3yr
- Covers electronic and hard copy

**Items to consider:**
- [ ] **Permanent retention list**: Includes articles, bylaws, minutes, tax returns, financial statements, insurance policies, legal correspondence, licenses. Standard and appropriate.
- [ ] **10-year tier**: Revenue/expense records, contracts, grants, fundraising materials. Generous but safe.
- [ ] **3-year tier**: Employment records, tax-supporting records, credit card receipts, routine correspondence. Matches IRS statute of limitations.
- [ ] **No mention of digital-specific concerns**: Cloud storage, email retention, Slack/messaging, code repositories. May want to address eventually but not critical for initial adoption.
- [ ] **"Active period" undefined**: The table uses "active period plus X years" but doesn't define when records become inactive. E.g., when does an employment record's active period end — termination date? Worth clarifying eventually.

**No blocking concerns.** Standard nonprofit document retention policy.

### Whistleblower Policy (Feb 12 draft)

**Structure:** Reporting responsibility, no retaliation, reporting procedure, accounting matters, good faith, confidentiality, handling of reported violations.

**Key features:**
- Covers board members, officers, employees, volunteers
- No retaliation; retaliation = discipline up to termination
- Open door → supervisor → board member → audit committee
- Audit committee investigates and resolves
- Confidential reporting allowed
- Good faith requirement; malicious/knowingly false reports = disciplinary offense
- Chair of audit committee acknowledges receipt and reports to full board

**Items to consider:**
- [ ] **No anonymous reporting mechanism**: Policy allows "confidential" but doesn't specify anonymous. For a small org this is probably fine initially, but consider adding an anonymous channel as Beacon grows.
- [ ] **No external reporting option**: Some policies mention that employees may also contact appropriate government agencies. Not required but some orgs include it.
- [ ] **"the the full board" (line 47)**: Typo — double "the".
- [ ] **Volunteers covered but no contractors**: COI policy covers contractors; whistleblower policy doesn't explicitly. Minor gap.

**No blocking concerns.** Standard nonprofit whistleblower policy, meets IRS and Sarbanes-Oxley-inspired best practices.

## Decision Log

| Date | Decision | By |
|---|---|---|
| | | |

## Questions for Attorney

See DRAFT-EMAIL-to-Paul.md for compiled questions. Key items:
1. Fiscal year alignment with Certificate of Incorporation
2. Review/clean up Anti-Bribery policy draft
3. Whistleblower typo fix
4. Bylaws: annual meeting "first quarter" flexibility
5. Bylaws: written consent requiring ALL directors — any DGCL flexibility?
6. COI: clarify who designates "identified contractors"
7. Scope future policies: anti-harassment, code of conduct, AML

## Additional Documents Created (Mar 9, 2026)

- `Anti-Bribery and Anti-Corruption Policy - Beacon (draft).md` — adapted from Ashgro policy, tailored for US 501(c)(3) fiscal sponsor
- `Board Member Responsibilities.md` — short practical overview of director duties and time commitment
- `Board Member Briefing - Governance Documents.md` — summary of all 5 governance documents for board member onboarding
- `DRAFT-EMAIL-to-Paul.md` — compiled email to attorney with all change requests

## Open Phil / Coefficient Giving Compliance Gap Analysis

Based on research into GCRCB minimum standards:

| Requirement | Covered by | Status |
|---|---|---|
| Conflict of interest policy | COI Policy (PKK draft) | Done |
| Whistleblower protection | Whistleblower Policy (PKK draft) | Done |
| Document retention | Doc Retention Policy (PKK draft) | Done |
| Anti-bribery / anti-corruption | Anti-Bribery Policy (Beacon draft) | Needs attorney review |
| Anti-harassment / sexual misconduct | Anti-Harassment Policy (Beacon draft) | Needs attorney review |
| Code of conduct | Code of Conduct (Beacon draft) | Needs attorney review |
| Anti-money laundering | — | NOT YET DRAFTED |
| Financial controls narrative | — | Planned (see foundational doc) |
| Data protection / privacy | — | NOT YET DRAFTED |

## Next Steps

- [ ] Pip reviews draft email to Paul and sends (attaching Ashgro policy + Beacon anti-bribery draft)
- [ ] Paul reviews and returns revised documents
- [ ] Schedule organizational board meeting
- [ ] At org meeting: adopt all policies, set fiscal year, elect officers, designate audit committee
- [ ] All directors complete initial COI disclosure forms
- [ ] Before first grant applications: draft anti-harassment policy, code of conduct, AML procedures
