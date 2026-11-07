# Awesome Agent Cookbook 👨‍💻🍳

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

> A curated collection of battle-tested recipes, reusable agent skills, workflow patterns, and practical tips for building and coding with AI Agents (Codex, Claude Code, Cursor, Windsurf, and beyond).

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Repository Structure](#-repository-structure)
- [Featured Recipes](#-featured-recipes)
  - [Tips & Tricks](#tips--tricks)
  - [Skills & Workflows](#skills--workflows)
- [Conventions](#-conventions)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

As developer workflows shift from simple prompt-based autocomplete to autonomous, multi-turn AI agents, staying in flow requires new strategies: managing rolling quota windows, enforcing structural guardrails on code modifications, composing reusable skills, and configuring tool environments.

**Awesome Agent Cookbook** provides practical, reproducible recipes to help developers maximize leverage when pairing with AI agents.

---

## 📂 Repository Structure

```
.
├── skills/        # Reusable agent skills (SKILL.md) and execution protocols
├── tips/          # Quota management, flow state preservation, performance hacks
├── tools/         # Setup notes, CLI configs, MCP servers (Codex, Claude Code, Cursor...)
├── prompts/       # High-signal system prompts and meta-prompts
├── notes/         # Case studies, friction logs, and post-mortems
└── assets/        # Visual diagrams and static resources
```

| Directory | Description |
| :--- | :--- |
| [`skills/`](./skills) | Ready-to-load Agent skills and multi-phase execution protocols. |
| [`tips/`](./tips) | Actionable hacks for rate limits, rolling windows, and workflow speedups. |
| [`tools/`](./tools) | Guides and configs for specific AI coding tools and integrations. |
| [`prompts/`](./prompts) | Standardized prompt templates for audits, testing, and system instructions. |
| [`notes/`](./notes) | Real-world insights, debugging experiences, and anti-patterns. |

---

## 🍳 Featured Recipes

### Tips & Tricks
- **[Maximizing the Codex & Claude Code 5-Hour Rolling Quota Window](./tips/codex-5h-quota-window.md)**
  Align 5-hour rolling rate-limit windows to your personal schedule using automated heartbeats, preventing mid-flow lockouts.

### Skills & Workflows
- **[Optimization & Refactoring Workflow](./skills/optimization-workflow/SKILL.md)**
  A strict 3-phase execution protocol (`Current State Assessment` ➔ `Self-Diagnosis` ➔ `Tiered Proposals`) preventing premature or destructive code edits.

---

## 📐 Conventions

- **File Naming**: Use `kebab-case` for all files and directories (e.g., `rate-limit-mitigation.md`).
- **Language**: All documentation, comments, and examples are written in **English**.
- **Images**: Store static images in `assets/` and use relative markdown paths.
- **Directory Indexing**: Maintain a local `README.md` inside each subfolder as a category index.

---

## 🤝 Contributing

Contributions are very welcome! Whether you have a new prompt template, an agent skill, a tool config, or a quota workaround:

1. Check out our [Contributing Guide](./CONTRIBUTING.md).
2. Open a Pull Request following the repository conventions.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
