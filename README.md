# codacy-report-export

Export Codacy PR issues via the Codacy API and transform them into standardized, agent-consumable reports.

This CLI is designed to bridge static analysis and AI coding agents by producing deterministic, structured outputs that tools like Cursor, Codex, Claude Code, or custom agents can reliably consume.

***

## Features

* Fetch **PR-specific issues** directly from the Codacy API
* Normalize findings into a **stable, predictable schema**
* Generate **agent-ready reports** (not human-only explanations)
* Supports multiple output formats (Markdown, JSON, JUnit)
* Extensible Reporter architecture

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

### Authentication

The Codacy API token must be provided via environment variable:

```bash
export CODACY_ACCOUNT_TOKEN=your_token_here
```

A `sample.env` file is provided for convenience. You can copy it to `.env` for local development.

The token is never persisted or logged by the tool.

### Core Commands

#### `export-pr-issues <repo-path>`

The primary command to generate a report for a specific Pull Request. If `--pr` is omitted, the CLI will prompt you to select from recent open PRs.

* **Argument:** `<repo-path>` (e.g., `gh/org/repo`)
* **Options:**
  * `--pr <number>`: Specific PR number.
  * `--format <type>`: Output format (`markdown`, `json`, `junit`). Default: `markdown`.
  * `--output <path>`: Custom file path for the report.

```bash
codacy-report-export export-pr-issues gh/angelxmoreno/codacy-report-export --pr 2 --format json
```

#### Discovery Commands

Useful for exploring your Codacy data structure:

* `listOrganizations --provider <gh|gl|bb|ado>`: List available organizations.
* `listRepositories --provider <p> --remoteOrganizationName <org>`: List repositories in an org.
* `listRepositoryBranches --provider <p> --remoteOrganizationName <org> --repositoryName <repo>`: List branches.
* `listRepositoryPullRequests --provider <p> --remoteOrganizationName <org> --repositoryName <repo>`: List PRs.
* `listPullRequestIssues --provider <p> --remoteOrganizationName <org> --repositoryName <repo> --pullRequestNumber <n>`: List raw issues.

***

## Reporters

The tool uses a stateless **Reporter Architecture**, allowing data to be transformed into various formats.

### Built-in Formats

* `markdown`: (Default) Optimized for AI agent context injection.
* `json`: Raw issue data in a clean JSON array.
* `junit`: standard XML format compatible with CI/CD dashboards (Jenkins, GitHub Actions, etc.).

### 3rd Party Reporters (Coming Soon)

The architecture is designed to support 3rd party plugins. Developers will soon be able to register custom reporters by implementing the `ReporterInterface`.

***

## Why this exists

Codacy’s MCP integration does not reliably expose PR-scoped issues in an agent-friendly way. This project ensures:

1. **PR-Aware Data:** Pulls exactly what changed in the current PR.
2. **Determinism:** Stable output that agents can parse reliably.
3. **Handoff:** Enables tool-to-agent handoff without human intervention.

***

## License

[MIT](LICENSE)
