#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_LINKS = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap">
`;

const FOOTER_SCRIPTS = `  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/ScrollTrigger.min.js"></script>
  <script defer src="script.js?v=21"></script>`;

for (const file of readdirSync(root).filter((f) => f.endsWith('.html'))) {
  let html = readFileSync(join(root, file), 'utf8');

  html = html.replace(/\n  <script src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap[^"]*"><\/script>\n  <script src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap[^"]*ScrollTrigger[^"]*"><\/script>/g, '');

  html = html.replace(/\n    <script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap[^"]*"><\/script>\n  <script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap[^"]*ScrollTrigger[^"]*"><\/script>\n  <script defer src="script\.js\?v=\d+"><\/script>/g, '\n' + FOOTER_SCRIPTS);

  html = html.replace(/<script src="script\.js\?v=\d+"><\/script>/g, FOOTER_SCRIPTS.trim());

  if (!html.includes('fonts.googleapis.com')) {
    html = html.replace(
      /(<meta name="twitter:card"[^>]*>)\n/,
      `$1\n${FONT_LINKS}`
    );
  }

  html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=21');

  writeFileSync(join(root, file), html);
  console.log('patched', file);
}
