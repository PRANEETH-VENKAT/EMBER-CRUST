#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT_DIR, 'portfolio', 'portfolio.json');
const MD_PATH = path.join(ROOT_DIR, 'portfolio', 'PORTFOLIO.md');

try {
  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  const data = JSON.parse(raw);

  let markdown = `# ${data.title || 'VIP Table · Premier View'}\n\n`;
  if (data.subtitle) {
    markdown += `> ${data.subtitle}\n\n`;
  }

  if (Array.isArray(data.stats) && data.stats.length > 0) {
    markdown += `### Key Highlights\n\n`;
    data.stats.forEach((stat) => {
      markdown += `- **${stat.value}${stat.suffix || ''}** ${stat.label}\n`;
    });
    markdown += `\n`;
  }

  markdown += `*Auto-generated from [portfolio.json](./portfolio.json). Do not edit directly; run \`npm run portfolio:md\` after updating the JSON source.*\n\n---\n\n`;

  if (Array.isArray(data.sections)) {
    data.sections.forEach((section, index) => {
      const number = String(index + 1).padStart(2, '0');
      markdown += `## ${number}. ${section.title}\n\n`;
      markdown += `${section.content.trim()}\n\n---\n\n`;
    });
  }

  fs.writeFileSync(MD_PATH, markdown.trim() + '\n', 'utf-8');
  console.log(`Successfully generated ${MD_PATH} from ${JSON_PATH}`);
} catch (error) {
  console.error('Failed to generate PORTFOLIO.md:', error);
  process.exit(1);
}
