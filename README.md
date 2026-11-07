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

Skills in this repository follow the open [Agent Skills specification](https://agentskills.io) (`SKILL.md` with metadata frontmatter). Install once globally, and your assistants will automatically discover and load them on demand across any project.

### 🌟 1. Universal Standard (Recommended)

Most modern AI assistants and skill runners scan the open standard `~/.agents/skills/` directory using progressive disclosure:

```bash
mkdir -p ~/.agents/skills
cp -r skills/optimization-workflow ~/.agents/skills/
```

---

### 🛠️ 2. Platform-Specific Global Skill Directories

If you prefer installing directly into your specific assistant's native global skills path:

| Assistant | Native Global Skill Path | One-Line Install Command |
| :--- | :--- | :--- |
| **OpenAI Codex** | `~/.codex/skills/` | `mkdir -p ~/.codex/skills && cp -r skills/optimization-workflow ~/.codex/skills/` |
| **Google Antigravity** | `~/.gemini/config/skills/` | `mkdir -p ~/.gemini/config/skills && cp -r skills/optimization-workflow ~/.gemini/config/skills/` |
| **Claude Code** | `~/.claude/commands/` | `mkdir -p ~/.claude/commands && cp skills/optimization-workflow/SKILL.md ~/.claude/commands/optimize.md` |
| **Cursor** | `~/.cursor/rules/` | `mkdir -p ~/.cursor/rules && cp skills/optimization-workflow/SKILL.md ~/.cursor/rules/optimization-workflow.mdc` |

---

## 🤖 Directives for AI Agents (One-Prompt Global Installation)

> **User Prompt**: You can pass this README directly to your AI Agent (Cursor, Claude Code, Codex, Antigravity) with the command:  
> *"Read README.md and install the optimization-workflow skill globally into ~/.agents/skills/ (or your native global skills directory)."*

<!-- AGENT_INSTALL_DIRECTIVES_START -->
### 📋 Agent Global Self-Installation Protocol

When instructed by the user to install this skill globally:

1. **Target Directory**:
   - **Default & Preferred**: Copy `skills/optimization-workflow` to `~/.agents/skills/optimization-workflow`.
   - **Native Alternative**:
     - **OpenAI Codex**: `~/.codex/skills/optimization-workflow`
     - **Google Antigravity**: `~/.gemini/config/skills/optimization-workflow`
     - **Claude Code**: `~/.claude/commands/optimize.md`
     - **Cursor**: `~/.cursor/rules/optimization-workflow.mdc`

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
