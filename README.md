# Awesome Agent Cookbook 👨‍💻🍳

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/)

> A curated collection of battle-tested recipes, reusable agent skills, workflow patterns, and practical tips for building and coding with AI Agents (Codex, Claude Code, Cursor, Windsurf, Antigravity, and beyond).

---

## Curated Recipes & Skills

| Category | Recipe / Skill | Target Assistants | Summary |
| :--- | :--- | :--- | :--- |
| **Workflow Protocol** | [Optimization Workflow](./skills/optimization-workflow/SKILL.md) | Universal / Antigravity / Claude Code | A strict 3-phase execution protocol (`State Assessment` ➔ `Self-Diagnosis` ➔ `Tiered Proposals`) preventing premature or destructive code edits. |
| **Quota Management** | [Codex & Claude 5h Rolling Window](./tips/codex-5h-quota-window.md) | OpenAI Codex / Claude Code | Align 5-hour rolling rate-limit windows with daily work schedules via automated heartbeat triggers, preventing mid-flow lockouts. |

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
