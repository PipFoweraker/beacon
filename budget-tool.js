// budget-tool.js — Grant Budget Builder for Beacon
// Guided budget creation with pre-loaded reference data and CSV export with live formulas.

(function () {
  'use strict';

  // ============================================================
  // REFERENCE DATA
  // ============================================================

  // Employer-side payroll overhead estimates (rough guides — actual rates
  // vary by jurisdiction, salary level, and employer size).
  var COUNTRIES = {
    us:  { name: 'United States',  currency: 'USD', payrollTaxPct: 12, eorMonthly: 500,  notes: 'FICA 7.65% + state unemployment + workers comp. Varies by state.' },
    uk:  { name: 'United Kingdom', currency: 'GBP', payrollTaxPct: 17, eorMonthly: 550,  notes: 'Employer NI ~13.8% + pension auto-enrollment ~3%.' },
    au:  { name: 'Australia',      currency: 'AUD', payrollTaxPct: 15, eorMonthly: 450,  notes: 'Superannuation 11.5% + WorkCover ~1-2%. State payroll tax may apply.' },
    de:  { name: 'Germany',        currency: 'EUR', payrollTaxPct: 21, eorMonthly: 600,  notes: 'Health ~7.3%, pension ~9.3%, unemployment ~1.3%, care ~1.7%.' },
    fr:  { name: 'France',         currency: 'EUR', payrollTaxPct: 35, eorMonthly: 650,  notes: 'Among the highest in Europe. Patronales charges ~25-45%.' },
    ca:  { name: 'Canada',         currency: 'CAD', payrollTaxPct: 12, eorMonthly: 500,  notes: 'CPP ~5.95%, EI ~2.21%. Varies by province.' },
    nl:  { name: 'Netherlands',    currency: 'EUR', payrollTaxPct: 22, eorMonthly: 600,  notes: 'Social security + mandatory pension. Relatively high.' },
    ch:  { name: 'Switzerland',    currency: 'CHF', payrollTaxPct: 13, eorMonthly: 700,  notes: 'AHV/IV/ALV ~6.4% + pension (varies). High EOR costs.' },
    sg:  { name: 'Singapore',      currency: 'SGD', payrollTaxPct: 17, eorMonthly: 450,  notes: 'CPF employer contribution up to 17%. Lower for older workers.' },
    in:  { name: 'India',          currency: 'INR', payrollTaxPct: 12, eorMonthly: 250,  notes: 'PF ~12%, ESI where applicable. Lower EOR costs.' },
    other: { name: 'Other',        currency: 'USD', payrollTaxPct: 15, eorMonthly: 500,  notes: 'Default estimate. Verify with your EOR provider.' }
  };

  var CONTRACTOR_ADMIN_MONTHLY = 40; // Per-contractor admin overhead (invoicing, compliance, etc.)

  // Beacon's fiscal sponsorship admin fee tiers
  var BEACON_FEE_TIERS = [
    { upTo: 500000,   rate: 0.10 },
    { upTo: Infinity, rate: 0.05 }
  ];

  // US-based salary benchmarks for common GCR roles.
  // Sources: Form 990 filings from GCR/EA nonprofits, 80,000 Hours job board
  // salary ranges (2024-2026), public compensation data.
  // These are approximate — actual compensation varies by experience, location,
  // organisation size, and funding.
  var ROLE_TYPES = {
    research_scientist:  { label: 'Research Scientist (AI Safety)',  minAnnual: 80000,  midAnnual: 120000, maxAnnual: 160000 },
    research_associate:  { label: 'Research Associate / RA',        minAnnual: 50000,  midAnnual: 65000,  maxAnnual: 85000 },
    policy_researcher:   { label: 'Policy Analyst / Researcher',    minAnnual: 55000,  midAnnual: 75000,  maxAnnual: 95000 },
    project_manager:     { label: 'Project Manager',                minAnnual: 60000,  midAnnual: 80000,  maxAnnual: 105000 },
    operations:          { label: 'Operations / Admin',             minAnnual: 40000,  midAnnual: 55000,  maxAnnual: 75000 },
    executive:           { label: 'Executive / Project Lead',       minAnnual: 90000,  midAnnual: 130000, maxAnnual: 170000 },
    software_engineer:   { label: 'Software Engineer (ML/AI)',      minAnnual: 100000, midAnnual: 140000, maxAnnual: 190000 },
    postdoc:             { label: 'Postdoctoral Researcher',        minAnnual: 55000,  midAnnual: 65000,  maxAnnual: 80000 },
    intern:              { label: 'Research Intern / Fellow',       minAnnual: 25000,  midAnnual: 40000,  maxAnnual: 55000 },
    comms:               { label: 'Communications / Outreach',      minAnnual: 45000,  midAnnual: 60000,  maxAnnual: 80000 },
    other:               { label: 'Other (no benchmark)',           minAnnual: null,   midAnnual: null,   maxAnnual: null }
  };

  // Minimum buffer percentages
  var BUFFER_MINS = {
    sickness: 5,      // % of personnel costs
    delay: 5          // % of timeline extension
  };

  // Standard line items per category.
  var CATEGORIES = {
    professional: {
      label: 'Professional Services',
      description: 'Legal advice, accounting, and specialist support. Note: if you\'re under a fiscal sponsor like Beacon, formation/establishment legal costs are handled by the sponsor. Your legal budget here covers advice specific to your project.',
      items: [
        { id: 'legal_hours',     label: 'Legal advice (hours at ~$350/hr)', monthly: false, typical: { small: 0, medium: 2, large: 6 }, warn: null, unit: 'hours', unitCost: 350, unitHint: 'Think: partnership agreements, significant contracts, regranting arrangements, IP questions, visa/immigration support, international payment structures. Each of these typically takes 2-6 hours of legal time.' },
        { id: 'accounting',      label: 'Accounting / bookkeeping',       monthly: true,  typical: { small: 100, medium: 300, large: 600 }, warn: { below: 50, msg: 'Most projects need at least basic bookkeeping. Even a small project should budget $100-300/mo.' } },
        { id: 'tax_prep',        label: 'Tax preparation / filings',      monthly: false, typical: { small: 500, medium: 1500, large: 3000 }, warn: null },
        { id: 'audit',           label: 'Audit / audit readiness',        monthly: false, typical: { small: 0, medium: 5000, large: 14000 }, warn: null },
        { id: 'consultants',     label: 'Specialist consultants',         monthly: false, typical: { small: 0, medium: 0, large: 5000 }, warn: null, unitHint: 'One-off payments to people who help with the project: honoraria, stipends, expert reviews, advisory fees.' },
        { id: 'translation',     label: 'Translation / localization',     monthly: false, typical: { small: 0, medium: 0, large: 0 }, warn: null }
      ]
    },
    compute: {
      label: 'Compute',
      description: 'Cloud compute, GPU resources, data storage, and infrastructure. Separated because these costs can scale unpredictably and funders often want visibility into them.',
      items: [
        { id: 'cloud_general',   label: 'Cloud compute (AWS/GCP/Azure)',  monthly: true,  typical: { small: 50, medium: 200, large: 1000 }, warn: null },
        { id: 'gpu_rental',      label: 'GPU rental / on-demand compute', monthly: true,  typical: { small: 0, medium: 500, large: 3000 }, warn: null },
        { id: 'dedicated_hw',    label: 'Dedicated hardware / colocation', monthly: false, typical: { small: 0, medium: 0, large: 10000 }, warn: null },
        { id: 'data_storage',    label: 'Data storage & backup',          monthly: true,  typical: { small: 10, medium: 50, large: 200 }, warn: null },
        { id: 'bandwidth',       label: 'Bandwidth / data transfer',      monthly: true,  typical: { small: 0, medium: 25, large: 100 }, warn: null }
      ]
    },
    ai_software: {
      label: 'AI & Software Subscriptions',
      description: 'AI API access, ML platform subscriptions, and specialised software licenses. Don\'t forget: Slack, LLM subscriptions (ChatGPT, Claude), coding tools. These costs are growing rapidly in the GCR research space and should be tracked separately.',
      items: [
        { id: 'ai_apis',         label: 'AI API costs (OpenAI, Anthropic, etc.)', monthly: true, typical: { small: 50, medium: 200, large: 1000 }, warn: null },
        { id: 'llm_subs',        label: 'LLM subscriptions (ChatGPT, Claude, etc.)', monthly: true, typical: { small: 20, medium: 100, large: 300 }, warn: null },
        { id: 'ai_platforms',    label: 'ML platforms (Weights & Biases, etc.)',   monthly: true, typical: { small: 0, medium: 50, large: 200 }, warn: null },
        { id: 'slack_comms',     label: 'Slack / team communications',             monthly: true, typical: { small: 0, medium: 25, large: 100 }, warn: null },
        { id: 'annotation',      label: 'Data annotation / labeling services',    monthly: false, typical: { small: 0, medium: 0, large: 5000 }, warn: null },
        { id: 'software_licenses', label: 'Software licenses (specialised)',       monthly: true, typical: { small: 0, medium: 50, large: 150 }, warn: null },
        { id: 'dev_tools',       label: 'Developer tools & CI/CD',                monthly: true, typical: { small: 0, medium: 25, large: 100 }, warn: null }
      ]
    },
    operations: {
      label: 'Operations',
      description: 'Office space, travel, insurance, and the general day-to-day costs of running a project.',
      items: [
        { id: 'office',         label: 'Office / coworking space',             monthly: true,  typical: { small: 0, medium: 400, large: 800 }, warn: null },
        { id: 'utilities',      label: 'Utilities / internet',                 monthly: true,  typical: { small: 50, medium: 75, large: 150 }, warn: null },
        { id: 'email_saas',     label: 'Email & core SaaS (Workspace, etc.)',  monthly: true,  typical: { small: 20, medium: 50, large: 150 }, warn: { below: 10, msg: 'You need at least email and basic tools. Google Workspace is ~$7/user/mo.' } },
        { id: 'hardware',       label: 'Hardware & equipment',                 monthly: false, typical: { small: 500, medium: 2000, large: 5000 }, warn: null },
        { id: 'airfare',        label: 'Travel: airfare',                      monthly: false, typical: { small: 0, medium: 3000, large: 8000 }, warn: null },
        { id: 'accommodation',  label: 'Travel: accommodation',                monthly: false, typical: { small: 0, medium: 1500, large: 4000 }, warn: null },
        { id: 'ground',         label: 'Travel: ground transport',             monthly: false, typical: { small: 0, medium: 500, large: 1500 }, warn: null },
        { id: 'meals_travel',   label: 'Travel: meals',                        monthly: false, typical: { small: 0, medium: 1000, large: 3000 }, warn: null },
        { id: 'conferences',    label: 'Conference / event fees',              monthly: false, typical: { small: 0, medium: 1500, large: 4000 }, warn: null },
        { id: 'insurance_gl',   label: 'Insurance: general liability / event',  monthly: false, typical: { small: 0, medium: 1200, large: 2000 }, warn: null, unitHint: 'Required if running events, workshops, or public-facing activities. Covers venue liability, participant injuries.' },
        { id: 'insurance_pi',   label: 'Insurance: professional indemnity',    monthly: false, typical: { small: 0, medium: 500, large: 1000 }, warn: null },
        { id: 'insurance_travel', label: 'Travel insurance',                   monthly: false, typical: { small: 0, medium: 300, large: 800 }, warn: null },
        { id: 'printing',       label: 'Printing & postage',                   monthly: false, typical: { small: 0, medium: 200, large: 600 }, warn: null },
        { id: 'supplies',       label: 'Office supplies / misc',               monthly: false, typical: { small: 100, medium: 500, large: 1000 }, warn: null }
      ]
    },
    overhead: {
      label: 'Overhead & Admin',
      description: 'Fiscal sponsor fees, banking, and administrative costs. If applying through a fiscal sponsor, their admin fee applies to your total grant revenue.',
      items: [
        { id: 'fs_fee',          label: 'Fiscal sponsor admin fee',        monthly: false, typical: { small: 0, medium: 0, large: 0 }, warn: null, computed: true },
        { id: 'banking',         label: 'Banking / payment processing',    monthly: true,  typical: { small: 10, medium: 25, large: 50 }, warn: null },
        { id: 'fx_fees',         label: 'Currency exchange / FX fees',     monthly: true,  typical: { small: 0, medium: 0, large: 25 }, warn: null },
        { id: 'mail_agent',      label: 'Virtual mailbox / registered agent', monthly: true, typical: { small: 0, medium: 40, large: 40 }, warn: null },
        { id: 'other_admin',     label: 'Other administrative costs',      monthly: false, typical: { small: 0, medium: 0, large: 0 }, warn: null }
      ]
    }
  };

  // Categories that appear as steps (in order)
  var CATEGORY_ORDER = ['professional', 'compute', 'ai_software', 'operations', 'overhead'];

  // Items handled by a fiscal sponsor (greyed out when fiscallySponsored is true)
  var FS_HANDLED_ITEMS = {
    professional: ['accounting', 'tax_prep', 'audit'],
    overhead: ['banking', 'mail_agent']
  };

  function isFsHandled(catId, itemId) {
    return state.fiscallySponsored && FS_HANDLED_ITEMS[catId] && FS_HANDLED_ITEMS[catId].indexOf(itemId) >= 0;
  }

  function applyFsDefaults() {
    Object.keys(FS_HANDLED_ITEMS).forEach(function (catId) {
      FS_HANDLED_ITEMS[catId].forEach(function (itemId) {
        if (state.fiscallySponsored) {
          state.items[catId][itemId].amount = 0;
          state.items[catId][itemId].note = 'Handled by fiscal sponsor';
        } else {
          var itemDef = CATEGORIES[catId].items.filter(function (i) { return i.id === itemId; })[0];
          if (itemDef) {
            state.items[catId][itemId].amount = itemDef.typical[state.size] || 0;
            state.items[catId][itemId].note = '';
          }
        }
      });
    });
  }

  // ============================================================
  // STATE
  // ============================================================

  var state = {
    step: 0,
    projectName: '',
    durationMonths: 12,
    size: 'medium',
    fiscallySponsored: true,
    fsFeeFirstRate: 10,     // % on first tier (editable for non-Beacon sponsors)
    fsFeeSecondRate: 5,     // % above first tier
    personnel: [],
    items: {},
    // Context questions (drive highlights and prompts)
    ctx: { conferences: false, travel: false, events: false, mlTraining: false },
    // Buffer questions
    sicknessConsidered: null,  // null = not answered, true/false
    delayPctInput: 0,          // what user says they allowed
    delayApplied: 0,           // what actually gets applied (max of input and minimum)
    currencyBuffer: 0,
    // Budget model: 'buffer_only' or 'extended_timeline'
    budgetModel: 'buffer_only',
    // Overrides: user insists on lower buffers despite recommendation
    sicknessOverride: false,
    delayOverride: false,
    acknowledged: {}
  };

  var STEPS = [
    { id: 'basics',       label: 'Project Basics' },
    { id: 'personnel',    label: 'Personnel' },
    { id: 'professional', label: 'Professional Services' },
    { id: 'compute',      label: 'Compute' },
    { id: 'ai_software',  label: 'AI & Software' },
    { id: 'operations',   label: 'Operations' },
    { id: 'overhead',     label: 'Overhead & Admin' },
    { id: 'buffers',      label: 'Buffers' },
    { id: 'review',       label: 'Review & Export' }
  ];

  // ============================================================
  // HELPERS
  // ============================================================

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'className') e.className = attrs[k];
      else if (k === 'htmlFor') e.setAttribute('for', attrs[k]);
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, String(attrs[k]));
    });
    if (children != null) {
      if (typeof children === 'string') e.textContent = children;
      else if (Array.isArray(children)) children.forEach(function (c) {
        if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
      else e.appendChild(typeof children === 'string' ? document.createTextNode(children) : children);
    }
    return e;
  }

  function fmt(n) {
    if (n == null || isNaN(n)) return '$0';
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function fmtK(n) {
    if (n == null || isNaN(n) || n === 0) return '$0';
    if (n >= 1000) return '$' + Math.round(n / 1000) + 'K';
    return '$' + Math.round(n);
  }

  function pct(n, total) {
    if (!total) return '0%';
    return (n / total * 100).toFixed(1) + '%';
  }

  function parseNum(s) {
    var n = parseFloat(String(s).replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function initState() {
    Object.keys(CATEGORIES).forEach(function (catId) {
      state.items[catId] = {};
      CATEGORIES[catId].items.forEach(function (item) {
        state.items[catId][item.id] = { amount: 0, note: '' };
      });
    });
    state.personnel = [
      { role: 'Project Lead', roleType: 'executive', empType: 'employee', country: 'us', monthlySalary: 0, fte: 1.0 }
    ];
  }

  function applyTemplate() {
    var size = state.size;
    // Items start blank — example column shows template values.
    // Use "Fill from example" button on each category step to populate.
    // Only apply FS defaults (zero out handled items).
    applyFsDefaults();
    if (size === 'small') {
      state.personnel = [
        { role: 'Project Lead', roleType: 'executive', empType: 'employee', country: 'us', monthlySalary: 5000, fte: 1.0 }
      ];
    } else if (size === 'medium') {
      state.personnel = [
        { role: 'Project Lead / PI', roleType: 'executive', empType: 'employee', country: 'us', monthlySalary: 8000, fte: 1.0 },
        { role: 'Research Associate', roleType: 'research_associate', empType: 'employee', country: 'us', monthlySalary: 5500, fte: 1.0 }
      ];
    } else {
      state.personnel = [
        { role: 'Project Lead / PI', roleType: 'executive', empType: 'employee', country: 'us', monthlySalary: 10000, fte: 1.0 },
        { role: 'Senior Researcher', roleType: 'research_scientist', empType: 'employee', country: 'us', monthlySalary: 8000, fte: 1.0 },
        { role: 'Research Associate', roleType: 'research_associate', empType: 'employee', country: 'us', monthlySalary: 5500, fte: 1.0 },
        { role: 'Operations / Admin', roleType: 'operations', empType: 'contractor', country: 'us', monthlySalary: 4500, fte: 0.5 }
      ];
    }
  }

  // ============================================================
  // CALCULATIONS
  // ============================================================

  function personTotal(p, duration) {
    var dur = duration || state.durationMonths;
    return p.monthlySalary * p.fte * dur;
  }

  function personOverhead(p, duration) {
    var dur = duration || state.durationMonths;
    if (p.empType === 'contractor') {
      var admin = CONTRACTOR_ADMIN_MONTHLY * dur * p.fte;
      return { tax: 0, eor: admin, total: admin, label: 'Admin overhead' };
    }
    var c = COUNTRIES[p.country] || COUNTRIES.other;
    var taxAmt = personTotal(p, dur) * (c.payrollTaxPct / 100);
    var eorAmt = c.eorMonthly * dur * p.fte;
    return { tax: taxAmt, eor: eorAmt, total: taxAmt + eorAmt, label: 'Payroll tax + EOR' };
  }

  function calcPersonnelTotals(duration) {
    var salaries = 0, taxes = 0, eor = 0;
    state.personnel.forEach(function (p) {
      salaries += personTotal(p, duration);
      var oh = personOverhead(p, duration);
      taxes += oh.tax;
      eor += oh.eor;
    });
    return { salaries: salaries, taxes: taxes, eor: eor, total: salaries + taxes + eor };
  }

  function itemTotal(catId, itemId, duration) {
    var dur = duration || state.durationMonths;
    var itemDef = CATEGORIES[catId].items.filter(function (i) { return i.id === itemId; })[0];
    var amount = state.items[catId][itemId].amount;
    if (itemDef && itemDef.unit && itemDef.unitCost) return amount * itemDef.unitCost;
    if (itemDef && itemDef.monthly) return amount * dur;
    return amount;
  }

  function calcCategoryTotal(catId, duration) {
    var total = 0;
    CATEGORIES[catId].items.forEach(function (item) {
      if (item.id === 'fs_fee') return;
      total += itemTotal(catId, item.id, duration);
    });
    return total;
  }

  function calcFsFee(grantTotal) {
    if (!state.fiscallySponsored) return 0;
    // Use variable rates from state (allows non-Beacon sponsor rates)
    var firstRate = state.fsFeeFirstRate / 100;
    var secondRate = state.fsFeeSecondRate / 100;
    var threshold = BEACON_FEE_TIERS[0].upTo; // $500K
    if (grantTotal <= threshold) return grantTotal * firstRate;
    return threshold * firstRate + (grantTotal - threshold) * secondRate;
  }

  // Calculate base project costs (NO fee, NO buffers)
  function calcBaseTotals(duration) {
    var pers = calcPersonnelTotals(duration);
    var cats = {};
    CATEGORY_ORDER.forEach(function (catId) {
      cats[catId] = calcCategoryTotal(catId, duration);
    });
    var subtotal = pers.total;
    CATEGORY_ORDER.forEach(function (catId) { subtotal += cats[catId]; });
    return { personnel: pers, categories: cats, subtotal: subtotal };
  }

  // Main calculation: base → buffers → FS fee last
  // Fee is charged on (base + buffers) so sponsors charge on the full administered amount.
  function calcGrandTotal() {
    var baseDuration = state.durationMonths;
    var base = calcBaseTotals(baseDuration);

    // Sickness buffer on personnel
    var sicknessPct = (state.sicknessConsidered === false && !state.sicknessOverride) ? BUFFER_MINS.sickness / 100 : 0;
    var sicknessAmount = base.personnel.total * sicknessPct;

    // Delay buffer
    var delayPct = state.delayOverride ? (state.delayPctInput / 100) : (state.delayApplied / 100);

    // Buffer-only model
    var bufferOnlyDelay = base.subtotal * delayPct;
    var bufferOnlySubtotal = base.subtotal + sicknessAmount + bufferOnlyDelay;

    // Extended-timeline model
    var extendedDuration = baseDuration * (1 + delayPct);
    var extended = calcBaseTotals(extendedDuration);
    var extendedSubtotal = extended.subtotal + (extended.personnel.total * sicknessPct);

    // Pick model
    var preFeeSub = (state.budgetModel === 'extended_timeline') ? extendedSubtotal : bufferOnlySubtotal;

    // Currency buffer (before fee — it's a project cost)
    var currPct = (state.currencyBuffer || 0) / 100;
    var currencyAmount = preFeeSub * currPct;
    var preFeeTotal = preFeeSub + currencyAmount;

    // FS fee applied LAST — on the full amount the sponsor administers
    var fsFee = calcFsFee(preFeeTotal);
    var grandTotal = preFeeTotal + fsFee;

    // Store fee for display
    state.items.overhead.fs_fee.amount = fsFee;

    return {
      baseDuration: baseDuration,
      extendedDuration: extendedDuration,
      base: base,
      extended: extended,
      sicknessPct: sicknessPct,
      sicknessAmount: sicknessAmount,
      delayPct: delayPct,
      bufferOnly: { delay: bufferOnlyDelay, subtotal: bufferOnlySubtotal },
      extendedTimeline: { subtotal: extendedSubtotal },
      currencyAmount: currencyAmount,
      fsFee: fsFee,
      preFeeTotal: preFeeTotal,
      grandTotal: grandTotal,
      model: state.budgetModel
    };
  }

  // Calculate what the template example totals would be for a given size
  function calcTemplateItemTotal(catId, itemId, size, duration) {
    var dur = duration || state.durationMonths;
    var itemDef = CATEGORIES[catId].items.filter(function (i) { return i.id === itemId; })[0];
    if (!itemDef || itemDef.computed) return 0;
    var amount = itemDef.typical[size] || 0;
    if (itemDef.unit && itemDef.unitCost) return amount * itemDef.unitCost;
    return itemDef.monthly ? amount * dur : amount;
  }

  function calcTemplateCategoryTotal(catId, size, duration) {
    var total = 0;
    CATEGORIES[catId].items.forEach(function (item) {
      if (item.computed) return;
      total += calcTemplateItemTotal(catId, item.id, size, duration);
    });
    return total;
  }

  // Full template totals for sidebar comparison
  function calcTemplateGrandTotal(size, duration) {
    var dur = duration || state.durationMonths;
    // Personnel from template
    var persTotal = 0;
    var templates = { small: [{ sal: 5000, fte: 1.0 }], medium: [{ sal: 8000, fte: 1.0 }, { sal: 5500, fte: 1.0 }], large: [{ sal: 10000, fte: 1.0 }, { sal: 8000, fte: 1.0 }, { sal: 5500, fte: 1.0 }, { sal: 4500, fte: 0.5 }] };
    var people = templates[size] || templates.medium;
    people.forEach(function (p) { persTotal += p.sal * p.fte * dur * 1.12; }); // rough 12% overhead
    var catTotals = {};
    var total = persTotal;
    CATEGORY_ORDER.forEach(function (catId) {
      catTotals[catId] = calcTemplateCategoryTotal(catId, size, dur);
      total += catTotals[catId];
    });
    return { personnel: persTotal, categories: catTotals, total: total };
  }

  // ============================================================
  // WARNINGS
  // ============================================================

  function getWarnings() {
    var warnings = [];
    var totals = calcGrandTotal();

    Object.keys(CATEGORIES).forEach(function (catId) {
      CATEGORIES[catId].items.forEach(function (item) {
        if (item.warn && !item.computed && !isFsHandled(catId, item.id)) {
          var val = state.items[catId][item.id].amount;
          if (item.warn.below != null && val < item.warn.below && val === 0) {
            warnings.push({ category: catId, item: item.id, label: item.label, msg: item.warn.msg });
          }
        }
      });
    });

    if (state.personnel.length === 0) {
      warnings.push({ category: 'personnel', label: 'Personnel', msg: 'No personnel listed. Most projects need at least one person.' });
    }

    state.personnel.forEach(function (p, i) {
      // Salary benchmark warning
      var rt = ROLE_TYPES[p.roleType];
      if (rt && rt.minAnnual && p.monthlySalary > 0) {
        var annual = p.monthlySalary * 12;
        if (annual < rt.minAnnual * 0.8) {
          warnings.push({ category: 'personnel', label: p.role,
            msg: 'Annual salary of ' + fmt(annual) + ' is significantly below the typical range for ' + rt.label + ' (' + fmtK(rt.minAnnual) + '-' + fmtK(rt.maxAnnual) + '). This may indicate an unsustainable rate that leads to turnover or burnout.' });
        }
      }
    });

    // Insurance check for larger budgets
    if (totals.grandTotal > 100000) {
      var hasInsurance = (state.items.operations.insurance_gl.amount > 0) || (state.items.operations.insurance_pi.amount > 0);
      if (!hasInsurance) {
        warnings.push({ category: 'operations', label: 'Insurance', msg: 'Budget exceeds $100K but includes no insurance. Most funders expect at least general liability.' });
      }
    }

    // Travel check for multi-year
    if (state.durationMonths > 12 && state.personnel.length > 0) {
      var hasTravel = (state.items.operations.airfare.amount > 0) || (state.items.operations.conferences.amount > 0);
      if (!hasTravel) {
        warnings.push({ category: 'operations', label: 'Travel', msg: 'Multi-year project with no travel or conference budget. Funders sometimes view this as an oversight.' });
      }
    }

    // Currency warning
    var hasIntl = state.personnel.some(function (p) { return p.country !== 'us'; });
    if (hasIntl && state.currencyBuffer < 2) {
      warnings.push({ category: 'buffers', label: 'Currency risk', msg: 'Staff outside the US but no currency risk buffer. Exchange rates can shift 5-10% over a project\'s lifetime.' });
    }

    return warnings;
  }

  // ============================================================
  // RENDER ENGINE
  // ============================================================

  var root;

  function render() {
    root = $('#budget-app');
    if (!root) return;
    root.innerHTML = '';

    var totals = calcGrandTotal();

    root.appendChild(renderProgress());

    var layout = el('div', { className: 'bt-layout' });
    var main = el('div', { className: 'bt-main' });
    var sidebar = el('div', { className: 'bt-sidebar' });

    main.appendChild(renderStep());
    sidebar.appendChild(renderSummary(totals));

    layout.appendChild(main);
    layout.appendChild(sidebar);
    root.appendChild(layout);
  }

  function renderProgress() {
    var bar = el('div', { className: 'bt-progress' });
    STEPS.forEach(function (s, i) {
      var cls = 'bt-progress-step';
      if (i < state.step) cls += ' done';
      if (i === state.step) cls += ' active';
      var step = el('button', { className: cls, onClick: function () { goToStep(i); } }, [
        el('span', { className: 'bt-progress-num' }, String(i + 1)),
        el('span', { className: 'bt-progress-label' }, s.label)
      ]);
      bar.appendChild(step);
    });
    return bar;
  }

  function renderStep() {
    var stepId = STEPS[state.step].id;
    if (stepId === 'basics') return renderBasics();
    if (stepId === 'personnel') return renderPersonnel();
    if (stepId === 'buffers') return renderBuffers();
    if (stepId === 'review') return renderReview();
    // Category steps
    if (CATEGORIES[stepId]) return renderCategoryStep(stepId);
    return el('div');
  }

  // --- Step: Basics ---
  function renderBasics() {
    var wrap = el('div', { className: 'bt-step' });
    wrap.appendChild(el('h2', null, 'Project Basics'));
    wrap.appendChild(el('p', null, 'Start with the fundamentals. These shape the template and calculations for everything else.'));

    var form = el('div', { className: 'bt-form' });
    form.appendChild(field('Project name', 'text', state.projectName, function (v) { state.projectName = v; }));
    form.appendChild(fieldNumber('Duration (months)', state.durationMonths, 1, 60, function (v) { state.durationMonths = v; }, 1));

    // Project size selector
    var sizeGroup = el('div', { className: 'form-group' });
    sizeGroup.appendChild(el('label', null, 'Project size (pre-fills a template you can adjust)'));
    var sizes = [
      { val: 'small', label: 'Small \u2014 under $100K, 1-2 people', desc: 'Independent researcher, small policy project, workshop series' },
      { val: 'medium', label: 'Medium \u2014 $100K-$500K, 2-5 people', desc: 'Research group, field-building initiative, technical safety project' },
      { val: 'large', label: 'Large \u2014 $500K+, 5+ people', desc: 'Research lab, multi-site project, major initiative' }
    ];
    sizes.forEach(function (s) {
      var opt = el('label', { className: 'bt-size-option' + (state.size === s.val ? ' selected' : '') }, [
        el('input', { type: 'radio', name: 'size', value: s.val, checked: state.size === s.val ? 'checked' : null,
          onChange: function () { state.size = s.val; applyTemplate(); render(); } }),
        el('div', { className: 'bt-size-text' }, [
          el('span', { className: 'bt-size-label' }, s.label),
          el('span', { className: 'bt-size-desc' }, s.desc)
        ])
      ]);
      sizeGroup.appendChild(opt);
    });
    sizeGroup.appendChild(el('p', { className: 'bt-hint' }, [
      el('a', { href: '/resources/budget-templates.html', target: '_blank' }, 'View full template breakdown'),
      ' \u2014 see exactly what each size pre-fills, with explanations.'
    ]));
    form.appendChild(sizeGroup);

    // Fiscal sponsorship toggle
    var fsGroup = el('div', { className: 'form-group' });
    fsGroup.appendChild(el('label', { className: 'bt-checkbox-label' }, [
      el('input', { type: 'checkbox', checked: state.fiscallySponsored ? 'checked' : null,
        onChange: function (e) { state.fiscallySponsored = e.target.checked; applyFsDefaults(); render(); } }),
      ' Are you going to be fiscally sponsored?'
    ]));
    fsGroup.appendChild(el('p', { className: 'bt-hint' }, 'If yes, items like accounting, tax preparation, audit, banking, and mail are handled by your sponsor and excluded from your budget. The sponsor fee is applied last, on your total costs plus buffers.'));
    if (state.fiscallySponsored) {
      var rateRow = el('div', { className: 'bt-rate-row' });
      rateRow.appendChild(el('label', null, 'Fee on first $500K: '));
      rateRow.appendChild(el('input', { type: 'number', value: String(state.fsFeeFirstRate), min: '0', max: '25', step: '0.5', style: 'width:60px;margin-right:1rem',
        onChange: function (e) { state.fsFeeFirstRate = parseNum(e.target.value); render(); } }));
      rateRow.appendChild(el('label', null, '% above $500K: '));
      rateRow.appendChild(el('input', { type: 'number', value: String(state.fsFeeSecondRate), min: '0', max: '25', step: '0.5', style: 'width:60px',
        onChange: function (e) { state.fsFeeSecondRate = parseNum(e.target.value); render(); } }));
      rateRow.appendChild(el('span', { className: 'bt-hint', style: 'margin-left:0.75rem' }, 'Beacon defaults: 10% / 5%. Adjust for your sponsor.'));
      fsGroup.appendChild(rateRow);
    }
    var feeGroup = fsGroup;
    form.appendChild(feeGroup);

    wrap.appendChild(form);
    wrap.appendChild(navButtons());
    return wrap;
  }

  // --- Step: Personnel ---
  function renderPersonnel() {
    var wrap = el('div', { className: 'bt-step' });
    wrap.appendChild(el('h2', null, 'Personnel'));
    wrap.appendChild(el('p', null, 'Add each team member. Overhead costs are calculated automatically based on country and employment type.'));

    state.personnel.forEach(function (p, i) {
      var card = el('div', { className: 'bt-person-card' });

      // Header with remove button
      card.appendChild(el('div', { className: 'bt-person-header' }, [
        el('strong', null, p.role || 'Team member ' + (i + 1)),
        el('button', { className: 'bt-remove-btn', title: 'Remove', onClick: function () { state.personnel.splice(i, 1); render(); } }, 'Remove')
      ]));

      var grid = el('div', { className: 'bt-person-grid' });

      // Role title
      grid.appendChild(field('Role / title', 'text', p.role, function (v) { state.personnel[i].role = v; }));

      // Role type (for benchmarks)
      var rtGroup = el('div', { className: 'form-group' });
      rtGroup.appendChild(el('label', null, 'Role type (for salary benchmark)'));
      var rtSel = el('select', { onChange: function (e) { state.personnel[i].roleType = e.target.value; render(); } });
      Object.keys(ROLE_TYPES).forEach(function (key) {
        rtSel.appendChild(el('option', { value: key, selected: p.roleType === key ? 'selected' : null }, ROLE_TYPES[key].label));
      });
      rtGroup.appendChild(rtSel);
      grid.appendChild(rtGroup);

      // Employment type
      var etGroup = el('div', { className: 'form-group' });
      etGroup.appendChild(el('label', null, 'Employment type'));
      var etSel = el('select', { onChange: function (e) { state.personnel[i].empType = e.target.value; render(); } });
      etSel.appendChild(el('option', { value: 'employee', selected: p.empType === 'employee' ? 'selected' : null }, 'Employee (via EOR)'));
      etSel.appendChild(el('option', { value: 'contractor', selected: p.empType === 'contractor' ? 'selected' : null }, 'Independent contractor'));
      etGroup.appendChild(etSel);
      grid.appendChild(etGroup);

      // Country
      var cGroup = el('div', { className: 'form-group' });
      cGroup.appendChild(el('label', null, 'Country'));
      var cSel = el('select', { onChange: function (e) { state.personnel[i].country = e.target.value; render(); } });
      Object.keys(COUNTRIES).forEach(function (code) {
        cSel.appendChild(el('option', { value: code, selected: p.country === code ? 'selected' : null }, COUNTRIES[code].name));
      });
      cGroup.appendChild(cSel);
      grid.appendChild(cGroup);

      // Monthly salary with benchmark
      var salGroup = el('div', { className: 'form-group' });
      salGroup.appendChild(el('label', null, 'Monthly salary (USD)'));
      salGroup.appendChild(el('input', {
        type: 'number', value: String(p.monthlySalary), min: '0', step: '100',
        onChange: function (e) { state.personnel[i].monthlySalary = parseNum(e.target.value); render(); }
      }));

      // Salary benchmark display
      var rt = ROLE_TYPES[p.roleType];
      if (rt && rt.minAnnual) {
        var benchmarkDiv = el('div', { className: 'bt-benchmark' });
        var annual = p.monthlySalary * 12;
        benchmarkDiv.appendChild(el('span', { className: 'bt-hint' },
          'Benchmark (' + rt.label + ', US): ' + fmtK(rt.minAnnual) + ' \u2013 ' + fmtK(rt.maxAnnual) + '/yr, median ' + fmtK(rt.midAnnual)));

        // Visual position indicator
        if (p.monthlySalary > 0) {
          var position = Math.max(0, Math.min(1, (annual - rt.minAnnual) / (rt.maxAnnual - rt.minAnnual)));
          var barWrap = el('div', { className: 'bt-benchmark-bar' });
          var barFill = el('div', { className: 'bt-benchmark-fill' });
          barFill.style.width = (position * 100) + '%';
          if (annual < rt.minAnnual * 0.8) barFill.className += ' low';
          else if (annual < rt.minAnnual) barFill.className += ' below';
          barWrap.appendChild(barFill);
          var marker = el('div', { className: 'bt-benchmark-marker' });
          marker.style.left = '50%';
          barWrap.appendChild(marker);
          benchmarkDiv.appendChild(barWrap);

          if (annual < rt.minAnnual * 0.8) {
            benchmarkDiv.appendChild(el('span', { className: 'bt-salary-warn' },
              'Significantly below typical range. Risk of turnover, burnout, or difficulty hiring.'));
          } else if (annual < rt.minAnnual) {
            benchmarkDiv.appendChild(el('span', { className: 'bt-salary-note' },
              'Below typical range. May be appropriate for the specific context.'));
          }
        }
        salGroup.appendChild(benchmarkDiv);
      }
      grid.appendChild(salGroup);

      // FTE
      grid.appendChild(fieldNumber('FTE (1.0 = full time)', p.fte, 0.1, 1.0, function (v) { state.personnel[i].fte = v; render(); }, 0.1));

      card.appendChild(grid);

      // Salary frequency display
      if (p.monthlySalary > 0) {
        var freqDiv = el('div', { className: 'bt-salary-freq' });
        var monthly = p.monthlySalary * p.fte;
        freqDiv.appendChild(el('span', null, 'Weekly: ' + fmt(monthly / 4.33)));
        freqDiv.appendChild(el('span', null, 'Fortnightly: ' + fmt(monthly / 2.167)));
        freqDiv.appendChild(el('span', null, 'Monthly: ' + fmt(monthly)));
        freqDiv.appendChild(el('span', null, 'Annual: ' + fmt(monthly * 12)));
        freqDiv.appendChild(el('span', null, 'Hourly (40hr/wk): ' + fmt(monthly * 12 / 2080)));
        card.appendChild(freqDiv);
      }

      // Calculated overhead
      var ov = personOverhead(p);
      var c = COUNTRIES[p.country] || COUNTRIES.other;
      var info = el('div', { className: 'bt-person-calc' });
      info.appendChild(el('span', null, 'Salary over ' + state.durationMonths + 'mo: ' + fmt(personTotal(p))));
      if (p.empType === 'employee') {
        info.appendChild(el('span', null, 'Payroll taxes (~' + c.payrollTaxPct + '%): ' + fmt(ov.tax)));
        info.appendChild(el('span', null, 'EOR fees (~' + fmt(c.eorMonthly) + '/mo): ' + fmt(ov.eor)));
      } else {
        info.appendChild(el('span', null, 'Contractor admin (~' + fmt(CONTRACTOR_ADMIN_MONTHLY) + '/mo): ' + fmt(ov.eor)));
      }
      info.appendChild(el('span', { className: 'bt-person-total' }, 'Total cost: ' + fmt(personTotal(p) + ov.total)));
      if (p.empType === 'employee' && c.notes) {
        info.appendChild(el('span', { className: 'bt-hint' }, c.notes));
      }
      card.appendChild(info);

      wrap.appendChild(card);
    });

    wrap.appendChild(el('button', { className: 'btn btn-secondary', onClick: function () {
      state.personnel.push({ role: '', roleType: 'other', empType: 'employee', country: 'us', monthlySalary: 0, fte: 1.0 });
      render();
    } }, '+ Add team member'));

    wrap.appendChild(navButtons());
    return wrap;
  }

  // --- Step: Category ---
  function renderCategoryStep(catId) {
    var cat = CATEGORIES[catId];
    var wrap = el('div', { className: 'bt-step' });
    wrap.appendChild(el('h2', null, cat.label));
    wrap.appendChild(el('p', null, cat.description));

    // Context questions for relevant categories
    var questions = {
      operations: [
        { key: 'conferences', label: 'Planning to present at or attend conferences?', hint: 'Consider: airfare, accommodation, conference fees, printing for posters/materials.' },
        { key: 'travel', label: 'Will team members need to travel?', hint: 'Don\'t forget travel insurance, ground transport, and meal costs.' },
        { key: 'events', label: 'Running events (workshops, seminars, retreats)?', hint: 'You\'ll need event insurance (general liability) and possibly venue hire, catering, materials.' }
      ],
      compute: [
        { key: 'mlTraining', label: 'Will your research involve training ML models?', hint: 'GPU costs can be the largest single line item. Budget conservatively and track usage.' }
      ]
    };
    if (questions[catId]) {
      var qBox = el('div', { className: 'bt-context-questions' });
      questions[catId].forEach(function (q) {
        var qLabel = el('label', { className: 'bt-ctx-q' }, [
          el('input', { type: 'checkbox', checked: state.ctx[q.key] ? 'checked' : null,
            onChange: function (e) { state.ctx[q.key] = e.target.checked; render(); } }),
          ' ' + q.label
        ]);
        qBox.appendChild(qLabel);
        if (state.ctx[q.key]) {
          qBox.appendChild(el('p', { className: 'bt-ctx-hint' }, q.hint));
        }
      });
      wrap.appendChild(qBox);
    }

    // Fill from example button
    wrap.appendChild(el('button', { className: 'btn btn-secondary', style: 'font-size:0.85rem;padding:0.4rem 1rem;margin-bottom:1rem', onClick: function () {
      CATEGORIES[catId].items.forEach(function (item) {
        if (!item.computed && !isFsHandled(catId, item.id)) {
          state.items[catId][item.id].amount = item.typical[state.size] || 0;
        }
      });
      render();
    } }, 'Fill from ' + state.size + ' example values'));

    if (catId === 'overhead' && state.fiscallySponsored) {
      var totals = calcGrandTotal();
      var feeNote = el('div', { className: 'bt-fee-note' });
      feeNote.appendChild(el('p', null, 'Fiscal sponsor admin fee is calculated last, on your total project costs plus buffers. Current estimate: ' + fmt(totals.fsFee)));
      feeNote.appendChild(el('p', { className: 'bt-hint' }, 'Rates: ' + state.fsFeeFirstRate + '% on first $500K, ' + state.fsFeeSecondRate + '% above. Shown in Review step.'));
      wrap.appendChild(feeNote);
    }

    var table = el('div', { className: 'bt-items' });
    table.appendChild(el('div', { className: 'bt-item-row bt-item-header' }, [
      el('div', { className: 'bt-item-label' }, 'Line item'),
      el('div', { className: 'bt-item-freq' }, 'Type'),
      el('div', { className: 'bt-item-amount' }, 'Your amount'),
      el('div', { className: 'bt-item-total' }, 'Project total'),
      el('div', { className: 'bt-item-example' }, 'Example (' + state.size + ')'),
      el('div', { className: 'bt-item-note' }, 'Notes')
    ]));

    cat.items.forEach(function (item) {
      if (item.computed) return;
      var data = state.items[catId][item.id];
      var fsHandled = isFsHandled(catId, item.id);
      var row = el('div', { className: 'bt-item-row' + (fsHandled ? ' bt-item-fs-handled' : '') });

      var labelDiv = el('div', { className: 'bt-item-label' }, item.label);
      if (fsHandled) {
        labelDiv.appendChild(el('div', { className: 'bt-fs-badge' }, 'Handled by fiscal sponsor'));
      } else if (item.unitHint) {
        labelDiv.appendChild(el('div', { className: 'bt-hint bt-unit-hint' }, item.unitHint));
      }
      row.appendChild(labelDiv);

      var freqText = item.unit ? item.unit + ' @ ' + fmt(item.unitCost) + '/hr' : (item.monthly ? '/month' : 'one-time');
      row.appendChild(el('div', { className: 'bt-item-freq' }, freqText));

      if (fsHandled) {
        row.appendChild(el('div', { className: 'bt-item-amount' }));
      } else {
        row.appendChild(el('div', { className: 'bt-item-amount' },
          el('input', {
            type: 'number', value: data.amount ? String(data.amount) : '',
            min: '0', step: item.unit ? '1' : (item.monthly ? '25' : '100'),
            placeholder: '0',
            className: 'bt-amount-input',
            onChange: function (e) { state.items[catId][item.id].amount = parseNum(e.target.value); render(); }
          })
        ));
      }
      row.appendChild(el('div', { className: 'bt-item-total' }, fmt(itemTotal(catId, item.id))));

      // Example column
      var exVal = item.typical[state.size] || 0;
      var exTotal = calcTemplateItemTotal(catId, item.id, state.size);
      var exText = exVal > 0 ? (item.unit ? exVal + ' hrs \u2192 ' + fmt(exTotal) : (item.monthly ? fmt(exVal) + '/mo \u2192 ' + fmt(exTotal) : fmt(exTotal))) : '\u2014';
      row.appendChild(el('div', { className: 'bt-item-example' }, exText));

      if (fsHandled) {
        row.appendChild(el('div', { className: 'bt-item-note' }));
      } else {
        row.appendChild(el('div', { className: 'bt-item-note' },
          el('input', {
            type: 'text', value: data.note || '', placeholder: 'Optional note',
            className: 'bt-note-input',
            onChange: function (e) { state.items[catId][item.id].note = e.target.value; }
          })
        ));
      }

      if (!fsHandled && item.warn && data.amount === 0) {
        row.appendChild(el('div', { className: 'bt-warning-inline' }, item.warn.msg));
      }
      table.appendChild(row);
    });

    // Subtotal with example
    var subtotal = calcCategoryTotal(catId);
    // FS fee shown separately in review — don't add to category subtotal here
    var exSubtotal = calcTemplateCategoryTotal(catId, state.size);
    table.appendChild(el('div', { className: 'bt-item-row bt-subtotal-row' }, [
      el('div', { className: 'bt-item-label' }, cat.label + ' subtotal'),
      el('div', { className: 'bt-item-freq' }),
      el('div', { className: 'bt-item-amount' }),
      el('div', { className: 'bt-item-total' }, fmt(subtotal)),
      el('div', { className: 'bt-item-example' }, fmt(exSubtotal)),
      el('div', { className: 'bt-item-note' })
    ]));

    wrap.appendChild(table);
    wrap.appendChild(navButtons());
    return wrap;
  }

  // --- Step: Buffers ---
  function renderBuffers() {
    var wrap = el('div', { className: 'bt-step' });
    wrap.appendChild(el('h2', null, 'Buffers & Contingency'));
    wrap.appendChild(el('p', null, 'Realistic budgets account for the unexpected. These questions check whether your timeline already does.'));

    var base = calcBaseTotals(state.durationMonths);
    var form = el('div', { className: 'bt-form' });

    // === Sickness buffer ===
    var sickGroup = el('div', { className: 'bt-buffer-group' });
    sickGroup.appendChild(el('h3', null, 'Sick leave & personal absences'));
    sickGroup.appendChild(el('p', null, 'Did you already account for sick leave and personal absences in your project timeline and staffing plan?'));

    var sickBtns = el('div', { className: 'bt-choice-btns' });
    sickBtns.appendChild(el('button', {
      className: 'btn ' + (state.sicknessConsidered === true ? 'btn-primary' : 'btn-secondary'),
      onClick: function () { state.sicknessConsidered = true; render(); }
    }, 'Yes, already accounted for'));
    sickBtns.appendChild(el('button', {
      className: 'btn ' + (state.sicknessConsidered === false ? 'btn-primary' : 'btn-secondary'),
      onClick: function () { state.sicknessConsidered = false; render(); }
    }, 'No / not sure'));
    sickGroup.appendChild(sickBtns);

    if (state.sicknessConsidered === false && !state.sicknessOverride) {
      var sickApplied = el('div', { className: 'bt-buffer-applied' });
      sickApplied.appendChild(el('p', null, 'We\'ll add a ' + BUFFER_MINS.sickness + '% buffer to your personnel costs (' + fmt(base.personnel.total) + '). This covers approximately 2-3 weeks of unplanned absence per person per year.'));
      sickApplied.appendChild(el('p', { className: 'bt-buffer-amount' }, 'Sickness buffer: ' + fmt(base.personnel.total * BUFFER_MINS.sickness / 100)));
      sickApplied.appendChild(el('button', { className: 'bt-override-btn', onClick: function () { state.sicknessOverride = true; render(); } },
        'I understand the risk \u2014 skip this buffer'));
      sickGroup.appendChild(sickApplied);
    } else if (state.sicknessConsidered === false && state.sicknessOverride) {
      sickGroup.appendChild(el('div', { className: 'bt-buffer-overridden' }, [
        el('p', null, 'Sickness buffer removed. Your budget does not account for sick leave.'),
        el('button', { className: 'bt-override-btn', onClick: function () { state.sicknessOverride = false; render(); } }, 'Re-apply buffer')
      ]));
    } else if (state.sicknessConsidered === true) {
      sickGroup.appendChild(el('p', { className: 'bt-hint' }, 'No additional buffer applied.'));
    }
    form.appendChild(sickGroup);

    // === Delay buffer ===
    var delayGroup = el('div', { className: 'bt-buffer-group' });
    delayGroup.appendChild(el('h3', null, 'Delays & overruns'));
    delayGroup.appendChild(el('p', null, 'What percentage of your budgeted time did you allow for delays, scope changes, and things taking longer than expected?'));

    delayGroup.appendChild(fieldNumber('Percentage already budgeted for', state.delayPctInput, 0, 50, function (v) {
      state.delayPctInput = v;
      state.delayApplied = Math.max(v, BUFFER_MINS.delay);
      render();
    }, 1));

    if (state.delayPctInput < BUFFER_MINS.delay && !state.delayOverride) {
      var delayApplied = el('div', { className: 'bt-buffer-applied' });
      delayApplied.appendChild(el('p', null, 'Most research projects experience at least 10-15% time overrun from scope changes, supplier delays, hiring timelines, and general Murphy\'s Law. A ' + state.delayPctInput + '% allowance is optimistic.'));
      delayApplied.appendChild(el('p', null, 'We\'ll use a minimum of ' + BUFFER_MINS.delay + '% for the budget calculation. You can increase this if your project has unusual risk factors.'));
      delayApplied.appendChild(el('button', { className: 'bt-override-btn', onClick: function () { state.delayOverride = true; render(); } },
        'I understand the risk \u2014 use my ' + state.delayPctInput + '% figure'));
      delayGroup.appendChild(delayApplied);
    } else if (state.delayPctInput < BUFFER_MINS.delay && state.delayOverride) {
      delayGroup.appendChild(el('div', { className: 'bt-buffer-overridden' }, [
        el('p', null, 'Using your ' + state.delayPctInput + '% delay allowance instead of the recommended ' + BUFFER_MINS.delay + '%.'),
        el('button', { className: 'bt-override-btn', onClick: function () { state.delayOverride = false; render(); } }, 'Re-apply recommended minimum')
      ]));
    }

    var effectiveDelay = state.delayOverride ? state.delayPctInput : Math.max(state.delayPctInput, BUFFER_MINS.delay);
    state.delayApplied = effectiveDelay;
    delayGroup.appendChild(el('p', { className: 'bt-buffer-amount' }, 'Effective delay allowance: ' + effectiveDelay + '%'));
    form.appendChild(delayGroup);

    // === Currency buffer ===
    var hasIntl = state.personnel.some(function (p) { return p.country !== 'us'; });
    if (hasIntl) {
      var currGroup = el('div', { className: 'bt-buffer-group' });
      currGroup.appendChild(el('h3', null, 'Currency risk'));
      currGroup.appendChild(el('p', null, 'You have staff outside the US. Exchange rates can shift 5-10% over a project\'s lifetime. Optional but recommended.'));
      currGroup.appendChild(fieldNumber('Currency risk buffer (%)', state.currencyBuffer, 0, 15, function (v) {
        state.currencyBuffer = v; render();
      }, 1));
      form.appendChild(currGroup);
    }

    // === Budget model comparison ===
    if (effectiveDelay > 0 || state.sicknessConsidered === false) {
      var modelGroup = el('div', { className: 'bt-buffer-group bt-model-choice' });
      modelGroup.appendChild(el('h3', null, 'How should we apply these buffers?'));

      var bufferOnlyDelay = base.subtotal * effectiveDelay / 100;
      var sickAmt = (state.sicknessConsidered === false) ? base.personnel.total * BUFFER_MINS.sickness / 100 : 0;
      var bufferOnlySubtotal = base.subtotal + bufferOnlyDelay + sickAmt;

      var extDuration = state.durationMonths * (1 + effectiveDelay / 100);
      var ext = calcBaseTotals(extDuration);
      var extSickAmt = (state.sicknessConsidered === false) ? ext.personnel.total * BUFFER_MINS.sickness / 100 : 0;
      var extSubtotal = ext.subtotal + extSickAmt;

      // Option A
      var optA = el('label', { className: 'bt-model-option' + (state.budgetModel === 'buffer_only' ? ' selected' : '') }, [
        el('input', { type: 'radio', name: 'model', value: 'buffer_only',
          checked: state.budgetModel === 'buffer_only' ? 'checked' : null,
          onChange: function () { state.budgetModel = 'buffer_only'; render(); }
        }),
        el('div', { className: 'bt-model-content' }, [
          el('strong', null, 'Option A: Add buffer amounts to budget'),
          el('p', null, 'Your base project costs (' + fmt(base.subtotal) + ') plus flat buffer amounts. FS fee added on top.'),
          el('p', { className: 'bt-model-total' }, fmt(bufferOnlySubtotal) + ' + FS fee')
        ])
      ]);
      modelGroup.appendChild(optA);

      // Option B
      var optB = el('label', { className: 'bt-model-option' + (state.budgetModel === 'extended_timeline' ? ' selected' : '') }, [
        el('input', { type: 'radio', name: 'model', value: 'extended_timeline',
          checked: state.budgetModel === 'extended_timeline' ? 'checked' : null,
          onChange: function () { state.budgetModel = 'extended_timeline'; render(); }
        }),
        el('div', { className: 'bt-model-content' }, [
          el('strong', null, 'Option B: Extend timeline, recalculate all recurring costs'),
          el('p', null, 'If the project runs ' + effectiveDelay + '% longer (' + Math.round(extDuration * 10) / 10 + ' months instead of ' + state.durationMonths + '), all monthly costs (salaries, office, subscriptions, etc.) also run longer. One-time costs stay the same.'),
          el('p', { className: 'bt-model-total' }, fmt(extSubtotal) + ' + FS fee'),
          el('p', { className: 'bt-hint' }, 'This is usually the more realistic model. The difference (' + fmt(extSubtotal - bufferOnlySubtotal) + ') represents the true cost of delays on recurring expenses.')
        ])
      ]);
      modelGroup.appendChild(optB);

      form.appendChild(modelGroup);
    }

    wrap.appendChild(form);
    wrap.appendChild(navButtons());
    return wrap;
  }

  // --- Step: Review ---
  function renderReview() {
    var wrap = el('div', { className: 'bt-step' });
    wrap.appendChild(el('h2', null, 'Review & Export'));

    var totals = calcGrandTotal();
    var warnings = getWarnings();

    if (state.fiscallySponsored) {
      wrap.appendChild(el('div', { className: 'bt-fee-note' }, [
        el('p', null, 'Fiscally sponsored: accounting, tax preparation, audit, banking, and mail are handled by your sponsor and excluded from this budget. Fiscal sponsor admin fee is included.')
      ]));
    }

    if (warnings.length > 0) {
      var warnPanel = el('div', { className: 'bt-warnings-panel' });
      warnPanel.appendChild(el('h3', null, 'Items to review (' + warnings.length + ')'));
      warnings.forEach(function (w) {
        warnPanel.appendChild(el('div', { className: 'bt-warning-item' }, [
          el('strong', null, w.label + ': '), w.msg
        ]));
      });
      wrap.appendChild(warnPanel);
    }

    // Model note
    if (totals.model === 'extended_timeline') {
      wrap.appendChild(el('div', { className: 'bt-fee-note' }, [
        el('p', null, 'Using extended timeline model: ' + Math.round(totals.extendedDuration * 10) / 10 + ' months (base ' + totals.baseDuration + ' + ' + (totals.delayPct * 100) + '% delay buffer). All recurring costs calculated at extended duration.')
      ]));
    }

    wrap.appendChild(el('h3', null, 'Budget summary'));
    wrap.appendChild(buildReviewTable(totals));

    // Export
    var exportPanel = el('div', { className: 'bt-export-panel' });
    exportPanel.appendChild(el('h3', null, 'Export'));
    exportPanel.appendChild(el('p', null, 'CSV includes live spreadsheet formulas. Subtotals, percentages, and the grand total auto-update when you change numbers after import.'));
    exportPanel.appendChild(el('div', { className: 'bt-export-btns' }, [
      el('button', { className: 'btn btn-primary', onClick: exportCSV }, 'Download CSV (with formulas)'),
      el('button', { className: 'btn btn-secondary', onClick: exportMarkdown }, 'Copy as Markdown')
    ]));
    wrap.appendChild(exportPanel);

    wrap.appendChild(navButtons());
    return wrap;
  }

  function buildReviewTable(totals) {
    var activeDuration = (totals.model === 'extended_timeline') ? totals.extendedDuration : totals.baseDuration;
    var gt = totals.grandTotal;
    var activeBase = (totals.model === 'extended_timeline') ? totals.extended : totals.base;

    var tbl = el('table', { className: 'bt-review-table' });
    var thead = el('thead');
    thead.appendChild(el('tr', null, [
      el('th', null, 'Category'), el('th', null, 'Item'),
      el('th', { className: 'num' }, 'Amount'), el('th', { className: 'num' }, '% of Total'), el('th', null, 'Notes')
    ]));
    tbl.appendChild(thead);

    var tbody = el('tbody');

    // Personnel
    tbody.appendChild(sectionHeader('PERSONNEL'));
    state.personnel.forEach(function (p) {
      var c = COUNTRIES[p.country] || COUNTRIES.other;
      var amt = personTotal(p, activeDuration);
      tbody.appendChild(itemRow('', p.role + ' (' + c.name + ', ' + (p.fte * 100) + '% FTE, ' + p.empType + ')', amt, gt,
        fmt(p.monthlySalary) + '/mo'));
    });
    var pers = calcPersonnelTotals(activeDuration);
    if (pers.taxes > 0) tbody.appendChild(itemRow('', 'Payroll taxes', pers.taxes, gt, 'Auto-calculated'));
    if (pers.eor > 0) tbody.appendChild(itemRow('', 'EOR / admin fees', pers.eor, gt, 'Auto-calculated'));
    tbody.appendChild(subtotalRow('Personnel subtotal', pers.total, gt));

    // Other categories
    CATEGORY_ORDER.forEach(function (catId) {
      var cat = CATEGORIES[catId];
      tbody.appendChild(sectionHeader(cat.label.toUpperCase()));

      var catTotal = 0;
      cat.items.forEach(function (item) {
        if (item.computed) return;
        var t = itemTotal(catId, item.id, activeDuration);
        if (t > 0) {
          catTotal += t;
          var note = state.items[catId][item.id].note || '';
          if (item.monthly) note = (note ? note + ' | ' : '') + fmt(state.items[catId][item.id].amount) + '/mo';
          tbody.appendChild(itemRow('', item.label, t, gt, note));
        }
      });
      if (catId !== 'overhead') catTotal = calcCategoryTotal(catId, activeDuration);
      tbody.appendChild(subtotalRow(cat.label + ' subtotal', catTotal, gt));
    });

    // Buffers
    if (totals.sicknessAmount > 0 || totals.currencyAmount > 0) {
      tbody.appendChild(sectionHeader('BUFFERS'));
      if (totals.sicknessAmount > 0) tbody.appendChild(itemRow('', 'Sickness & leave (' + BUFFER_MINS.sickness + '% of personnel)', totals.sicknessAmount, gt, ''));
      if (totals.currencyAmount > 0) tbody.appendChild(itemRow('', 'Currency risk (' + state.currencyBuffer + '%)', totals.currencyAmount, gt, ''));
      var bufTotal = totals.sicknessAmount + totals.currencyAmount;
      tbody.appendChild(subtotalRow('Buffers subtotal', bufTotal, gt));
    }

    if (totals.model === 'extended_timeline') {
      tbody.appendChild(sectionHeader('TIMELINE'));
      tbody.appendChild(itemRow('', 'Extended timeline', 0, gt, 'Base ' + totals.baseDuration + 'mo \u2192 ' + Math.round(totals.extendedDuration * 10) / 10 + 'mo (+' + (totals.delayPct * 100) + '%). Recurring costs already calculated at extended duration above.'));
    } else if (totals.delayPct > 0) {
      tbody.appendChild(sectionHeader('DELAY BUFFER'));
      tbody.appendChild(itemRow('', 'Delay & contingency (' + (totals.delayPct * 100) + '% of subtotal)', totals.bufferOnly.delay, gt, ''));
    }

    // FS fee — applied last on (base + buffers)
    if (totals.fsFee > 0) {
      tbody.appendChild(sectionHeader('FISCAL SPONSOR FEE'));
      tbody.appendChild(itemRow('', 'Admin fee (' + state.fsFeeFirstRate + '% first $500K, ' + state.fsFeeSecondRate + '% above)', totals.fsFee, gt, 'Charged on ' + fmt(totals.preFeeTotal) + ' (project costs + buffers)'));
    }

    // Grand total
    tbody.appendChild(el('tr', { className: 'bt-grand-total-row' }, [
      el('td', { colspan: '2' }, 'GRAND TOTAL'),
      el('td', { className: 'num' }, fmt(gt)),
      el('td', { className: 'num' }, '100%'),
      el('td')
    ]));

    tbl.appendChild(tbody);
    return tbl;
  }

  function sectionHeader(label) {
    return el('tr', { className: 'bt-section-header' }, [el('td', { colspan: '5' }, label)]);
  }

  function itemRow(cat, label, amount, grandTotal, note) {
    return el('tr', null, [
      el('td', null, cat), el('td', null, label),
      el('td', { className: 'num' }, fmt(amount)),
      el('td', { className: 'num' }, pct(amount, grandTotal)),
      el('td', null, note || '')
    ]);
  }

  function subtotalRow(label, amount, grandTotal) {
    return el('tr', { className: 'bt-subtotal' }, [
      el('td', { colspan: '2' }, label),
      el('td', { className: 'num' }, fmt(amount)),
      el('td', { className: 'num' }, pct(amount, grandTotal)),
      el('td')
    ]);
  }

  // --- Summary sidebar ---
  function renderSummary(totals) {
    var wrap = el('div', { className: 'bt-summary' });

    // Header row with column labels
    wrap.appendChild(el('div', { className: 'bt-summary-header' }, [
      el('span', null, ''),
      el('span', { className: 'num' }, 'Yours'),
      el('span', { className: 'num bt-ex' }, 'Example')
    ]));

    var activeBase = (totals.model === 'extended_timeline') ? totals.extended : totals.base;
    var tmpl = calcTemplateGrandTotal(state.size);

    var rows = [
      { label: 'Personnel', amount: activeBase.personnel.total, example: tmpl.personnel }
    ];
    CATEGORY_ORDER.forEach(function (catId) {
      rows.push({ label: CATEGORIES[catId].label, amount: activeBase.categories[catId], example: tmpl.categories[catId] });
    });

    var bufAmt = totals.sicknessAmount + totals.currencyAmount;
    if (totals.model === 'buffer_only') bufAmt += totals.bufferOnly.delay;
    if (bufAmt > 0) rows.push({ label: 'Buffers', amount: bufAmt, example: null });
    if (totals.fsFee > 0) rows.push({ label: 'FS Fee', amount: totals.fsFee, example: null });

    rows.forEach(function (r) {
      wrap.appendChild(el('div', { className: 'bt-summary-row' }, [
        el('span', null, r.label),
        el('span', { className: 'num' }, fmt(r.amount)),
        el('span', { className: 'num bt-ex' }, r.example != null ? fmt(r.example) : '')
      ]));
    });

    wrap.appendChild(el('div', { className: 'bt-summary-total' }, [
      el('span', null, 'Grand Total'),
      el('span', { className: 'num' }, fmt(totals.grandTotal)),
      el('span', { className: 'num bt-ex' }, fmt(tmpl.total))
    ]));

    var activeDuration = (totals.model === 'extended_timeline') ? totals.extendedDuration : totals.baseDuration;
    if (activeDuration > 0) {
      wrap.appendChild(el('div', { className: 'bt-summary-monthly' }, fmt(totals.grandTotal / activeDuration) + ' / month avg'));
    }

    if (totals.model === 'extended_timeline' && totals.extendedDuration !== totals.baseDuration) {
      wrap.appendChild(el('div', { className: 'bt-summary-monthly' },
        Math.round(totals.extendedDuration * 10) / 10 + ' months (incl. delay buffer)'));
    }

    return wrap;
  }

  // ============================================================
  // FORM HELPERS
  // ============================================================

  function field(label, type, value, onChange) {
    var g = el('div', { className: 'form-group' });
    g.appendChild(el('label', null, label));
    g.appendChild(el('input', { type: type, value: value || '', onChange: function (e) { onChange(e.target.value); } }));
    return g;
  }

  function fieldNumber(label, value, min, max, onChange, step) {
    var g = el('div', { className: 'form-group' });
    g.appendChild(el('label', null, label));
    g.appendChild(el('input', {
      type: 'number', value: String(value), min: String(min), max: String(max), step: String(step || 1),
      onChange: function (e) { onChange(parseNum(e.target.value)); }
    }));
    return g;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  function navButtons() {
    var wrap = el('div', { className: 'bt-nav-buttons' });
    if (state.step > 0)
      wrap.appendChild(el('button', { className: 'btn btn-secondary', onClick: prevStep }, 'Back'));
    if (state.step < STEPS.length - 1)
      wrap.appendChild(el('button', { className: 'btn btn-primary', onClick: nextStep }, 'Continue'));
    return wrap;
  }

  function nextStep() {
    if (state.step < STEPS.length - 1) { state.step++; render(); scrollToTop(); }
  }
  function prevStep() {
    if (state.step > 0) { state.step--; render(); scrollToTop(); }
  }
  function goToStep(i) { state.step = i; render(); scrollToTop(); }
  function scrollToTop() {
    var app = $('#budget-app');
    if (app) app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================================
  // CSV EXPORT WITH FORMULAS
  // ============================================================

  function exportCSV() {
    var totals = calcGrandTotal();
    var activeDuration = (totals.model === 'extended_timeline') ? totals.extendedDuration : totals.baseDuration;
    var rows = [];
    var rowNum = 0;
    var subtotalRows = {};
    var dataStartRows = {};
    var dataEndRows = {};

    function addRow(cells) { rowNum++; rows.push(cells); return rowNum; }

    addRow(['Project: ' + (state.projectName || 'Untitled'),
      'Duration: ' + Math.round(activeDuration * 10) / 10 + ' months',
      'Model: ' + (totals.model === 'extended_timeline' ? 'Extended timeline' : 'Buffer only'),
      'Generated: ' + new Date().toISOString().slice(0, 10), '']);
    addRow(['Category', 'Item', 'Amount', '% of Budget', 'Notes']);

    // Personnel
    addRow(['PERSONNEL', '', '', '', '']);
    dataStartRows.personnel = rowNum + 1;
    state.personnel.forEach(function (p) {
      var c = COUNTRIES[p.country] || COUNTRIES.other;
      addRow(['', p.role + ' (' + c.name + ', ' + p.empType + ')', Math.round(personTotal(p, activeDuration)), '__PCT__', fmt(p.monthlySalary) + '/mo, ' + (p.fte * 100) + '% FTE']);
    });
    var pers = calcPersonnelTotals(activeDuration);
    if (pers.taxes > 0) addRow(['', 'Payroll taxes', Math.round(pers.taxes), '__PCT__', 'Auto-calculated']);
    if (pers.eor > 0) addRow(['', 'EOR / admin fees', Math.round(pers.eor), '__PCT__', 'Auto-calculated']);
    dataEndRows.personnel = rowNum;
    subtotalRows.personnel = addRow(['', 'Personnel Subtotal', '=SUM(C' + dataStartRows.personnel + ':C' + dataEndRows.personnel + ')', '__PCT__', '']);
    addRow(['', '', '', '', '']);

    // Categories
    CATEGORY_ORDER.forEach(function (catId) {
      var cat = CATEGORIES[catId];
      addRow([cat.label.toUpperCase(), '', '', '', '']);
      dataStartRows[catId] = rowNum + 1;

      // FS fee shown as own section below

      cat.items.forEach(function (item) {
        if (item.computed) return;
        var t = itemTotal(catId, item.id, activeDuration);
        if (t > 0) {
          var note = state.items[catId][item.id].note || '';
          if (item.monthly) note = (note ? note + ' | ' : '') + fmt(state.items[catId][item.id].amount) + '/mo';
          addRow(['', item.label, Math.round(t), '__PCT__', note]);
        }
      });

      dataEndRows[catId] = rowNum;
      if (dataStartRows[catId] > dataEndRows[catId]) {
        addRow(['', '(no items)', 0, '', '']);
        dataEndRows[catId] = rowNum;
      }
      subtotalRows[catId] = addRow(['', cat.label + ' Subtotal', '=SUM(C' + dataStartRows[catId] + ':C' + dataEndRows[catId] + ')', '__PCT__', '']);
      addRow(['', '', '', '', '']);
    });

    // Buffers
    var hasBuffers = totals.sicknessAmount > 0 || totals.currencyAmount > 0 || (totals.model === 'buffer_only' && totals.bufferOnly.delay > 0);
    if (hasBuffers) {
      addRow(['BUFFERS', '', '', '', '']);
      dataStartRows.buffers = rowNum + 1;
      if (totals.sicknessAmount > 0) addRow(['', 'Sickness & leave', Math.round(totals.sicknessAmount), '__PCT__', BUFFER_MINS.sickness + '% of personnel']);
      if (totals.model === 'buffer_only' && totals.bufferOnly.delay > 0) addRow(['', 'Delay & contingency', Math.round(totals.bufferOnly.delay), '__PCT__', (totals.delayPct * 100) + '% of subtotal']);
      if (totals.currencyAmount > 0) addRow(['', 'Currency risk', Math.round(totals.currencyAmount), '__PCT__', state.currencyBuffer + '%']);
      dataEndRows.buffers = rowNum;
      subtotalRows.buffers = addRow(['', 'Buffers Subtotal', '=SUM(C' + dataStartRows.buffers + ':C' + dataEndRows.buffers + ')', '__PCT__', '']);
      addRow(['', '', '', '', '']);
    }

    // FS fee (applied last)
    if (totals.fsFee > 0) {
      addRow(['FISCAL SPONSOR FEE', '', '', '', '']);
      var fsFeeRow = addRow(['', 'Admin fee (' + state.fsFeeFirstRate + '%/' + state.fsFeeSecondRate + '%)', Math.round(totals.fsFee), '__PCT__', 'On project costs + buffers']);
      subtotalRows.fsfee = fsFeeRow;
      addRow(['', '', '', '', '']);
    }

    // Grand total
    var stRefs = ['personnel'].concat(CATEGORY_ORDER).concat(hasBuffers ? ['buffers'] : []).concat(subtotalRows.fsfee ? ['fsfee'] : [])
      .filter(function (k) { return subtotalRows[k]; })
      .map(function (k) { return 'C' + subtotalRows[k]; });
    var grandTotalRow = addRow(['GRAND TOTAL', '', '=' + stRefs.join('+'), '100%', '']);

    // Replace __PCT__ with formula
    var csvLines = rows.map(function (cells, idx) {
      return cells.map(function (cell) {
        if (cell === '__PCT__') return '=C' + (idx + 1) + '/C' + grandTotalRow;
        return cell;
      });
    });

    var csv = csvLines.map(function (cells) {
      return cells.map(function (cell) {
        var s = String(cell);
        if (s.charAt(0) === '=') return s;
        if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0)
          return '"' + s.replace(/"/g, '""') + '"';
        return s;
      }).join(',');
    }).join('\n');

    downloadFile(csv, (state.projectName || 'budget').replace(/[^a-zA-Z0-9]/g, '_') + '.csv', 'text/csv');
  }

  // ============================================================
  // MARKDOWN EXPORT
  // ============================================================

  function exportMarkdown() {
    var totals = calcGrandTotal();
    var activeDuration = (totals.model === 'extended_timeline') ? totals.extendedDuration : totals.baseDuration;
    var gt = totals.grandTotal;
    var lines = [];

    lines.push('# Project Budget: ' + (state.projectName || 'Untitled'));
    lines.push('');
    lines.push('Duration: ' + Math.round(activeDuration * 10) / 10 + ' months | Model: ' + (totals.model === 'extended_timeline' ? 'Extended timeline' : 'Buffer only') + ' | Generated: ' + new Date().toISOString().slice(0, 10));
    lines.push('');
    lines.push('| Category | Item | Amount | % of Total | Notes |');
    lines.push('|----------|------|-------:|----------:|-------|');

    // Personnel
    lines.push('| **PERSONNEL** | | | | |');
    state.personnel.forEach(function (p) {
      var c = COUNTRIES[p.country] || COUNTRIES.other;
      var amt = personTotal(p, activeDuration);
      lines.push('| | ' + p.role + ' (' + c.name + ', ' + p.empType + ') | ' + fmt(amt) + ' | ' + pct(amt, gt) + ' | ' + fmt(p.monthlySalary) + '/mo, ' + (p.fte * 100) + '% FTE |');
    });
    var pers = calcPersonnelTotals(activeDuration);
    if (pers.taxes > 0) lines.push('| | Payroll taxes | ' + fmt(pers.taxes) + ' | ' + pct(pers.taxes, gt) + ' | Auto-calculated |');
    if (pers.eor > 0) lines.push('| | EOR / admin fees | ' + fmt(pers.eor) + ' | ' + pct(pers.eor, gt) + ' | Auto-calculated |');
    lines.push('| | **Personnel Subtotal** | **' + fmt(pers.total) + '** | **' + pct(pers.total, gt) + '** | |');

    CATEGORY_ORDER.forEach(function (catId) {
      var cat = CATEGORIES[catId];
      lines.push('| **' + cat.label.toUpperCase() + '** | | | | |');
      var catTotal = 0;
      cat.items.forEach(function (item) {
        if (item.computed) return;
        var t = itemTotal(catId, item.id, activeDuration);
        if (t > 0) {
          catTotal += t;
          var note = state.items[catId][item.id].note || '';
          if (item.monthly) note = (note ? note + ' | ' : '') + fmt(state.items[catId][item.id].amount) + '/mo';
          lines.push('| | ' + item.label + ' | ' + fmt(t) + ' | ' + pct(t, gt) + ' | ' + note + ' |');
        }
      });
      if (catId !== 'overhead') catTotal = calcCategoryTotal(catId, activeDuration);
      lines.push('| | **' + cat.label + ' Subtotal** | **' + fmt(catTotal) + '** | **' + pct(catTotal, gt) + '** | |');
    });

    // Buffers
    var hasBuf = totals.sicknessAmount > 0 || totals.currencyAmount > 0 || (totals.model === 'buffer_only' && totals.bufferOnly.delay > 0);
    if (hasBuf) {
      lines.push('| **BUFFERS** | | | | |');
      if (totals.sicknessAmount > 0) lines.push('| | Sickness & leave | ' + fmt(totals.sicknessAmount) + ' | ' + pct(totals.sicknessAmount, gt) + ' | ' + BUFFER_MINS.sickness + '% of personnel |');
      if (totals.model === 'buffer_only' && totals.bufferOnly.delay > 0) lines.push('| | Delay & contingency | ' + fmt(totals.bufferOnly.delay) + ' | ' + pct(totals.bufferOnly.delay, gt) + ' | ' + (totals.delayPct * 100) + '% of subtotal |');
      if (totals.currencyAmount > 0) lines.push('| | Currency risk | ' + fmt(totals.currencyAmount) + ' | ' + pct(totals.currencyAmount, gt) + ' | ' + state.currencyBuffer + '% |');
    }

    if (totals.fsFee > 0) {
      lines.push('| **FISCAL SPONSOR FEE** | | | | |');
      lines.push('| | Admin fee (' + state.fsFeeFirstRate + '%/' + state.fsFeeSecondRate + '%) | ' + fmt(totals.fsFee) + ' | ' + pct(totals.fsFee, gt) + ' | On project costs + buffers |');
    }
    lines.push('| **GRAND TOTAL** | | **' + fmt(gt) + '** | **100%** | |');
    lines.push('');
    lines.push('Average monthly cost: ' + fmt(gt / activeDuration));

    var md = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(md).then(function () { alert('Markdown copied to clipboard.'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = md; ta.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:50%;z-index:10000';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); alert('Markdown copied to clipboard.');
    }
  }

  // ============================================================
  // FILE DOWNLOAD
  // ============================================================

  function downloadFile(content, filename, mime) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================================
  // TEMPLATE DETAILS PAGE
  // ============================================================

  var TEMPLATE_SIZES = [
    { key: 'small', label: 'Small', range: 'Under $100K',
      desc: 'A solo researcher or small team (1-2 people) working on a focused question for 6-12 months. Typical examples: an independent AI safety researcher writing a paper or sequence, a small policy analysis project, a workshop series, or an early-stage field-building initiative. Operational overhead is minimal \u2014 most of the budget goes to salary and direct costs. Often the researcher\'s first grant.',
      people: [{ role: 'Project Lead', sal: 5000, fte: 1.0, type: 'employee' }]
    },
    { key: 'medium', label: 'Medium', range: '$100K\u2013$500K',
      desc: 'A small research group or initiative with 2-5 people, typically 12-24 months. Examples: a technical AI safety research group, a governance policy research team, a biosecurity mapping project, or a field-building programme with events and publications. Enough budget for dedicated roles (PI, RAs) and some infrastructure (office, travel, compute).',
      people: [{ role: 'Project Lead / PI', sal: 8000, fte: 1.0, type: 'employee' }, { role: 'Research Associate', sal: 5500, fte: 1.0, type: 'employee' }]
    },
    { key: 'large', label: 'Large', range: '$500K+',
      desc: 'A full research lab, multi-site initiative, or major programme with 5+ people, often multi-year. Examples: an AI alignment research lab, a cross-cutting GCR research centre, a large-scale training or upskilling programme, or a multi-institution collaboration. Requires significant infrastructure: office space, compute resources, insurance, audit readiness, and dedicated admin/ops support.',
      people: [{ role: 'Project Lead / PI', sal: 10000, fte: 1.0, type: 'employee' }, { role: 'Senior Researcher', sal: 8000, fte: 1.0, type: 'employee' }, { role: 'Research Associate', sal: 5500, fte: 1.0, type: 'employee' }, { role: 'Operations / Admin', sal: 4500, fte: 0.5, type: 'contractor' }]
    }
  ];

  function renderTemplatePage() {
    var container = document.getElementById('budget-templates');
    if (!container) return false;

    var dur = 12;
    var activeIdx = 1; // Start on medium

    function renderTabs() {
      container.innerHTML = '';

      // Tab bar
      var tabs = el('div', { className: 'bt-tmpl-tabs' });
      TEMPLATE_SIZES.forEach(function (size, idx) {
        tabs.appendChild(el('button', {
          className: 'bt-tmpl-tab' + (idx === activeIdx ? ' active' : ''),
          onClick: function () { activeIdx = idx; renderTabs(); }
        }, size.label + ' (' + size.range + ')'));
      });
      container.appendChild(tabs);

      var active = TEMPLATE_SIZES[activeIdx];

      // Description
      var descDiv = el('div', { className: 'bt-tmpl-desc' });
      descDiv.appendChild(el('p', null, active.desc));
      container.appendChild(descDiv);

      // Side-by-side comparison table: all 3 sizes as columns
      var tbl = el('table', { className: 'bt-tmpl-table' });

      // Header
      var thead = el('thead');
      var hrow = el('tr', null, [el('th', null, 'Line Item')]);
      TEMPLATE_SIZES.forEach(function (s, i) {
        hrow.appendChild(el('th', { className: 'num bt-col-' + s.key + (i === activeIdx ? ' bt-col-active' : '') }, s.label));
      });
      thead.appendChild(hrow);
      tbl.appendChild(thead);

      var tbody = el('tbody');

      // Personnel section
      tbody.appendChild(el('tr', { className: 'bt-section-header' }, [el('td', { colspan: String(TEMPLATE_SIZES.length + 1) }, 'PERSONNEL')]));

      // Build personnel totals per size
      var persTotals = [];
      TEMPLATE_SIZES.forEach(function (size) {
        var total = 0;
        size.people.forEach(function (p) {
          var sal = p.sal * p.fte * dur;
          var oh = p.type === 'contractor' ? CONTRACTOR_ADMIN_MONTHLY * dur * p.fte : sal * 0.12 + 500 * dur * p.fte;
          total += sal + oh;
        });
        persTotals.push(total);
      });

      // Personnel detail rows for the active size
      active.people.forEach(function (p) {
        var sal = p.sal * p.fte * dur;
        var oh = p.type === 'contractor' ? CONTRACTOR_ADMIN_MONTHLY * dur * p.fte : sal * 0.12 + 500 * dur * p.fte;
        var row = el('tr', null, [el('td', null, p.role + ' (' + p.type + ', ' + (p.fte * 100) + '% FTE)')]);
        TEMPLATE_SIZES.forEach(function (s, i) {
          if (i === activeIdx) {
            row.appendChild(el('td', { className: 'num bt-col-' + s.key + ' bt-col-active' }, fmt(sal + oh)));
          } else {
            row.appendChild(el('td', { className: 'num bt-col-' + s.key }, ''));
          }
        });
        tbody.appendChild(row);
      });

      // Personnel subtotal row
      var persRow = el('tr', { className: 'bt-subtotal' }, [el('td', null, 'Personnel subtotal')]);
      TEMPLATE_SIZES.forEach(function (s, i) {
        persRow.appendChild(el('td', { className: 'num bt-col-' + s.key + (i === activeIdx ? ' bt-col-active' : '') }, fmt(persTotals[i])));
      });
      tbody.appendChild(persRow);

      // Category sections
      CATEGORY_ORDER.forEach(function (catId) {
        var cat = CATEGORIES[catId];
        tbody.appendChild(el('tr', { className: 'bt-section-header' }, [el('td', { colspan: String(TEMPLATE_SIZES.length + 1) }, cat.label.toUpperCase())]));

        cat.items.forEach(function (item) {
          if (item.computed) return;
          var hasAny = TEMPLATE_SIZES.some(function (s) { return (item.typical[s.key] || 0) > 0; });
          if (!hasAny) return; // skip universally-zero items in compact view

          var row = el('tr', null, [el('td', null, item.label)]);
          TEMPLATE_SIZES.forEach(function (s, i) {
            var val = item.typical[s.key] || 0;
            var total = calcTemplateItemTotal(catId, item.id, s.key, dur);
            var text = val > 0 ? (item.unit ? val + 'hrs' : (item.monthly ? fmt(val) + '/mo' : fmt(total))) : '\u2014';
            row.appendChild(el('td', { className: 'num bt-col-' + s.key + (i === activeIdx ? ' bt-col-active' : '') + (val === 0 ? ' bt-zero' : '') }, text));
          });
          tbody.appendChild(row);
        });

        // Category subtotals
        var subRow = el('tr', { className: 'bt-subtotal' }, [el('td', null, cat.label + ' subtotal')]);
        TEMPLATE_SIZES.forEach(function (s, i) {
          subRow.appendChild(el('td', { className: 'num bt-col-' + s.key + (i === activeIdx ? ' bt-col-active' : '') },
            fmt(calcTemplateCategoryTotal(catId, s.key, dur))));
        });
        tbody.appendChild(subRow);
      });

      // Grand totals
      var gtRow = el('tr', { className: 'bt-grand-total-row' }, [el('td', null, 'ESTIMATED 12mo TOTAL')]);
      TEMPLATE_SIZES.forEach(function (s, i) {
        var gt = persTotals[i];
        CATEGORY_ORDER.forEach(function (catId) { gt += calcTemplateCategoryTotal(catId, s.key, dur); });
        gtRow.appendChild(el('td', { className: 'num bt-col-' + s.key + (i === activeIdx ? ' bt-col-active' : '') }, fmt(gt)));
      });
      tbody.appendChild(gtRow);

      tbl.appendChild(tbody);
      container.appendChild(tbl);

      container.appendChild(el('p', { className: 'bt-hint' }, 'Totals are before buffers and fiscal sponsor fees. All figures generated from the same reference data as the Budget Builder.'));
    }

    renderTabs();
    return true;
  }

  // ============================================================
  // REFERENCE DATA PAGE
  // ============================================================

  function renderReferencePage() {
    var container = document.getElementById('budget-reference');
    if (!container) return false;

    // Country payroll overhead table
    container.appendChild(el('h2', null, 'Employer Payroll Overhead by Country'));
    container.appendChild(el('p', null, 'Estimated employer-side statutory costs. These are on top of gross salary. Actual rates vary by jurisdiction, salary level, and employer size.'));

    var ctbl = el('table');
    var cthead = el('thead');
    cthead.appendChild(el('tr', null, [
      el('th', null, 'Country'), el('th', { className: 'num' }, 'Payroll Tax %'),
      el('th', { className: 'num' }, 'EOR Fee/mo'), el('th', null, 'Notes')
    ]));
    ctbl.appendChild(cthead);
    var ctbody = el('tbody');
    Object.keys(COUNTRIES).forEach(function (code) {
      var c = COUNTRIES[code];
      ctbody.appendChild(el('tr', null, [
        el('td', null, c.name), el('td', { className: 'num' }, c.payrollTaxPct + '%'),
        el('td', { className: 'num' }, fmt(c.eorMonthly)), el('td', null, c.notes)
      ]));
    });
    ctbl.appendChild(ctbody);
    container.appendChild(ctbl);
    container.appendChild(el('p', { className: 'bt-hint' }, 'Contractor admin overhead: ' + fmt(CONTRACTOR_ADMIN_MONTHLY) + '/month per contractor (invoicing, compliance, payment processing).'));

    // Salary benchmarks table
    container.appendChild(el('h2', null, 'Salary Benchmarks (US-based, GCR/EA Sector)'));
    container.appendChild(el('p', null, 'Approximate annual compensation ranges based on Form 990 filings and 80,000 Hours job board data. Actual compensation varies by experience, location, organisation size, and funding.'));

    var stbl = el('table');
    var sthead = el('thead');
    sthead.appendChild(el('tr', null, [
      el('th', null, 'Role'), el('th', { className: 'num' }, 'Min'),
      el('th', { className: 'num' }, 'Median'), el('th', { className: 'num' }, 'Max'),
      el('th', { className: 'num' }, 'Monthly (median)')
    ]));
    stbl.appendChild(sthead);
    var stbody = el('tbody');
    Object.keys(ROLE_TYPES).forEach(function (key) {
      var r = ROLE_TYPES[key];
      if (!r.minAnnual) return;
      stbody.appendChild(el('tr', null, [
        el('td', null, r.label), el('td', { className: 'num' }, fmtK(r.minAnnual)),
        el('td', { className: 'num' }, fmtK(r.midAnnual)), el('td', { className: 'num' }, fmtK(r.maxAnnual)),
        el('td', { className: 'num' }, fmt(Math.round(r.midAnnual / 12)))
      ]));
    });
    stbl.appendChild(stbody);
    container.appendChild(stbl);

    // Beacon fee schedule
    container.appendChild(el('h2', null, 'Beacon Fiscal Sponsor Fee Schedule'));
    var ftbl = el('table');
    var fthead = el('thead');
    fthead.appendChild(el('tr', null, [el('th', null, 'Revenue Band'), el('th', { className: 'num' }, 'Rate')]));
    ftbl.appendChild(fthead);
    var ftbody = el('tbody');
    BEACON_FEE_TIERS.forEach(function (tier, i) {
      var prev = i > 0 ? BEACON_FEE_TIERS[i - 1].upTo : 0;
      var band = tier.upTo === Infinity ? 'Above ' + fmt(prev) : fmt(prev) + ' \u2013 ' + fmt(tier.upTo);
      if (prev === 0) band = 'First ' + fmt(tier.upTo);
      ftbody.appendChild(el('tr', null, [
        el('td', null, band), el('td', { className: 'num' }, (tier.rate * 100) + '%')
      ]));
    });
    ftbl.appendChild(ftbody);
    container.appendChild(ftbl);
    container.appendChild(el('p', { className: 'bt-hint' }, 'Charged on gross revenue at deposit, not on expenditures. The fee covers financial administration, compliance, reporting, and nonprofit infrastructure.'));

    // Standard cost categories
    container.appendChild(el('h2', null, 'Standard Cost Categories'));
    container.appendChild(el('p', null, 'Every line item tracked in the Budget Builder, with typical ranges for small, medium, and large projects over 12 months.'));

    CATEGORY_ORDER.forEach(function (catId) {
      var cat = CATEGORIES[catId];
      container.appendChild(el('h3', null, cat.label));

      var ltbl = el('table');
      var lthead = el('thead');
      lthead.appendChild(el('tr', null, [
        el('th', null, 'Item'), el('th', null, 'Type'),
        el('th', { className: 'num bt-col-small' }, 'Small'),
        el('th', { className: 'num bt-col-medium' }, 'Medium'),
        el('th', { className: 'num bt-col-large' }, 'Large')
      ]));
      ltbl.appendChild(lthead);
      var ltbody = el('tbody');

      cat.items.forEach(function (item) {
        if (item.computed) return;
        var row = el('tr', null, [
          el('td', null, item.label),
          el('td', null, item.unit ? item.unit + ' @ ' + fmt(item.unitCost) : (item.monthly ? '/month' : 'one-time'))
        ]);
        ['small', 'medium', 'large'].forEach(function (size) {
          var val = item.typical[size] || 0;
          var total = calcTemplateItemTotal(catId, item.id, size, 12);
          var text = val > 0 ? (item.unit ? val + ' hrs \u2192 ' + fmt(total) : (item.monthly ? fmt(val) + '/mo' : fmt(total))) : '\u2014';
          row.appendChild(el('td', { className: 'num bt-col-' + size + (val === 0 ? ' bt-zero' : '') }, text));
        });
        ltbody.appendChild(row);
      });
      ltbl.appendChild(ltbody);
      container.appendChild(ltbl);
    });

    return true;
  }

  // ============================================================
  // INIT
  // ============================================================

  document.addEventListener('DOMContentLoaded', function () {
    // Detect which page we're on and render accordingly
    if (renderTemplatePage()) return;
    if (renderReferencePage()) return;
    // Default: render the budget tool
    initState();
    applyTemplate();
    render();
  });
})();
