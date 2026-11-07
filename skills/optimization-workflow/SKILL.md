---
name: optimization-workflow
description: >-
  Use whenever the user requests optimization, refactoring, performance tuning,
  or system/code improvements (e.g., "optimize", "refactor", "tune",
  "performance", "clean up"). Enforces a strict 3-phase protocol: 1) summarize current
  state and baseline, 2) self-inspect to diagnose root causes, and 3) present
  actionable, tiered proposals before modifying any code.
---

# Optimization Workflow

Enforce this 3-phase protocol whenever the user asks for code, architecture, performance, or prompt optimization.

> **CRITICAL RULE**: NEVER mutate code, edit files, or execute destructive refactoring until the user explicitly confirms a proposal in Phase 3.

```
[Phase 1: Current State] ──> [Phase 2: Self-Check & Diagnosis] ──> [Phase 3: Tiered Proposals]
        │                                   │                                    │
  Gather facts & scope              Multi-angle audit (P0-P2)             Tiered solutions (A/B/C)
  Align baseline with user          Identify root causes                  Wait for user confirmation
```

---

## Execution Protocol

### Phase 1: Current State Assessment

Before proposing any changes, inspect the target and summarize factual findings to align understanding with the user.

1. **Scope & Boundaries**:
   - Identify exact target files, core functions, data flows, and external dependencies.
2. **Key Characteristics & Baseline**:
   - **Logic & Flow**: How does the current implementation work end-to-end?
   - **Complexity**: Current time/space complexity, loop nesting, I/O call frequency.
   - **Baseline & Metrics**: Benchmark latency, throughput, memory footprint, or test coverage (if available).
3. **Output Requirement**:
   - Present an objective summary with clickable line-range links (e.g., `path/to/file.py#L20-L45`).
   - State facts only—do not inject premature critique or solutions in this phase.

---

### Phase 2: Self-Inspection & Root Cause Diagnosis

Adopt the persona of a Principal Architect and conduct an adversarial audit across four dimensions:

| Dimension | Inspection Focus |
|:---|:---|
| **1. Performance & Efficiency** | Redundant computation, unindexed queries, N+1 patterns, unbuffered I/O, lock contention, memory leaks. |
| **2. Architecture & Code Smells** | SRP/OCP violations, long functions, magic numbers, tight coupling, code duplication (DRY), cognitive complexity. |
| **3. Robustness & Edge Cases** | Null/undefined pointers, unhandled exceptions, race conditions, timeout/fallback absence, security risks. |
| **4. Maintainability & Testability** | Ambiguous naming, lack of test coverage, untestable tight coupling, poor observability/logging. |

#### Diagnosis Format
For every discovered issue, categorize clearly:
- **Location**: `file_path#L<start>-L<end>`
- **Severity**:
  - `P0`: Critical defect, data loss risk, or blocking vulnerability.
  - `P1`: Significant performance bottleneck or structural technical debt.
  - `P2`: Minor inefficiency, style smell, or maintainability improvement.
- **Root Cause**: The underlying reason this exists (algorithmic, architectural, or framework misuse).
- **Impact / Risk**: Consequences if left unaddressed.

---

### Phase 3: Tiered Optimization Proposals

Provide structured, actionable choices allowing the user to trade off complexity against return on investment (ROI).

#### Proposal Tiers
1. **Tier A: Quick-Win (Minimal Changes)**
   - *Strategy*: Localized hotfix, caching, or algorithmic shortcut with zero contract changes.
   - *Trade-off*: Lowest risk and fastest turnaround, but may leave underlying architecture intact.
2. **Tier B: Recommended (Balanced Refactor) ★**
   - *Strategy*: Targeted refactoring addressing core P1 bottlenecks and architectural smells.
   - *Trade-off*: Best ROI between effort, performance gains, and long-term maintainability.
3. **Tier C: Deep Architectural Evolution (Optional)**
   - *Strategy*: Re-architecture (e.g., async pipeline, event-driven, decoupled services).
   - *Trade-off*: Maximum scalability; requires extensive testing and migration overhead.

#### Requirements per Proposal
- Summary of strategy and brief code/pseudocode diff illustration.
- Expected gains (e.g., latency reduction, complexity reduction).
- Potential risks, blast radius, and backward compatibility notes.
- Verification plan (unit test cases, benchmark commands) and rollback strategy.

---

## Language & Interaction Rules

- **Response Language**: Always communicate with the user in their preferred language.
- **Closure Callout**: Always end Phase 3 by asking the user which tier they prefer before taking action (e.g., asking whether they prefer Tier A, B, or C, and if there are any specific constraints).
