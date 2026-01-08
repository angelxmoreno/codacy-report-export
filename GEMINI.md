# GEMINI.md - Project Context & Instructions

## Project Overview

**codacy-report-export** is a CLI tool designed to fetch Pull Request (PR) issues from the Codacy API and transform them into deterministic, structured reports optimized for AI coding agents.

**Goal:** Bridge the gap between static analysis tools and AI agents by providing explicit, machine-readable execution instructions rather than human-centric reports.

## Tech Stack & Tooling

* **Language:** TypeScript
* **Runtime / Package Manager:** [Bun](https://bun.sh/)
* **Linter / Formatter:** [Biome](https://biomejs.dev/)
* **Markdown Linter:** [Remark](https://github.com/remarkjs/remark)
* **Git Hooks:** [Lefthook](https://github.com/evilmartians/lefthook)
* **Documentation:** [TypeDoc](https://typedoc.org/)

## Getting Started

### Prerequisites

* **Bun:** Ensure `bun` is installed on your system.

### Installation

```bash
bun install
```

### Key Commands

| Command | Description |
| :--- | :--- |
| `bun test` | Run the test suite using Bun's native test runner. |
| `bun run check-types` | Run TypeScript type checking without emitting files. |
| `bun run lint` | Run code (Biome) and Markdown (Remark) linters. |
| `bun run lint:fix` | Auto-fix linting issues. |
| `bun run docs` | Generate API documentation using TypeDoc. |

## Development Conventions

### Coding Style (Enforced by Biome)

* **Indentation:** 4 spaces.
* **Quotes:** Single quotes.
* **Semicolons:** Always.
* **Trailing Commas:** ES5 compatible.
* **Imports:** Organized automatically on save/lint.

### Contribution Guidelines

1. **Tests:** All behavior changes must be accompanied by tests.
2. **Linting:** Code must pass `bun run lint` and `bun run check-types` before committing.
3. **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `fix: handle empty prompt`, `feat: add json output`).
4. **Hooks:** Lefthook is configured to run checks on commit/push. Do not bypass these checks.

## Project Structure

* `src/`: Source code directory.
  * `index.ts`: Main entry point.
* `docs/`: Documentation files.
* `biome.json`: Configuration for Biome (linter/formatter).
* `package.json`: Project dependencies and scripts.
* `tsconfig.json`: TypeScript configuration.
* `.codacy.yml`: Configuration for Codacy analysis.

## Usage Note

The tool requires a Codacy API token to function, provided via the environment variable `CODACY_ACCOUNT_TOKEN`.
