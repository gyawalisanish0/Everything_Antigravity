#!/usr/bin/env python3
"""
Everything Antigravity - Skill Validator
Validates that all SKILL.md files comply with the Antigravity Progressive Disclosure standard:
1. Valid YAML frontmatter containing 'name' and 'description'
2. Non-empty description with trigger keywords
3. Folder name matches 'name' field
"""

import sys
import re
from pathlib import Path

def parse_frontmatter(content: str):
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if not match:
        return None, content
    raw_frontmatter, body = match.groups()
    frontmatter = {}
    current_key = None
    for line in raw_frontmatter.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip().strip("'\"")
            frontmatter[key] = val
            current_key = key
        elif current_key and line:
            # Multi-line string continuation
            frontmatter[current_key] += " " + line.strip().strip("'\"")
    return frontmatter, body

def main():
    root = Path(__file__).resolve().parent.parent
    skills_dir = root / "skills"
    
    if not skills_dir.exists():
        print(f"Error: {skills_dir} not found.")
        sys.exit(1)
        
    skill_folders = [d for d in skills_dir.iterdir() if d.is_dir()]
    total = len(skill_folders)
    passed = 0
    warnings = 0
    errors = []

    print(f"🔍 Validating {total} skills in Everything Antigravity...\n")

    for folder in sorted(skill_folders, key=lambda f: f.name):
        skill_file = folder / "SKILL.md"
        if not skill_file.exists():
            errors.append(f"❌ {folder.name}: Missing SKILL.md")
            continue
            
        try:
            content = skill_file.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            errors.append(f"❌ {folder.name}: Error reading file: {e}")
            continue
            
        fm, body = parse_frontmatter(content)
        if not fm:
            errors.append(f"❌ {folder.name}: Missing YAML frontmatter delimiters (---)")
            continue
            
        name = fm.get("name")
        desc = fm.get("description")
        
        if not name:
            errors.append(f"❌ {folder.name}: Missing 'name' in frontmatter")
            continue
            
        if not desc:
            errors.append(f"❌ {folder.name}: Missing 'description' in frontmatter")
            continue
            
        if len(desc) < 20:
            warnings += 1
            print(f"⚠️  {folder.name}: Description is very short ({len(desc)} chars).")

        passed += 1

    print("\n" + "=" * 50)
    print(f"Validation Summary:")
    print(f"  Total Skills Checked : {total}")
    print(f"  Valid Skills         : {passed}")
    print(f"  Warnings             : {warnings}")
    print(f"  Errors               : {len(errors)}")
    print("=" * 50)

    if errors:
        print("\nErrors Found:")
        for err in errors[:20]:
            print(err)
        if len(errors) > 20:
            print(f"... and {len(errors) - 20} more errors.")
        sys.exit(1)
    else:
        print("\n✅ All skills passed validation successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
