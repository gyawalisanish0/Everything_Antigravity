# Multi-Agent Coordination Guide (AGENTS.md)

This document establishes the collaboration protocols for multi-agent workflows running in Google Antigravity.

---

## 1. Agent Roles & Specialization

When running multi-agent tasks (`invoke_subagent`), each agent operates within a dedicated scope:

- **Lead / Orchestrator Agent**:
  - Manages overall task lifecycle and user interaction.
  - Spawns specialized subagents for distinct research, architecture, or testing phases.
  - Synthesizes findings and requests user feedback.

- **Specialist Subagents**:
  - Receive a self-contained, actionable task prompt with clear acceptance criteria.
  - Execute their assigned duty in an isolated context to conserve the parent's context window.
  - Return findings or diffs back to the caller without making uncoordinated destructive changes.

---

## 2. Communication Standards

1. **Structured Outputs**:
   - Subagents must return structured markdown summaries highlighting:
     - **Status**: (Completed / Blocked / Needs Clarification)
     - **Actions Taken**: Files read, modified, or commands executed
     - **Key Findings**: Bottlenecks, potential risks, or bugs discovered
     - **Recommendations**: Next logical steps

2. **Context Preservation**:
   - Subagents should not dump hundreds of lines of raw logs into the message payload. Summarize results and cite file lines (`file:///path/to/file#L10-L25`).

3. **Workspace Isolation**:
   - Use `Workspace: "inherit"` for joint reads and edits in the active tree.
   - Use `Workspace: "branch"` or `Workspace: "share"` when testing experimental refactors or isolating dependency tests.

---

*Configured by [Everything Antigravity](https://github.com/gyawalisanish0/Everything_Antigravity)*  
*Authored by Sanish Gyawali*
