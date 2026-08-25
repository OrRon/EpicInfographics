#!/usr/bin/env node
// Bump the plugin version in every manifest at once, keeping them in sync.
//
//   node scripts/bump-version.mjs 0.2.0

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) {
  console.error('usage: node scripts/bump-version.mjs <major.minor.patch>');
  process.exit(1);
}

const FILES = [
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  '.factory-plugin/plugin.json',
  'skills/epic-infographics/package.json',
];

for (const rel of FILES) {
  const path = join(ROOT, rel);
  const json = JSON.parse(readFileSync(path, 'utf8'));
  json.version = version;
  writeFileSync(path, JSON.stringify(json, null, 2) + '\n');
  console.log(`${rel} -> ${version}`);
}
