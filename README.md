# Awesome Agent Cookbook 👨‍💻🍳

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/du0wen/awesome-agent-cookbook/pulls)

> A curated collection of battle-tested recipes, reusable agent skills, workflow patterns, and practical tips for building and coding with AI Agents (Cursor, Claude Code, Windsurf, GitHub Copilot, Antigravity, and beyond).

---

## Curated Recipes & Skills

| Category | Recipe / Skill | Target Assistants | Summary |
| :--- | :--- | :--- | :--- |
| **Workflow Protocol** | [Optimization Workflow](./skills/optimization-workflow/SKILL.md) | Universal (Cursor / Claude / Windsurf / Copilot / Antigravity) | A strict 3-phase execution protocol (`State Assessment` ➔ `Self-Diagnosis` ➔ `Tiered Proposals`) preventing premature or destructive code edits. |
| **Quota Management** | [Codex & Claude 5h Rolling Window](./tips/codex-5h-quota-window.md) | OpenAI Codex / Claude Code | Align 5-hour rolling rate-limit windows with daily work schedules via automated heartbeat triggers, preventing mid-flow lockouts. |

---

## ⚡ Multi-Platform Setup: Loading Skills into Your Agent

Choose your platform below to integrate skills into your development workflow:

<details open>
<summary><b>1. Cursor</b></summary>

Add as a project rule (`.mdc` format):
```bash
mkdir -p .cursor/rules
cat << 'EOF' > .cursor/rules/optimization-workflow.mdc
---
description: Enforce 3-phase optimization protocol before refactoring or performance changes
globs: *
---
EOF
cat skills/optimization-workflow/SKILL.md >> .cursor/rules/optimization-workflow.mdc
```
</details>

<details open>
<summary><b>2. Claude Code (Anthropic)</b></summary>

Append the protocol to your project's `CLAUDE.md`:
```bash
cat << 'EOF' >> CLAUDE.md

## Optimization & Refactoring Protocol
Always follow the 3-phase protocol in `skills/optimization-workflow/SKILL.md`:
1. Phase 1: Current State Assessment (gather facts, scope, clickable line references)
2. Phase 2: Self-Inspection & Root Cause (audit P0-P2 issues across performance, architecture, robustness)
3. Phase 3: Tiered Proposals (Tier A: Quick-Win / Tier B: Recommended / Tier C: Deep Evolution)
CRITICAL: Never mutate code before user selects a tier.
EOF
```
Or install as a custom slash command:
```bash
mkdir -p ~/.claude/commands
cp skills/optimization-workflow/SKILL.md ~/.claude/commands/optimize.md
```
</details>

<details open>
<summary><b>3. Windsurf (Codeium)</b></summary>

Append to `.windsurfrules`:
```bash
cat skills/optimization-workflow/SKILL.md >> .windsurfrules
```
</details>

<details open>
<summary><b>4. GitHub Copilot</b></summary>

Add to workspace Copilot instructions:
```bash
mkdir -p .github
cat skills/optimization-workflow/SKILL.md >> .github/copilot-instructions.md
```
</details>

<details open>
<summary><b>5. Google Antigravity</b></summary>

Install as a native Agent Skill:
```bash
# Current workspace:
mkdir -p .gemini/skills/
cp -r skills/optimization-workflow .gemini/skills/

# Global for all projects:
mkdir -p ~/.gemini/config/skills/
cp -r skills/optimization-workflow ~/.gemini/config/skills/
```
</details>

---

## 🤖 Directives for AI Agents (One-Prompt Installation)

> **User Prompt**: You can pass this README directly to your AI Agent (Cursor, Claude Code, Windsurf, Copilot, Antigravity) with the command:  
> *"Read README.md and install the optimization-workflow protocol into this project."*

<!-- AGENT_INSTALL_DIRECTIVES_START -->
### 📋 Agent Self-Installation Protocol

When the user asks you to install or configure this repository's skills for this project:

1. **Detect Current Environment**:
   - If running as **Cursor**: Create `.cursor/rules/optimization-workflow.mdc` with frontmatter `description: "Optimization Protocol"` and `globs: *`, appending the rules from `skills/optimization-workflow/SKILL.md`.
   - If running as **Claude Code**: Append the 3-phase optimization protocol to `CLAUDE.md` in the repository root.
   - If running as **Windsurf**: Append the protocol to `.windsurfrules`.
   - If running as **GitHub Copilot**: Append the protocol to `.github/copilot-instructions.md`.
   - If running as **Google Antigravity**: Copy `skills/optimization-workflow` to `.gemini/skills/optimization-workflow`.

2. **Core Behavioral Directive**:
   - After installation, whenever asked to optimize, refactor, tune performance, or clean up code, **strictly enforce the 3-Phase Protocol**:
     `Phase 1: Current State Assessment` ➔ `Phase 2: Self-Inspection (P0-P2)` ➔ `Phase 3: Tiered Proposals (Tier A/B/C)`.
   - **CRITICAL**: Never edit code or mutate files until the user explicitly selects a proposal tier.
<!-- AGENT_INSTALL_DIRECTIVES_END -->

---

## Repository Structure

The repository maintains a lean, high-signal structure focused only on practical content:

```text
.
├── skills/        # Reusable agent skills (SKILL.md) and execution protocols
│   └── optimization-workflow/
│       └── SKILL.md
├── tips/          # Quota management, flow state preservation, and performance hacks
│   └── codex-5h-quota-window.md
├── LICENSE
└── README.md
```

---

## Conventions & Contributing

- **File Naming**: Use `kebab-case` for all files and directories (e.g., `rate-limit-mitigation.md`).
- **Language**: English preferred for docs and skills to ensure maximum compatibility with agent loaders.
- **Adding Content**: Place executable agent skills in `skills/<skill-name>/SKILL.md`, and practical tricks or guides in `tips/`. Update the [Curated Recipes & Skills](#curated-recipes--skills) table in this README with your addition.

---

## License

This project is licensed under the [MIT License](./LICENSE).
