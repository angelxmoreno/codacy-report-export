# codacy-report-export

Export Codacy PR issues via the Codacy API and transform them into standardized, agent-consumable reports.

This CLI is designed to bridge static analysis and AI coding agents by producing deterministic, structured outputs that tools like Cursor, Codex, Claude Code, or custom agents can reliably consume.

***

## Features

* Fetch **PR-specific issues** directly from the Codacy API
* Normalize findings into a **stable, predictable schema**
* Generate **agent-ready reports** (not human-only explanations)
* Designed to integrate cleanly with **prompt-fn**
* Installable and runnable as a **global CLI**

***

## Installation

```bash
npm install -g codacy-report-export
```

Or with Bun:

```bash
bun add -g codacy-report-export
```

***

## Usage

*TBD*

***

## Output philosophy

This tool does **not** attempt to fix code or generate patches.

Instead, it produces **explicit execution instructions** that another AI agent can safely act on. Each report is structured to include:

* Issue summary
* Severity and category
* Affected files and locations
* Constraints and assumptions
* A dedicated **"Prompt for AI Agent"** section

This makes the output suitable for:

* AI coding agents
* Automated remediation pipelines
* Human-in-the-loop review workflows

***

## Authentication

The Codacy API token must be provided via environment variable:

```bash
export CODACY_ACCOUNT_TOKEN=your_token_here
```

The token is never persisted or logged by the tool.

***

## Why this exists

Codacy’s MCP integration does not reliably expose PR-scoped issues in an agent-friendly way.

This project exists to:

* Pull the **right data** (PR-aware)
* Preserve **determinism**
* Enable **tool-to-agent handoff** without hidden behavior

***

## Roadmap

* Multiple export formats
* GitHub Action wrapper
* Configurable prompt templates

***

## License

[MIT](LICENSE)
