#!/usr/bin/env node
/**
 * Everything Antigravity - Skill Validator (Node.js)
 * Validates that all SKILL.md files comply with the Antigravity Progressive Disclosure standard:
 * 1. Valid YAML frontmatter containing 'name' and 'description'
 * 2. Non-empty description with trigger keywords
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');

if (!fs.existsSync(skillsDir)) {
  console.error(`Error: ${skillsDir} not found.`);
  process.exit(1);
}

const folders = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log(`🔍 Validating ${folders.length} skills in Everything Antigravity...\n`);

let passed = 0;
let warnings = 0;
const errors = [];

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: content };

  const raw = match[1];
  const body = match[2];
  const fm = {};
  let currentKey = null;

  raw.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    if (line.includes(':')) {
      const idx = line.indexOf(':');
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      fm[key] = val;
      currentKey = key;
    } else if (currentKey && line) {
      fm[currentKey] += ' ' + line.replace(/^['"]|['"]$/g, '');
    }
  });

  return { frontmatter: fm, body };
}

folders.forEach(folder => {
  const skillFile = path.join(skillsDir, folder, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    errors.push(`❌ ${folder}: Missing SKILL.md`);
    return;
  }

  let content;
  try {
    content = fs.readFileSync(skillFile, 'utf8');
  } catch (err) {
    errors.push(`❌ ${folder}: Could not read file: ${err.message}`);
    return;
  }

  const { frontmatter } = parseFrontmatter(content);
  if (!frontmatter) {
    errors.push(`❌ ${folder}: Missing YAML frontmatter delimiters (---)`);
    return;
  }

  const name = frontmatter.name;
  const desc = frontmatter.description;

  if (!name) {
    errors.push(`❌ ${folder}: Missing 'name' in frontmatter`);
    return;
  }

  if (!desc) {
    errors.push(`❌ ${folder}: Missing 'description' in frontmatter`);
    return;
  }

  if (desc.length < 20) {
    warnings++;
    console.log(`⚠️  ${folder}: Description is very short (${desc.length} chars).`);
  }

  passed++;
});

console.log('\n' + '='.repeat(50));
console.log('Validation Summary:');
console.log(`  Total Skills Checked : ${folders.length}`);
console.log(`  Valid Skills         : ${passed}`);
console.log(`  Warnings             : ${warnings}`);
console.log(`  Errors               : ${errors.length}`);
console.log('='.repeat(50));

if (errors.length > 0) {
  console.log('\nErrors Found:');
  errors.slice(0, 20).forEach(e => console.log(e));
  if (errors.length > 20) {
    console.log(`... and ${errors.length - 20} more errors.`);
  }
  process.exit(1);
} else {
  console.log('\n✅ All skills passed validation successfully!');
  process.exit(0);
}
