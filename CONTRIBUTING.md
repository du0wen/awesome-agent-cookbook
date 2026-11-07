# Contributing to Awesome Agent Cookbook

Thank you for your interest in contributing to **Awesome Agent Cookbook**!

We welcome contributions of all kinds: battle-tested agent skills, workflow patterns, quota hacks, prompt templates, tool guides, and real-world post-mortems.

---

## What We Look For

1. **Practical & Actionable**: Submissions should solve real, recurring challenges in AI-assisted development.
2. **Reproducible**: Include concrete examples, system prompts, CLI commands, or configurations.
3. **Structured & Clean**: Follow the repository's directory layout and naming conventions.

---

## Directory Structure & Categories

| Directory | What Belongs Here | Example |
| :--- | :--- | :--- |
| [`skills/`](./skills) | Ready-to-use Agent skills (`SKILL.md` format) and executable workflows | Multi-phase refactoring protocols, code reviewer skills |
| [`tips/`](./tips) | Hacks, quota management, acceleration, configuration tricks | Rolling window resets, cache optimization |
| [`tools/`](./tools) | Tool reviews, setups, and integration guides (Codex, Claude Code, Cursor, etc.) | CLI configurations, MCP server setups |
| [`prompts/`](./prompts) | High-signal system prompts, task templates, and meta-prompts | Architecture audit prompts, test generation |
| [`notes/`](./notes) | Case studies, experience summaries, and post-mortems | Debugging complex hallucinations, multi-agent friction |

---

## Contribution Guidelines

1. **File Naming**:
   - Use `kebab-case` for file and directory names (e.g., `rate-limit-mitigation.md`).
   - Store images or visual assets in `assets/` and reference them using relative paths.
2. **Language**:
   - All documentation and examples should be written in **English**.
3. **Index Updates**:
   - When adding a new document, please update the corresponding index in both:
     1. The directory's `README.md` (e.g., `tips/README.md`)
     2. The root [`README.md`](./README.md)
4. **Pull Request Process**:
   - Fork the repository.
   - Create a feature branch (`git checkout -b recipe/your-topic`).
   - Commit your changes with a descriptive message (`git commit -m "feat(tips): add rate limit mitigation guide"`).
   - Push to your branch and open a Pull Request.

---

## Code of Conduct

Be welcoming, constructive, and respectful to all contributors and community members.
