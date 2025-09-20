#!/usr/bin/env node
/**
 * Shine Design — Fix header injection + mobile nav wiring across pages
 * Usage:
 *   node fix-chrome-injection.js [--root ./] [--version 2025-09-19-06] [--dry-run]
 *
 * What it does:
 *  - Scans all *.html files under root (excluding /partials).
 *  - Ensures header/footer mount points exist with data-chrome-version.
 *  - Ensures bottom-of-body script order (site-chrome.js -> navigation.js -> action-buttons.js), once each, with ?v=version.
 *  - Removes legacy inline toggle scripts that wire .menu-btn before injection.
 *  - Normalizes header CSS <link> block in <head> with ?v=version.
 *  - Patches /header-styles.css: adds .mobile-submenu[hidden]{display:none!important} and fixes .cta:hover color var.
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const getFlag = (name, fallback = null) => {
  const i = args.findIndex(a => a === name || a.startsWith(name + '='));
  if (i === -1) return fallback;
  const a = args[i];
  if (a.includes('=')) return a.split('=').slice(1).join('=');
  const next = args[i + 1];
  return (next && !next.startsWith('--')) ? next : true;
};

const ROOT = path.resolve(getFlag('--root', '.'));
const VERSION = String(getFlag('--version', new Date().toISOString().slice(0,10).replace(/-/g,'')));
const DRY = !!getFlag('--dry-run', false);

const CSS_PUBLIC = '/header-styles.css';
const PARTIALS_DIR = '/partials';
const HEADER_PARTIAL = '/partials/header.html';
const FOOTER_PARTIAL = '/partials/footer.html';

const HEADER_MOUNT = (v) =>
  `<div id="site-header" data-chrome-path="${HEADER_PARTIAL}" data-chrome-version="${v}"></div>`;

const FOOTER_MOUNT = (v) =>
  `<div id="site-footer" data-chrome-path="${FOOTER_PARTIAL}" data-chrome-version="${v}"></div>`;

const BOTTOM_SCRIPTS = (v) => [
  `<script defer src="/site-chrome.js?v=${v}" data-chrome-version="${v}"></script>`,
  `<script defer src="/navigation.js?v=${v}"></script>`,
  `<script defer src="/action-buttons.js?v=${v}"></script>`
].join('\n');

const HEAD_CSS_BLOCK = (v) => [
  `<link rel="preload" href="${CSS_PUBLIC}?v=${v}" as="style">`,
  `<link rel="stylesheet" href="${CSS_PUBLIC}?v=${v}" media="print" onload="this.media='all'">`,
  `<noscript><link rel="stylesheet" href="${CSS_PUBLIC}?v=${v}"></noscript>`
].join('\n');

const isHtml = (p) => p.toLowerCase().endsWith('.html');
const insidePartials = (abs) => abs.replace(/\\/g,'/').includes('/partials/');

function readFile(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}
function writeFile(file, content) {
  if (DRY) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
function walk(dir, out = []) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p, out); }
    else out.push(p);
  }
  return out;
}

// Remove legacy inline toggle scripts (heuristic)
function stripLegacyInlineToggle(html) {
  const before = html;
  html = html.replace(
    /<!--\s*Single, conflict-free toggle script\s*-->[\s\S]*?<script[\s\S]*?<\/script>/gi,
    ''
  );
  // Also remove any inline script that wires .menu-btn before header exists
  html = html.replace(
    /<script>\s*\(function\(\)\s*{\s*const\s+btn\s*=\s*document\.querySelector\('\.menu-btn'\)[\s\S]*?}\)\(\);\s*<\/script>/gi,
    ''
  );
  return { changed: html !== before, html };
}

// Ensure header mount after <body> open
function ensureHeaderMount(html, version) {
  if (html.includes('id="site-header"')) {
    // Update version on existing
    html = html.replace(/(<div[^>]*id=["']site-header["'][^>]*data-chrome-version=["'])[^"']+(["'])/i,
                        `$1${version}$2`);
    return { changed: true, html };
  }
  // Insert after <body ...>
  const bodyOpen = html.match(/<body[^>]*>/i);
  if (!bodyOpen) return { changed: false, html };
  const insertAt = bodyOpen.index + bodyOpen[0].length;
  const newHtml = html.slice(0, insertAt) + '\n\n  ' + HEADER_MOUNT(version) + '\n' + html.slice(insertAt);
  return { changed: true, html: newHtml };
}

// Ensure footer mount before </body>
function ensureFooterMount(html, version) {
  if (html.includes('id="site-footer"')) {
    html = html.replace(/(<div[^>]*id=["']site-footer["'][^>]*data-chrome-version=["'])[^"']+(["'])/i,
                        `$1${version}$2`);
    return { changed: true, html };
  }
  const idx = html.lastIndexOf('</body>');
  if (idx === -1) return { changed: false, html };
  const newHtml = html.slice(0, idx) + '\n\n  ' + FOOTER_MOUNT(version) + '\n' + html.slice(idx);
  return { changed: true, html: newHtml };
}

// Ensure bottom script block (remove duplicates, keep once, correct order, versioned)
function ensureBottomScripts(html, version) {
  const before = html;

  // Remove any existing includes of these three scripts
  html = html
    .replace(/<script[^>]+src=["']\/site-chrome\.js[^>]*><\/script>\s*/gi, '')
    .replace(/<script[^>]+src=["']\/navigation\.js[^>]*><\/script>\s*/gi, '')
    .replace(/<script[^>]+src=["']\/action-buttons\.js[^>]*><\/script>\s*/gi, '');

  // Insert right before </body>
  const idx = html.lastIndexOf('</body>');
  if (idx === -1) return { changed: false, html };

  // If our exact block already exists, skip
  if (html.includes(`/site-chrome.js?v=${version}`) && html.includes(`/navigation.js?v=${version}`)) {
    return { changed: before !== html, html };
  }

  const newHtml = html.slice(0, idx) + '\n\n  ' + BOTTOM_SCRIPTS(version) + '\n' + html.slice(idx);
  return { changed: true, html: newHtml };
}

// Ensure head has the header CSS block (preload + stylesheet + noscript), versioned
function ensureHeadCssBlock(html, version) {
  const headIdx = html.indexOf('<head');
  if (headIdx === -1) return { changed: false, html };
  const headClose = html.indexOf('</head>');
  if (headClose === -1) return { changed: false, html };
  let head = html.slice(0, headClose);
  const rest = html.slice(headClose);

  // Remove older versions of header-styles.css links
  head = head
    .replace(/<link[^>]+href=["'][^"']*header-styles\.css[^"']*["'][^>]*>\s*/gi, '')
    .replace(/<noscript>\s*<link[^>]+href=["'][^"']*header-styles\.css[^"']*["'][^>]*>\s*<\/noscript>\s*/gi, '');

  // Insert our block near the end of head
  head = head + '\n\n  ' + HEAD_CSS_BLOCK(version) + '\n';

  return { changed: true, html: head + rest };
}

// Patch /header-styles.css content (if present) to add hidden rule + fix hover color var
function patchHeaderStylesCss(root) {
  const candidates = [
    path.join(root, 'header-styles.css'),
    path.join(root, 'assets', 'css', 'header-styles.css')
  ];
  let patched = false, filePath = null;

  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    let css = readFile(p);
    if (!css) continue;

    // Fix .cta:hover color: #var(--brand) -> var(--brand)
    const cssFixed = css.replace(/color:\s*#var\(--brand\)/g, 'color:var(--brand)');

    // Add .mobile-submenu[hidden] rule if missing
    let cssFixed2 = cssFixed;
    if (!/\.mobile-submenu\[hidden\]\s*\{/i.test(cssFixed)) {
      cssFixed2 += `

/* ensure submenu fully collapses when JS sets [hidden] */
.mobile-submenu[hidden]{display:none !important;}
`;
    }

    if (cssFixed2 !== css) {
      if (!DRY) writeFile(p, cssFixed2);
      patched = true;
      filePath = p;
    }
  }
  return { patched, filePath };
}

function processHtml(file) {
  let html = readFile(file);
  if (!html) return { file, skipped: true };

  let changedAny = false;

  // 1) strip legacy inline toggles
  let res = stripLegacyInlineToggle(html);
  html = res.html; changedAny = changedAny || res.changed;

  // 2) ensure header mount
  res = ensureHeaderMount(html, VERSION);
  html = res.html; changedAny = changedAny || res.changed;

  // 3) ensure footer mount
  res = ensureFooterMount(html, VERSION);
  html = res.html; changedAny = changedAny || res.changed;

  // 4) ensure head css block
  res = ensureHeadCssBlock(html, VERSION);
  html = res.html; changedAny = changedAny || res.changed;

  // 5) ensure bottom scripts
  res = ensureBottomScripts(html, VERSION);
  html = res.html; changedAny = changedAny || res.changed;

  if (changedAny && !DRY) writeFile(file, html);
  return { file, changed: changedAny, skipped: false };
}

// MAIN
(function main(){
  console.log(`▶ Fixing pages in ${ROOT}`);
  console.log(`   Version: ${VERSION}  Dry-run: ${DRY ? 'yes' : 'no'}`);

  const allFiles = walk(ROOT);
  const htmlFiles = allFiles.filter(f => isHtml(f) && !insidePartials(f));

  let changed = 0, skipped = 0;
  htmlFiles.forEach(f => {
    const res = processHtml(f);
    if (res.skipped) skipped++;
    else if (res.changed) changed++;
  });

  const cssRes = patchHeaderStylesCss(ROOT);

  console.log(`\nSummary:`);
  console.log(`  HTML files scanned: ${htmlFiles.length}`);
  console.log(`  HTML files changed: ${changed}`);
  console.log(`  HTML files skipped: ${skipped}`);
  if (cssRes.patched) {
    console.log(`  CSS patched: ${path.relative(ROOT, cssRes.filePath)}`);
  } else {
    console.log(`  CSS patched: none (either already correct or file not found)`);
  }

  console.log(`\nDone. ${DRY ? '(no files were written because --dry-run was used)' : ''}`);
})();
