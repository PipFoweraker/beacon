# Jira Pending Updates

Queued Jira changes and sync notes.

**Project:** BEACON (pipfoweraker.atlassian.net)
**Last updated:** 2026-02-06

---

## Assignee Updates

### Role Mapping Changes

| Old Assignment | New Assignment | Notes |
|---------------|----------------|-------|
| CoS-TBD / Ella / Unassigned | Lisha Chai | Holding CoS tasks interim, label `cos-handover` |
| Pip (overflow) | Lisha Chai | Tasks previously defaulting to Pip that are CoS scope |
| AUAdmin-TBD | Ella | Executive Assistant (some tasks) |
| USRunner-TBD | Paola | US-based runner, label `us-runner` |

### CoS Task Handling
- CoS role not yet filled (hiring in progress)
- ~38 operational tasks assigned to **Lisha Chai** with `cos-handover` label
- When CoS hired: bulk reassign via `JQL: labels = cos-handover AND project = BEACON`
- Admin/scheduling tasks stay with Ella; operational tasks to CoS

### Paola (US Runner)
- Paola added to Jira (display name needs fixing in Atlassian admin: shows as "Paolabaca527")
- Handles US-based runner tasks and US customer service hours
- Tasks tagged with `us-runner` label

---

## Due Date Updates Needed

Based on Phase 0 timeline starting **2026-02-04**:

### Week 1 Tasks (Due: 2026-02-10)
- Confirm engagement with PKK Legal
- Decide state of incorporation
- Define initial board composition requirements
- Identify and approach board candidates
- Decide employment model for AU staff
- Register domain name

### Week 2 Tasks (Due: 2026-02-17)
- Confirm initial board members
- Draft and file Articles of Incorporation
- Obtain EIN from IRS
- Draft Bylaws
- Draft narrative description for 501(c)(3)
- Draft conflicts of interest policy
- Draft delegated authority matrix
- Set up Google Workspace
- Set up QuickBooks Online
- Establish virtual mailbox service
- Research and engage bookkeeping service
- Start sourcing CoS/Ops Lead ← **In progress**

### Week 3 Tasks
- Banking document gathering
- Open US checking account
- Prepare organizational board meeting agenda
- Hold organizational board meeting
- Document board meeting minutes
- Board communication channel
- Fiscal sponsorship agreement template
- Grant agreement templates
- Contractor agreement template

### Week 4 Tasks
- 501(c)(3) application compilation and submission
- Set up Wise Business
- Set up Ramp
- Various policy drafts
- D&O insurance research

### Week 5-6 Tasks
- Testing payment flows
- Documentation completion
- First month-end close
- Insurance purchase

---

## Story Point Estimates

Suggested points (Fibonacci: 1, 2, 3, 5, 8):

| Task Type | Points | Rationale |
|-----------|--------|-----------|
| Simple admin/setup | 1 | Single action, low complexity |
| Research task | 2 | Requires evaluation, comparison |
| Document drafting | 3 | Substantive writing, review needed |
| Complex setup (accounting, Ramp) | 3-5 | Multiple steps, configuration |
| Legal coordination | 5 | External dependency, iteration |
| Policy bundle | 5 | Multiple related policies |
| Month-end close | 5 | First time, process establishment |
| Template creation (attorney) | 3-5 | Attorney dependency |

---

## Missing Fields to Populate

For all open tasks, ensure:
- [ ] Due date set
- [ ] Assignee confirmed (update CoS-TBD → Ben)
- [ ] Story points estimated
- [ ] Dependencies linked (blockedBy relationships)
- [ ] Labels consistent with workstream

---

## New Tasks to Create

### IRS 1023 Preparation (add under Legal: Incorporation story)
1. **Research Form 1023 requirements** - Done locally, document created
2. **Draft detailed narrative description of activities** - Owner: Pip
3. **Extend budget to 3-year projections** - Owner: CoS
4. **Prepare board member information package** - Owner: Pip
5. **Compile attorney questions list** - Owner: Pip

### CoS Onboarding (when hired)
1. **Add CoS to Jira BEACON project** - Owner: Pip
2. **CoS: Review Phase 0 task breakdown** - Owner: CoS
3. **CoS: QBO setup and configuration** - Owner: CoS
4. **Establish CoS-Pip weekly sync cadence** - Owner: Pip

---

## Sprint/Board Configuration

Consider:
- Sprint 1: Week 1-2 tasks (Legal foundation, Board, Initial setup)
- Sprint 2: Week 3-4 tasks (Operations, Banking, Policy)
- Sprint 3: Week 5-6 tasks (Testing, Documentation, Close)

Or simpler: Kanban with "This Week" / "Next Week" / "Backlog" columns

---

## Commands to Run (when MCP working)

```
# Find CoS handover tasks (assigned to Lisha, tagged for handover)
JQL: labels = cos-handover AND project = BEACON

# Find tasks missing due dates
JQL: project = BEACON AND duedate is EMPTY AND status != Done

# Find tasks missing story points
JQL: project = BEACON AND "Story Points" is EMPTY AND issuetype = Task

# Find attorney-dependent tasks
JQL: labels = external-attorney AND project = BEACON

# Find US runner tasks
JQL: labels = us-runner AND project = BEACON
```

---

Last updated: 2026-02-06
