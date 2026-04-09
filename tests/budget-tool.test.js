// budget-tool.test.js — Unit tests for budget tool calculations
// Run: node tests/budget-tool.test.js
// No dependencies — uses Node's built-in assert.

'use strict';

var assert = require('assert');
var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  PASS: ' + name);
  } catch (e) {
    failed++;
    console.log('  FAIL: ' + name);
    console.log('        ' + e.message);
  }
}

// ============================================================
// Extract testable functions from budget-tool.js
// The IIFE doesn't export, so we eval the data/calc sections
// into a test context with a mock state and DOM.
// ============================================================

// Mock DOM for DOMContentLoaded (budget-tool.js adds a listener)
var mockDocument = {
  addEventListener: function () {},
  getElementById: function () { return null; },
  querySelector: function () { return null; },
  createElement: function () {
    return {
      className: '', setAttribute: function () {}, addEventListener: function () {},
      appendChild: function () {}, style: {}, textContent: '', innerHTML: ''
    };
  }
};

// Read budget-tool.js source and extract the innards of the IIFE
var fs = require('fs');
var path = require('path');
var src = fs.readFileSync(path.join(__dirname, '..', 'budget-tool.js'), 'utf8');

// Strip the IIFE wrapper: remove first line "(function () {" and last line "})();"
// Also strip 'use strict' and the DOMContentLoaded listener block at the end
var lines = src.split('\n');
// Find the IIFE open and close
var startIdx = lines.findIndex(function (l) { return l.match(/^\(function/); });
var endIdx = lines.length - 1;
while (endIdx > 0 && !lines[endIdx].match(/\}\)\(\)/)) endIdx--;
var inner = lines.slice(startIdx + 1, endIdx).join('\n')
  .replace(/'use strict';/, '')
  // Remove the DOMContentLoaded block that tries to call render/init
  .replace(/document\.addEventListener\('DOMContentLoaded'[\s\S]*$/, '');

// Provide globals the code expects
global.window = { location: { pathname: '/' } };
global.document = mockDocument;
Object.defineProperty(global, 'navigator', { value: { clipboard: null }, writable: true, configurable: true });
global.URL = { createObjectURL: function () { return ''; }, revokeObjectURL: function () {} };
global.Blob = function () {};
global.alert = function () {};

// Eval in global scope so var declarations become accessible
var vm = require('vm');
vm.runInThisContext(inner, { filename: 'budget-tool.js' });

// ============================================================
// TESTS
// ============================================================

console.log('\nBudget Tool Unit Tests\n');

// --- Fee calculation ---

console.log('Fee calculation:');

test('calcFsFee returns 0 when not fiscally sponsored', function () {
  state.fiscallySponsored = false;
  assert.strictEqual(calcFsFee(100000), 0);
  state.fiscallySponsored = true;
});

test('calcFsFee applies 10% on first $500K', function () {
  state.fsFeeFirstRate = 10;
  state.fsFeeSecondRate = 5;
  assert.strictEqual(calcFsFee(100000), 10000);
  assert.strictEqual(calcFsFee(500000), 50000);
});

test('calcFsFee applies tiered rates above $500K', function () {
  state.fsFeeFirstRate = 10;
  state.fsFeeSecondRate = 5;
  // $500K at 10% = $50K, $500K at 5% = $25K = $75K total
  assert.strictEqual(calcFsFee(1000000), 75000);
});

test('calcFsFee uses variable rates from state', function () {
  state.fsFeeFirstRate = 8;
  state.fsFeeSecondRate = 3;
  // $500K at 8% = $40K
  assert.strictEqual(calcFsFee(500000), 40000);
  // $1M: $40K + $500K at 3% = $15K = $55K
  assert.strictEqual(calcFsFee(1000000), 55000);
  state.fsFeeFirstRate = 10;
  state.fsFeeSecondRate = 5;
});

// --- Person overhead ---

console.log('\nPerson overhead:');

test('employee overhead includes payroll tax + EOR', function () {
  var p = { role: 'Test', roleType: 'other', empType: 'employee', country: 'us', monthlySalary: 10000, fte: 1.0 };
  state.durationMonths = 12;
  var oh = personOverhead(p, 12);
  // US: 12% payroll tax on $120K salary = $14,400
  assert.strictEqual(oh.tax, 14400);
  // US EOR: $500/mo * 12 = $6000
  assert.strictEqual(oh.eor, 6000);
  assert.strictEqual(oh.total, 20400);
});

test('contractor overhead uses flat admin rate', function () {
  var p = { role: 'Test', roleType: 'other', empType: 'contractor', country: 'us', monthlySalary: 10000, fte: 1.0 };
  var oh = personOverhead(p, 12);
  assert.strictEqual(oh.tax, 0);
  // $40/mo * 12 = $480
  assert.strictEqual(oh.eor, 480);
  assert.strictEqual(oh.total, 480);
});

test('FTE scales salary and overhead', function () {
  var p = { role: 'Test', roleType: 'other', empType: 'employee', country: 'us', monthlySalary: 10000, fte: 0.5 };
  var salary = personTotal(p, 12);
  assert.strictEqual(salary, 60000);
  var oh = personOverhead(p, 12);
  assert.strictEqual(oh.tax, 7200); // 12% of $60K
  assert.strictEqual(oh.eor, 3000); // $500 * 12 * 0.5
});

// --- Item totals ---

console.log('\nItem totals:');

test('monthly items multiply by duration', function () {
  state.items.operations = state.items.operations || {};
  state.items.operations.office = { amount: 400, note: '' };
  var total = itemTotal('operations', 'office', 12);
  assert.strictEqual(total, 4800);
});

test('one-time items return flat amount', function () {
  state.items.operations.hardware = { amount: 2000, note: '' };
  var total = itemTotal('operations', 'hardware', 12);
  assert.strictEqual(total, 2000);
});

test('unit-based items multiply amount by unit cost', function () {
  state.items.professional = state.items.professional || {};
  state.items.professional.legal_hours = { amount: 4, note: '' };
  var total = itemTotal('professional', 'legal_hours', 12);
  // 4 hours * $350/hr = $1400
  assert.strictEqual(total, 1400);
});

// --- FS-handled items ---

console.log('\nFS-handled items:');

test('isFsHandled returns true for sponsor-handled items when FS on', function () {
  state.fiscallySponsored = true;
  assert.strictEqual(isFsHandled('professional', 'accounting'), true);
  assert.strictEqual(isFsHandled('professional', 'tax_prep'), true);
  assert.strictEqual(isFsHandled('overhead', 'banking'), true);
});

test('isFsHandled returns false when FS off', function () {
  state.fiscallySponsored = false;
  assert.strictEqual(isFsHandled('professional', 'accounting'), false);
  state.fiscallySponsored = true;
});

test('isFsHandled returns falsy for non-handled items', function () {
  assert.ok(!isFsHandled('professional', 'legal_hours'));
  assert.ok(!isFsHandled('operations', 'office'));
});

// --- Grand total calculation order ---

console.log('\nGrand total (fee-last ordering):');

test('FS fee is calculated on base + buffers, not base alone', function () {
  // Initialize all item state from categories
  initState();
  state.fiscallySponsored = true;
  state.fsFeeFirstRate = 10;
  state.fsFeeSecondRate = 5;
  state.durationMonths = 12;
  state.sicknessConsidered = true;  // no sickness buffer
  state.delayPctInput = 0;
  state.delayApplied = 5;           // 5% minimum
  state.delayOverride = false;
  state.currencyBuffer = 0;
  state.budgetModel = 'buffer_only';
  state.personnel = [
    { role: 'Lead', roleType: 'other', empType: 'employee', country: 'us', monthlySalary: 10000, fte: 1.0 }
  ];
  // Zero out all category items to isolate personnel
  Object.keys(CATEGORIES).forEach(function (catId) {
    CATEGORIES[catId].items.forEach(function (item) {
      if (state.items[catId] && state.items[catId][item.id]) {
        state.items[catId][item.id].amount = 0;
      }
    });
  });

  var totals = calcGrandTotal();

  // Personnel: $120K salary + $14.4K tax + $6K EOR = $140,400
  var expectedBase = 140400;
  assert.strictEqual(Math.round(totals.base.subtotal), expectedBase);

  // 5% delay buffer on base: $7,020
  var expectedDelay = expectedBase * 0.05;
  assert.strictEqual(Math.round(totals.bufferOnly.delay), Math.round(expectedDelay));

  // Pre-fee total: $140,400 + $7,020 = $147,420
  var expectedPreFee = expectedBase + expectedDelay;
  assert.strictEqual(Math.round(totals.preFeeTotal), Math.round(expectedPreFee));

  // Fee on $147,420 at 10% = $14,742
  var expectedFee = expectedPreFee * 0.10;
  assert.strictEqual(Math.round(totals.fsFee), Math.round(expectedFee));

  // Grand total = pre-fee + fee
  assert.strictEqual(Math.round(totals.grandTotal), Math.round(expectedPreFee + expectedFee));
});

test('sickness buffer applies to personnel only', function () {
  initState();
  state.personnel = [
    { role: 'Lead', roleType: 'other', empType: 'employee', country: 'us', monthlySalary: 10000, fte: 1.0 }
  ];
  state.sicknessConsidered = false;
  state.sicknessOverride = false;
  state.delayPctInput = 0;
  state.delayOverride = true; // override to 0% delay to isolate sickness

  var totals = calcGrandTotal();

  // 5% of personnel total ($140,400) = $7,020
  var expectedSickness = totals.base.personnel.total * 0.05;
  assert.strictEqual(Math.round(totals.sicknessAmount), Math.round(expectedSickness));

  // Reset
  state.sicknessConsidered = true;
  state.delayOverride = false;
});

// --- Summary ---

console.log('\n' + (passed + failed) + ' tests: ' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed > 0 ? 1 : 0);
