// check-links.js — Verify internal links in HTML files resolve to real files
// Run: node tests/check-links.js
// Exits 1 if any broken links found.

'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var errors = [];

// Find all HTML files
function findHtml(dir) {
  var results = [];
  fs.readdirSync(dir).forEach(function (f) {
    var full = path.join(dir, f);
    if (f.startsWith('.') || f === 'node_modules' || f === '_deploy' || f === 'dump' || f === 'docs') return;
    var stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(findHtml(full));
    else if (f.endsWith('.html')) results.push(full);
  });
  return results;
}

var htmlFiles = findHtml(root);
var linkRe = /href="(\/[^"#?]+)"/g;

htmlFiles.forEach(function (file) {
  var content = fs.readFileSync(file, 'utf8');
  var match;
  while ((match = linkRe.exec(content)) !== null) {
    var href = match[1];
    // Check if target exists as file or file.html or directory with index.html
    var target = path.join(root, href);
    var exists = fs.existsSync(target) ||
                 fs.existsSync(target + '.html') ||
                 fs.existsSync(path.join(target, 'index.html'));
    if (!exists) {
      var rel = path.relative(root, file).replace(/\\/g, '/');
      errors.push(rel + ': broken link to ' + href);
    }
    // Warn about clean URLs (no extension) since .htaccess rewrites are unreliable
    if (!href.match(/\.\w+$/) && !href.endsWith('/')) {
      var rel2 = path.relative(root, file).replace(/\\/g, '/');
      errors.push(rel2 + ': clean URL without extension: ' + href + ' (add .html — server rewrites are broken)');
    }
  }
});

if (errors.length > 0) {
  console.log('Broken internal links found:\n');
  errors.forEach(function (e) { console.log('  ' + e); });
  console.log('\n' + errors.length + ' broken link(s)');
  process.exit(1);
} else {
  console.log('All internal links OK (' + htmlFiles.length + ' files checked)');
}
