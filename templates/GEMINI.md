# Everything Antigravity: Project Directives & Engineering Standards

> **Everything Antigravity** provides autonomous agents in Google Antigravity (IDE & CLI) with full engineering rigor: architecture planning, test-driven development, security gates, modular skills, and specialized subagents.

---

## 1. Operating Principles

1. **Plan Before Modifying**:
   - For multi-file refactors, architectural updates, or ambiguous requirements, enter **Planning Mode** first.
   - Outline architecture, data flow, potential pitfalls, and verification steps in `implementation_plan.md`.
   - Never implement destructive or breaking changes without explicit plan approval.

2. **Test-First Implementation (TDD)**:
   - For bug fixes: Write a reproduction test proving the bug exists, then fix the code until the test passes.
   - For new features: Define test cases alongside feature design.
   - Run verification tests proactively after modifications.

3. **Security Gate (Zero-Trust)**:
   - **No Secrets**: Never commit or print API keys, tokens, credentials, or `.env` contents.
   - **Input Sanitization**: Validate and sanitize all external inputs at system boundaries.
   - **Database Security**: Enforce parameterized queries or ORM sanitization. No raw string SQL concatenation.
   - **Safe Dependencies**: Never add unverified dependencies or packages without necessity.

4. **Code Quality & Maintainability**:
   - Favor pure functions, modular components, and immutability over mutable shared state.
   - Maintain clear error handling: fail visibly with actionable messages instead of swallowing exceptions.
   - Preserve existing code comments, docstrings, and architectural style unless refactoring is requested.

---

## 2. Skills & Progressive Disclosure

Everything Antigravity bundles 300+ modular engineering skills under `skills/` and `.agents/skills/`.

- When a task requires specialized domain knowledge (e.g. `accessibility`, `api-design`, `database-optimization`, `tdd`, `system-architecture`), inspect the corresponding skill's `SKILL.md` before execution.
- Only load and read skill details on-demand to conserve context window tokens.

---

## 3. Subagent Delegation Architecture

When solving complex, multi-stage problems, delegate focused tasks to specialized subagents:

| Role | Subagent Persona | Recommended Model | Best For |
| :--- | :--- | :--- | :--- |
| **System Architect** | `agents/code-architect.md` | `pro` | High-level system design, schema modeling, ADR documentation |
| **Planner** | `agents/planner.md` | `pro` | Deconstructing large tasks into atomic, dependency-ordered milestones |
| **TDD Guide** | `agents/tdd-guide.md` | `inherit` | Writing test harnesses, edge case tests, test suites |
| **Code Reviewer** | `agents/code-reviewer.md` | `pro` | Post-implementation review for regressions, code smells, readability |
| **Security Auditor** | `agents/security-auditor.md` | `pro` | Reviewing auth, injections, sanitization, and dependency vulnerabilities |
| **Build Resolver** | `agents/build-error-resolver.md` | `flash` | Rapidly diagnosing build, compile, and syntax errors |

---

## 4. Language & Framework Standards

Consult the stack-specific rules in `.agents/rules/` or `rules/`:
- **TypeScript**: `rules/typescript/` — Strict types, zero `any`, explicit boundary returns.
- **Python**: `rules/python/` — PEP 8, type hints, pytest conventions, virtual environments.
- **Go**: `rules/golang/` — Idiomatic error handling, table-driven tests, zero goroutine leaks.
- **React / Frontend**: `rules/react/`, `rules/web/` — Component purity, modern hooks, accessibility (WCAG AA).

---

*Configured by [Everything Antigravity](https://github.com/gyawalisanish0/Everything_Antigravity)*  
*Authored by Sanish Gyawali*
