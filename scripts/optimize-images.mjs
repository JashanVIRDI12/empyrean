#!/usr/bin/env node
/**
 * Convert PNG assets to WebP for Empyrean Spirits.
 * Requires: cwebp (brew install webp)
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = join(root, 'images');

const BOTTLE_PATTERNS = /nobg\.png$/i;
const CRAFT_PATTERN = /^craft\//;

function walk(dir, base = '') {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const rel = base ? `${base}/${name}` : name;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full, rel));
    } else if (/\.png$/i.test(name)) {
      entries.push({ rel, full });
    }
  }
  return entries;
}

function qualityFor(rel) {
  if (BOTTLE_PATTERNS.test(rel)) return 90;
  if (CRAFT_PATTERN.test(rel)) return 82;
  return 82;
}

const pngs = walk(imagesDir);
let converted = 0;

for (const { rel, full } of pngs) {
  const out = full.replace(/\.png$/i, '.webp');
  const q = qualityFor(rel);
  execFileSync('cwebp', ['-q', String(q), '-m', '6', full, '-o', out], { stdio: 'pipe' });
  converted++;
  console.log(`✓ ${rel} → ${rel.replace(/\.png$/i, '.webp')} (q${q})`);
}

console.log(`\nConverted ${converted} PNG(s) to WebP.`);
