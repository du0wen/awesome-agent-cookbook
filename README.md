# Awesome Agent Cookbook 👨‍💻🍳

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/du0wen/awesome-agent-cookbook/pulls)

> A curated collection of battle-tested recipes, reusable agent skills, workflow patterns, and practical tips for building and coding with AI Agents (Cursor, Claude Code, OpenAI Codex, Antigravity, and beyond).

---

## Curated Recipes & Skills

| Category | Recipe / Skill | Target Assistants | Summary |
| :--- | :--- | :--- | :--- |
| **Workflow Protocol** | [Optimization Workflow](./skills/optimization-workflow/SKILL.md) | Universal (Cursor / Claude / Codex / Antigravity) | A strict 3-phase execution protocol (`State Assessment` ➔ `Self-Diagnosis` ➔ `Tiered Proposals`) preventing premature or destructive code edits. |
| **Quota Management** | [Codex & Claude 5h Rolling Window](./tips/codex-5h-quota-window.md) | OpenAI Codex / Claude Code | Align 5-hour rolling rate-limit windows with daily work schedules via automated heartbeat triggers, preventing mid-flow lockouts. |

---

## ⚡ Global Installation: Loading Skills Across All Projects

Skills in this repository follow the open [Agent Skills specification](https://agentskills.io). Install once globally on your machine, and your assistants will automatically discover and load them across any project.

### 🌟 1. Universal Standard (Recommended)

Most modern agents and skill loaders scan the open standard `~/.agents/skills/` directory using progressive disclosure:

```bash
mkdir -p ~/.agents/skills
cp -r skills/optimization-workflow ~/.agents/skills/
```

---

### 🛠️ 2. Platform-Specific Global Overrides

If you prefer configuring native global rule files for specific coding assistants:

<details open>
<summary><b>Cursor</b> (Global Rules)</summary>

Cursor officially loads file-based user rules across all workspaces from `~/.cursor/rules/`:
```bash
mkdir -p ~/.cursor/rules
cat << 'EOF' > ~/.cursor/rules/optimization-workflow.mdc
---
description: Universal 3-phase optimization protocol before refactoring or code cleanup
globs: *
---
EOF
cat skills/optimization-workflow/SKILL.md >> ~/.cursor/rules/optimization-workflow.mdc
```
*(Alternatively, paste the contents of `SKILL.md` into **Cursor Settings > Rules for AI**)*.
</details>

<details open>
<summary><b>Claude Code</b> (Global Memory & Commands)</summary>

Claude Code officially supports global persistent memory via `~/.claude/CLAUDE.md`:
```bash
mkdir -p ~/.claude
cat << 'EOF' >> ~/.claude/CLAUDE.md

## Optimization & Refactoring Protocol
Always enforce the 3-phase protocol in `skills/optimization-workflow/SKILL.md`:
1. Phase 1: Current State Assessment (gather facts, scope, clickable line references)
2. Phase 2: Self-Inspection & Root Cause (audit P0-P2 issues across performance, architecture, robustness)
3. Phase 3: Tiered Proposals (Tier A: Quick-Win / Tier B: Recommended / Tier C: Deep Evolution)
CRITICAL: Never mutate code before user confirms a proposal.
EOF
```
Or register as a global custom slash command (`/optimize`):
```bash
mkdir -p ~/.claude/commands
cp skills/optimization-workflow/SKILL.md ~/.claude/commands/optimize.md
```
</details>

<details open>
<summary><b>OpenAI Codex CLI</b> (Global Instructions & Skills)</summary>

Codex reads global instruction chains and skills from `~/.codex/`:
```bash
# Add as a global persistent skill:
mkdir -p ~/.codex/skills
cp -r skills/optimization-workflow ~/.codex/skills/

# Or append to global instructions (~/.codex/AGENTS.md):
mkdir -p ~/.codex
cat skills/optimization-workflow/SKILL.md >> ~/.codex/AGENTS.md
```
</details>

<details open>
<summary><b>Google Antigravity</b> (Global Agent Skills)</summary>

Antigravity natively scans user global skills:
```bash
mkdir -p ~/.gemini/config/skills/
cp -r skills/optimization-workflow ~/.gemini/config/skills/
```
</details>

---

## 🤖 Directives for AI Agents (One-Prompt Global Installation)

> **User Prompt**: You can hand this repository or README directly to your AI Agent (Cursor, Claude Code, Codex, Antigravity) with the command:  
> *"Read README.md and install the optimization-workflow skill globally into ~/.agents/skills/ (or into your platform's global config)."*

<!-- AGENT_INSTALL_DIRECTIVES_START -->
### 📋 Agent Global Self-Installation Protocol

When instructed by the user to install this skill globally:

1. **Target Directory**:
   - **Default & Preferred**: Install to `~/.agents/skills/optimization-workflow` so it conforms to the universal open Agent Skills specification.
   - **If running inside Cursor**: You may additionally create `~/.cursor/rules/optimization-workflow.mdc` (`globs: *`).
   - **If running inside Claude Code**: Append the 3-phase execution rules to `~/.claude/CLAUDE.md` or create `~/.claude/commands/optimize.md`.
   - **If running inside OpenAI Codex**: Copy to `~/.codex/skills/optimization-workflow` or append to `~/.codex/AGENTS.md`.
   - **If running inside Google Antigravity**: Copy to `~/.gemini/config/skills/optimization-workflow`.

2. **Core Behavioral Directive**:
   - Whenever asked to optimize, refactor, tune performance, or clean up code in any project, **strictly enforce the 3-Phase Protocol**:
     `Phase 1: Current State Assessment` ➔ `Phase 2: Self-Inspection (P0-P2)` ➔ `Phase 3: Tiered Proposals (Tier A/B/C)`.
   - **CRITICAL**: Never edit code or mutate files until the user explicitly confirms a proposal tier.
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
