#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_LINKS = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap">
`;

const FOOTER_SCRIPTS = `  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/ScrollTrigger.min.js"></script>
  <script defer src="script.js?v=24"></script>`;

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

  html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=24');

  writeFileSync(join(root, file), html);
  console.log('patched', file);
}
