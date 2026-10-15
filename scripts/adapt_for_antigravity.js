#!/usr/bin/env node
/**
 * Everything Antigravity - Adaptation Engine
 * Authored by Sanish Gyawali
 * 
 * Performs automated transformations across skills and agent personas:
 * 1. Maps Claude model tiers (sonnet -> pro, haiku -> flash, opus -> pro)
 * 2. Translates Claude CLI tools (Bash, Glob, Grep, Read, FileEdit) to Antigravity tools
 * 3. Injects Antigravity artifact and Mermaid diagram guidelines into planning/review agents
 * 4. Generates an Antigravity Subagent Registry (agents/registry.json)
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const agentsDir = path.join(repoRoot, 'agents');
const skillsDir = path.join(repoRoot, 'skills');

const stats = {
  agentsAdapted: 0,
  skillsAdapted: 0,
  modelReplacements: 0,
  toolReplacements: 0,
};

// 1. Process Agents
console.log('🔄 Adapting Agent specifications for Antigravity...');

const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
const agentRegistry = [];

agentFiles.forEach(file => {
  const filePath = path.join(agentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Extract frontmatter
  const fmMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!fmMatch) return;

  let fmLines = fmMatch[1].split(/\r?\n/);
  let body = fmMatch[2];

  let agentMeta = {
    file: `agents/${file}`,
    name: path.basename(file, '.md'),
    model: 'pro',
    description: '',
  };

  fmLines = fmLines.map(line => {
    // Model mapping
    if (/^\s*model:\s*sonnet\s*$/i.test(line)) {
      stats.modelReplacements++;
      modified = true;
      agentMeta.model = 'pro';
      return 'model: pro';
    }
    if (/^\s*model:\s*haiku\s*$/i.test(line)) {
      stats.modelReplacements++;
      modified = true;
      agentMeta.model = 'flash';
      return 'model: flash';
    }
    if (/^\s*model:\s*opus\s*$/i.test(line)) {
      stats.modelReplacements++;
      modified = true;
      agentMeta.model = 'pro';
      return 'model: pro';
    }

    // Tool mapping
    if (/^\s*tools:\s*/i.test(line)) {
      stats.toolReplacements++;
      modified = true;
      return 'tools: run_command, view_file, grep_search, find_by_name, replace_file_content';
    }

    if (/^\s*name:\s*(.+)$/i.test(line)) {
      agentMeta.name = line.replace(/^\s*name:\s*/i, '').trim().replace(/^['"]|['"]$/g, '');
    }
    if (/^\s*description:\s*(.+)$/i.test(line)) {
      agentMeta.description = line.replace(/^\s*description:\s*/i, '').trim().replace(/^['"]|['"]$/g, '');
    }

    return line;
  });

  // Antigravity artifacts guidance injection for architect/review/planner agents
  const isArchitectOrReviewer = /architect|review|plan|audit/i.test(file);
  if (isArchitectOrReviewer && !body.includes('Antigravity Artifact Guidelines')) {
    modified = true;
    body += `\n\n## Antigravity Artifact Guidelines\nWhen presenting detailed plans, architecture reviews, or audit summaries in Google Antigravity:\n- Format substantial deliverables as markdown artifacts (e.g. \`implementation_plan.md\` or \`walkthrough.md\`).\n- Use Mermaid diagrams (\`flowchart TD\`, \`sequenceDiagram\`, \`erDiagram\`) to visualize architecture and flows.\n- Provide exact clickable file references using github-style \`[filename](file:///path/to/file)\` links.\n`;
  }

  agentRegistry.push({
    id: agentMeta.name,
    file: agentMeta.file,
    role: agentMeta.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: agentMeta.description,
    modelTier: agentMeta.model,
    antigravitySubagentSpec: {
      TypeName: agentMeta.name,
      Role: agentMeta.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      Model: agentMeta.model,
      Workspace: 'inherit'
    }
  });

  if (modified) {
    const newContent = `---\n${fmLines.join('\n')}\n---\n${body}`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    stats.agentsAdapted++;
  }
});

// Write Agent Registry
const registryPath = path.join(agentsDir, 'registry.json');
fs.writeFileSync(registryPath, JSON.stringify(agentRegistry, null, 2), 'utf8');
console.log(`✅ Generated agents/registry.json for ${agentRegistry.length} subagent definitions.`);

// 2. Process Skills
console.log('🔄 Adapting Skills for Antigravity...');
const skillFolders = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

skillFolders.forEach(folder => {
  const skillFile = path.join(skillsDir, folder, 'SKILL.md');
  if (!fs.existsSync(skillFile)) return;

  let content = fs.readFileSync(skillFile, 'utf8');
  let original = content;

  // Replace tool references in frontmatter or text
  content = content.replace(/allowed-tools:\s*Bash\([^)]*\)/gi, 'allowed-tools: run_command');
  content = content.replace(/\bBash tool\b/gi, 'run_command tool');
  content = content.replace(/\bFileEdit tool\b/gi, 'replace_file_content tool');
  content = content.replace(/\bRead tool\b/gi, 'view_file tool');

  if (content !== original) {
    fs.writeFileSync(skillFile, content, 'utf8');
    stats.skillsAdapted++;
  }
});

console.log('\n' + '='.repeat(50));
console.log('Antigravity Adaptation Complete:');
console.log(`  Agent Personas Adapted : ${stats.agentsAdapted} / ${agentFiles.length}`);
console.log(`  Model Tier Mappings    : ${stats.modelReplacements}`);
console.log(`  Tool Semantics Updated : ${stats.toolReplacements}`);
console.log(`  Skills Adapted         : ${stats.skillsAdapted} / ${skillFolders.length}`);
console.log(`  Registry Generated     : agents/registry.json (${agentRegistry.length} agents)`);
console.log('='.repeat(50));
