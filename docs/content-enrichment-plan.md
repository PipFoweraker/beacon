# Website Content Enrichment Plan

Prepared 2026-04-09. All proposed text is draft for Pip's review — nothing goes live without explicit approval.

---

## Current State Summary

| Page | Words | Substantive? | Citations | Key Gap |
|------|-------|-------------|-----------|---------|
| Homepage | ~250 | Minimal | 0 | No named people, no credentials visible |
| Theory of Change | ~2,200 | Strong | 0 formal | Claims unsourced (OP $50M, Coefficient 1/20th) |
| Scope | ~1,400 | Solid | 1 link (NNFS) | Bio underweight, "case by case" vagueness |
| Team | ~50 | Placeholder | 0 | Critical credibility gap — no humans named |
| FS Overview | ~400 | Partial | 0 | No fee structure, models undefined |
| Fit Assessment | ~1,100 | Good | 2 links | Generic examples, no real projects named |
| Apply | ~200 | Pre-launch | 0 | No timeline, no notification mechanism |

## What "Best in Class" Looks Like (from BERI, GovAI, Coefficient, MIRI)

1. **Progressive narrowing**: broad mission → specific domain → concrete activities. Lets different audiences enter at their comfort level.
2. **Lead with quantified outcomes**, not methodology explanation. "$33M deployed" > "our unique approach."
3. **Named people with visible track records** beat anonymous institutional voice.
4. **Cite through venue/affiliation prestige**, not bibliographies. "Published in Science" > footnote to Science paper. Save detailed citations for research pages.
5. **State what you DON'T do** as clearly as what you do. Narrow aggressively.
6. **Measured tone, not urgent.** Even discussing existential risk, the tone should be professional and confident. Panic signals incompetence.
7. **Acknowledge constraints as strengths.** MIRI's transparency about alignment research being "too slow" builds more trust than claiming progress.
8. **No mission creep language.** No "we work on everything related to X."

## Approach to Scrutiny-Resistance

Target audience includes people like Demski, davidad, Nate Soares, lorox, r00n, tetraspace — technically rigorous, skeptical of institutional claims, allergic to vagueness and bullshit.

**Principles for their eyes:**
- Every claim either has a source or is explicitly flagged as Beacon's position
- No "we believe" framing for things that are empirically testable — say what the evidence shows
- Acknowledge the capabilities-safety tension directly (the "smiley mask and trenchcoat" problem) without pretending Beacon has a solution — Beacon's role is to house projects, not to solve alignment
- Signal awareness that fiscal sponsorship is administrative infrastructure, not intellectual endorsement. "We evaluate GCR relevance, not research quality" is an honest and useful boundary.
- Don't overclaim on what fiscal sponsorship achieves. It removes administrative friction. That's it. The projects themselves do the work.

