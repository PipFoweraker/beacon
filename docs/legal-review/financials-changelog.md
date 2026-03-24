# Form 1023 Financials — Change Log

Tracks changes to Form 1023 financial projections and the reasoning behind them. Each entry records what changed, why, and which files correspond to which version.

## Version History

| Date | Generator Script | Output Workbook | Summary |
|---|---|---|---|
| Pre-Mar 24 | `dump/gen_1023_workbook.py` | `Form 1023 Financials - Beacon Draft.xlsx` | Original projections with project costs lumped on Line 23 |
| 2026-03-24 | `dump/gen_1023_workbook_2026-03-24.py` | `Form 1023 Financials - Beacon Draft (Mar 24).xlsx` | Reclassified project costs to Lines 15/18/22; added grants |

---

## 2026-03-24: Reclassify project disbursements + add grants

### What prompted this

Paul Kim (PKK Legal) requested updated financials before submitting the Form 1023 application. Two changes:

1. **Line 23 was too large.** The original projections put all project spending ($320K–$2.98M) on Line 23 ("Any expense not otherwise classified"). Under Model A fiscal sponsorship, project employees are legally Beacon employees and project contractors are Beacon contractors, so their costs belong on the proper IRS personnel/fees lines — not in "other."

2. **No grants on Line 15.** The Form 1023 supplement describes Activity 3 (Grants to external researchers) at ~5% of time and expenses, but the financials showed $0 on Line 15. Paul flagged the inconsistency.

### Email context

- Paul's request (Mar 24): "I still do need the updated financials, separating out much of the line 23 expense into lines 18 and 22. It would be good to include some amount in the 'grants' line item, perhaps in the outyears, to be consistent with the 5% allocation."
- Pip confirmed split approach and authorized Paul to estimate grant amounts at 5%.
- Pip then undertook the reclassification himself to send to Paul.

### Decisions made

| Decision | Choice | Reasoning |
|---|---|---|
| Split ratio for project disbursements | 65% salaries / 25% contractor fees / 10% direct costs | Research orgs are people-heavy; most project staff employed via EOR |
| Grants source | Carved from existing project disbursement pool | Some projects receive grants instead of Model A sponsorship; total budget unchanged |
| Year 1 grants | $0 | Startup year — grant program begins Y2 as pipeline matures. Paul suggested "perhaps in the outyears" |
| 5% base | 5% of total expenses | Matches supplement language ("5% of time and expenses") |
| Y3 grant rounding | $175K (rounded from $174K) | Cleaner number for projections |

### Numbers: before and after

| Line | Description | Y1 Old | Y1 New | Y2 Old | Y2 New | Y3 Old | Y3 New |
|---|---|---|---|---|---|---|---|
| 15 | Grants paid out | $0 | $0 | $0 | $145,000 | $0 | $175,000 |
| 18 | Other salaries | $120,000 | $330,000 | $195,000 | $1,715,000 | $260,000 | $2,085,000 |
| 22 | Professional fees | $90,000 | $170,000 | $70,000 | $655,000 | $75,000 | $775,000 |
| 23 | Other expenses | $325,000 | $35,000 | $2,510,000 | $260,000 | $3,015,000 | $315,000 |
| **24** | **Total (unchanged)** | **$655,000** | **$655,000** | **$2,900,000** | **$2,900,000** | **$3,480,000** | **$3,480,000** |

### Money flow

```
Old Line 23 "project disbursements":  Y1 $320K    Y2 $2,480K    Y3 $2,980K
├── 5% carved out as grants (→ L15):  Y1 $0       Y2 $145K      Y3 $175K
└── Remaining split:
    ├── 65% project salaries  (→ L18): Y1 $210K   Y2 $1,520K    Y3 $1,825K
    ├── 25% project fees      (→ L22): Y1 $80K    Y2 $585K      Y3 $700K
    └── 10% project direct    (→ L23): Y1 $30K    Y2 $230K      Y3 $280K
```

### What stayed the same

- All revenue lines (Lines 1–13)
- Officer compensation (Line 17)
- Balance sheet (all zeros)
- Total expenses and surplus/deficit
- Non-project Line 23 overhead items (insurance, tech, banking, mailbox, admin)

### Notes on Line 18 composition (for future reference)

New Line 18 combines:
- **Admin staff salaries** (from original Line 18): $120K/$195K/$260K — CoS, admin staff, payroll taxes, EOR costs
- **Project employee salaries** (from Line 23 split): $210K/$1,520K/$1,825K — researchers and educators employed via EOR

### Notes on Line 22 composition

New Line 22 combines:
- **Admin professional fees** (from original Line 22): $90K/$70K/$75K — legal, accounting, audit, formation costs
- **Project contractor fees** (from Line 23 split): $80K/$585K/$700K — independent researchers and consultants
