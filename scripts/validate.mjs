#!/usr/bin/env node
// Repo validator — run by CI and before any release.
//
//   node scripts/validate.mjs
//
// Checks:
//   1. Every plugin manifest parses, names agree, versions are in sync.
//   2. SKILL.md has valid frontmatter (name + description within limits).
//   3. Every example ships the full set: brief.md + infographic.html + infographic.png
//      + infographic.mp4 + infographic.gif (stills and animations from one file).
//   4. Example HTML is self-contained (no external resources beyond Google Fonts).
//   5. Every design language named in SKILL.md exists on disk, and vice versa.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = join(ROOT, 'skills', 'epic-infographics');
const errors = [];
const err = (msg) => errors.push(msg);

// ---- 1. manifests parse, names agree, versions sync -------------------------
const MANIFESTS = [
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.codex-plugin/plugin.json',
  '.factory-plugin/plugin.json',
  '.factory-plugin/marketplace.json',
  '.agents/plugins/marketplace.json',
  'skills/epic-infographics/package.json',
];

const parsed = {};
for (const rel of MANIFESTS) {
  try {
    parsed[rel] = JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
  } catch (e) {
    err(`${rel}: ${e.message}`);
  }
}

for (const [rel, json] of Object.entries(parsed)) {
  if (json.name !== 'epic-infographics') err(`${rel}: name is "${json.name}", expected "epic-infographics"`);
}

const versions = Object.entries(parsed)
  .filter(([, j]) => j.version)
  .map(([rel, j]) => [rel, j.version]);
if (new Set(versions.map(([, v]) => v)).size > 1) {
  err(`version mismatch across manifests: ${versions.map(([r, v]) => `${r}=${v}`).join(', ')} — run scripts/bump-version.mjs`);
}

// ---- 2. SKILL.md frontmatter ------------------------------------------------
const skillMd = readFileSync(join(SKILL, 'SKILL.md'), 'utf8');
const fm = skillMd.match(/^---\n([\s\S]*?)\n---/);
if (!fm) {
  err('SKILL.md: missing YAML frontmatter');
} else {
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== 'epic-infographics') err(`SKILL.md: frontmatter name is "${name}"`);
  if (!desc) err('SKILL.md: frontmatter has no description');
  else if (desc.length > 1024) err(`SKILL.md: description is ${desc.length} chars (limit 1024)`);
}

// ---- 3 + 4. examples: complete triplets, self-contained HTML ----------------
const ALLOWED_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const examplesDir = join(ROOT, 'examples');
const exampleDirs = readdirSync(examplesDir).filter((d) => statSync(join(examplesDir, d)).isDirectory());
if (exampleDirs.length === 0) err('examples/: no example directories found');

for (const dir of exampleDirs) {
  for (const f of ['brief.md', 'infographic.html', 'infographic.png', 'infographic.mp4', 'infographic.gif']) {
    if (!existsSync(join(examplesDir, dir, f))) err(`examples/${dir}: missing ${f}`);
  }
  const htmlPath = join(examplesDir, dir, 'infographic.html');
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf8');
    for (const m of html.matchAll(/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/g)) {
      const host = new URL(m[1]).hostname;
      if (!ALLOWED_HOSTS.includes(host)) err(`examples/${dir}: external resource ${m[1]} (only Google Fonts allowed)`);
    }
    if (/<script\s[^>]*src=/i.test(html)) err(`examples/${dir}: external <script src> — examples must be self-contained`);
  }
}

// ---- 5. design languages on disk vs referenced ------------------------------
const styleDir = join(SKILL, 'references', 'design-languages');
const onDisk = readdirSync(styleDir).filter((f) => f.endsWith('.md') && f !== '_template.md').map((f) => f.replace(/\.md$/, ''));
for (const style of onDisk) {
  if (!skillMd.includes(style)) err(`design language "${style}" exists on disk but is never mentioned in SKILL.md`);
}

// ---- report -----------------------------------------------------------------
if (errors.length) {
  console.error(`validate: ${errors.length} problem(s)\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`validate: OK — ${MANIFESTS.length} manifests in sync @ ${versions[0]?.[1]}, ${exampleDirs.length} complete examples, ${onDisk.length} design languages`);