**The legibility-opacity spectrum (Pip's essay theme):**
This can be woven into the scope and theory of change without an explicit essay. The idea: some research benefits from transparency (replication, coordination, funder accountability), while other research — particularly at the frontier of AI safety or biosecurity — has legitimate reasons to be less legible. Beacon should signal awareness of this without taking a strong position, because a fiscal sponsor's job is to support both modes.

Suggested framing (for scope or theory of change):
> "We recognise that not all valuable GCR work is equally suitable for public scrutiny. Some projects — particularly those working near capability frontiers or with dual-use implications — may have legitimate operational security considerations. Beacon's evaluation focuses on GCR relevance and team competence, not on publication strategy. We work with projects across the spectrum from fully open research to work that requires more careful information management."

## Page-by-Page Recommendations

### Theory of Change (priority: HIGH)

**What's good:** Clear gap analysis, honest about assumptions, well-structured intervention logic.

**What needs work:**
1. **Source every quantitative claim.** The OP $50M figure, Coefficient's 1/20th ratio, MATS 100+ researchers/year — these are all verifiable. Add a references section at the bottom with numbered links, or use inline hyperlinks to source documents.
2. **Strengthen the "why not existing sponsors" argument.** Currently asserts that generalist sponsors lack GCR domain expertise, but doesn't evidence this with examples of friction. Consider: "Projects applying through generalist fiscal sponsors report [X] — Beacon is designed to address this by [Y]."
3. **Add the "what we don't claim" section.** "Beacon doesn't evaluate research quality, predict which approaches to alignment will succeed, or endorse specific technical agendas. We evaluate whether a project's focus is relevant to GCR reduction and whether the team has the competence to execute."
4. **Bio representation.** Currently barely mentioned. The scope page covers it better, but the theory of change should acknowledge that the GCR fiscal sponsorship gap exists across risk categories, not just AI safety.

**Citation approach recommendation:** Numbered inline references linking to source documents, rendered as superscript links. Example:

```html
<sup><a href="URL" target="_blank">[1]</a></sup>
```

With a "References" section at page bottom listing all sources. This is cleaner than footnotes and works well on static HTML without JS. Similar to how LessWrong handles inline citations but simpler.

### Scope (priority: HIGH)

**What's good:** Clear categorical boundaries, honest about edge cases.

**What needs work:**
1. **Biosecurity needs real substance, not just "next tier."** Current active research areas worth naming (without endorsing):
   - Pathogen detection/surveillance (metagenomic sequencing, wastewater monitoring, NAO-style approaches)
   - Medical countermeasures and rapid-response platforms
   - Respiratory protection and environmental controls (far-UVC, clean air)
   - Gene synthesis screening and genetic engineering detection
   - Governance of dual-use research and international coordination
   - AI-biology intersection risks
   
   SFF's 2025 data: 86% AI, 7% biosecurity. Coefficient is well-resourced ($100M+/year) but independent bio researchers face the same administrative friction as AI safety researchers. **No biosecurity-specific fiscal sponsor currently exists** — this is a genuine gap Beacon should name.

2. **The "referral to right homes" commitment.** Make explicit: "If a project is better served by another sponsor — BERI for university-adjacent work, Effective Ventures for large established projects, or a generalist sponsor for non-GCR work — we will facilitate that introduction rather than try to fit a project into our scope."

3. **Emerging risks section needs sharpening.** "Case by case" reads as "we haven't thought about this." Better: name 2-3 examples of emerging tech risks you'd consider (autonomous weapons, engineered biology, nanotechnology) and explain the evaluation threshold.

### Team (priority: CRITICAL)

The site is about to go semi-live. An unnamed fiscal sponsor is not credible.

**Minimum viable team page:**
- Pip's name, role (CEO), 2-3 sentence bio emphasizing operational experience (Ashgro COO, managed Coefficient-funded projects)
- Board members — even "Board currently being constituted; initial members to be announced [month]" is better than "Coming Soon"
- Governance structure summary: board oversight, conflict of interest policy, annual review

**Stretch:**
- Advisory relationships (even informal ones)
- Explicit note that Beacon is early-stage and building team — honesty about stage is a strength per MIRI pattern

### FS Overview (priority: MEDIUM)

**Must add before semi-live:**
- Fee structure (10% first $500K, 5% above)
- Model A description (at minimum a paragraph — comprehensive fiscal sponsorship where project assets are owned by Beacon, project leads are Beacon employees for legal purposes)
- What's included in the fee (financial admin, compliance, reporting, tax-exempt status, banking)

### Homepage (priority: MEDIUM)

**After team page is populated:**
- Add Pip's name to the trust signals section
- Update 501(c)(3) status language once determination arrives
- Consider adding a "currently pre-launch, accepting expressions of interest" CTA

### Fit Assessment (priority: LOW — already strong)

Minor: add a contact CTA for people who self-select out ("Not the right fit? We may know who is — get in touch").

### Apply (priority: LOW until 501(c)(3) confirmed)

Update timeline estimate once determination arrives.

## Bio Nudges — Research Agendas Beacon Should Be Aware Of

To avoid under-representing biosecurity, here are active areas where fiscal sponsorship gaps exist:

1. **Independent pathogen surveillance researchers** — scaling from academic projects to operational systems. Need grant infrastructure for small teams.
2. **Gene synthesis screening improvements** — iGEM has shown current screening can be evaded. Small teams working on fixes need fiscal homes.
3. **Far-UVC and clean air technology pilots** — early-stage, need grant infrastructure for deployment studies.
4. **Biosecurity policy-to-implementation** — translating NTI/CHS policy recommendations into specific interventions. Smaller organisations doing this work need sponsors.
5. **AI-bio intersection** — researchers studying how AI capabilities affect biological risk. Cross-cutting with AI safety.
6. **Field-building** — biosecurity researcher networks, graduate student programmes, early-career fellowships.

**Key fact:** No biosecurity-specific fiscal sponsor currently exists. BERI focuses on university research labs. Effective Ventures is broad. Beacon naming this gap explicitly in the scope page would be both honest and strategically valuable.

## Infohazard/Legibility Thread

Pip's essay draft touches on a real tension that serious people think about. Rather than a standalone essay on the Beacon site (which might overclaim expertise), weave the awareness into:

1. **Scope page** — acknowledge that some GCR work has legitimate opacity needs
2. **Fit assessment** — note that Beacon evaluates GCR relevance, not publication strategy
3. **Theory of change** — the "quality filter" doesn't mean "only legible work"

Suggested tone: matter-of-fact, not philosophical. "We're aware this tension exists. Our role is administrative infrastructure, not epistemology. We defer to project teams on information management within the bounds of legal compliance and funder requirements."

## Next Steps

1. Pip reviews this plan, marks what to prioritise
2. Draft specific text for approved changes (presented as diffs for review)
3. Team page is the critical path item
4. Citation methodology applied to theory of change first (highest-impact)
5. Scope biosecurity enrichment
6. Everything else is polish
