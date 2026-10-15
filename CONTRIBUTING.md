# Contributing to Everything Antigravity

Thank you for your interest in contributing to **Everything Antigravity**! 🚀

This repository standardizes and brings the best autonomous engineering patterns, skills, and subagent architectures into **Google Antigravity**.

---

## 🛠 Adding a New Skill

1. Create a new directory inside `skills/<your-skill-name>/`.
2. Add a `SKILL.md` file using the progressive disclosure standard:
   ```yaml
   ---
   name: your-skill-name
   description: Detailed description of what the skill does and explicit trigger keywords.
   ---
   # Skill Title

   ## When to Use
   - Trigger conditions...

   ## Workflow
   1. Step-by-step instructions...
   ```
3. Run the automated skill validator to ensure compliance:
   ```bash
   node scripts/validate_skills.js
   ```

---

## 📐 Adding or Updating Rules

- Add technology- or domain-specific rules under `rules/<stack>/`.
- Rules should provide direct, actionable guidelines (e.g. strict typing, zero secrets, error boundaries).

---

## 🤖 Adding Specialist Subagents

- Subagent definitions live in `agents/<agent-name>.md`.
- Include frontmatter specifying:
  - `name`: Subagent identifier
  - `description`: Role purpose
  - `model`: `pro`, `flash`, or `inherit`
  - Persona and prompt defense baseline.

---

## 📜 Code of Conduct & Attribution

- Maintain clean, safe, and professional conduct.
- Credit original authors and maintain attribution headers.
- Project maintained by **Sanish Gyawali**.
