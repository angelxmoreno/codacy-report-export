# Repository Guidelines

## Project Structure & Module Organization

The CLI entry point lives in `src/index.ts`, keeping all runtime logic under `src/` with TypeScript and ECMAScript module syntax. API docs and agent-focused usage notes belong in `docs/`, generated via Typedoc and safe to overwrite. Tooling lives at the repo root: `biome.json` for formatting/linting, `lefthook.yml` for Git hooks, and `typedoc.json`, `tsconfig.json`, and config markdown files for contributors.

## Build, Test, and Development Commands

* `bun install` — install dependencies (triggers `lefthook install` via the `prepare` script).
* `bun run lint` / `bun run lint:fix` — run Biome plus Remark, or auto-fix straightforward issues.
* `bun test` and `bun run test:coverage` — execute Bun’s native test runner, optionally emitting LCOV.
* `bun run check-types` — type-check without emitting JS; run before publishing.
* `bun run docs` — regenerate `docs/` for any API changes.

## Coding Style & Naming Conventions

Biome enforces 4-space indentation, single quotes, trailing commas in ES5 positions, and always-semicolon output. Keep files as `.ts`, export shared helpers via index modules, and name classes in `PascalCase`, functions/variables in `camelCase`, and environment constants in `SCREAMING_SNAKE_CASE`. Markdown content must pass Remark with the provided presets, so wrap lines under 120 chars and avoid dead URLs.

## Testing Guidelines

Prefer colocated `*.test.ts` files or a dedicated `tests/` folder mirroring the module tree. Use Bun’s `describe`/`it` API with explicit assertions; mock Codacy API calls at the boundary so tests stay deterministic. Aim to cover new features with `bun test` locally and confirm aggregate impact with `bun run test:coverage` before opening a PR.

## Commit & Pull Request Guidelines

History shows Conventional Commit prefixes (`feat`, `fix`, `chore`, etc.); commitlint enforces the format, so follow `type(scope?): short imperative` and keep the body focused on rationale. Lefthook blocks commits if linting or type-checking fails, so run those commands proactively. Pull requests should describe behavior changes, link the driving issue, include CLI output or screenshots when relevant, and mention any secrets or config toggles that reviewers need to reproduce the run.

## Security & Configuration Tips

Authentication depends on `CODACY_ACCOUNT_TOKEN`; export it in your shell (`export CODACY_ACCOUNT_TOKEN=…`) rather than hardcoding. Never commit tokens—use `.env.local` entries added to `.gitignore` if you must script. When sharing logs, redact PR IDs or repository names from Codacy responses if the project is private.
