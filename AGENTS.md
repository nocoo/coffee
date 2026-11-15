# Coffee

Bilingual 3D coffee flavor wheel, origin atlas, brew lab, and tasting journal.
Profile: ts-worker-web
Direction: [docs/architecture.md](docs/architecture.md). Frameworks must not rewrite this file.

## Scope and instruction sources

- This file is the only project handbook; nested files do not compete with it. Do not create a `CLAUDE.md` alias or copy.
- This file is the contract; `.github/workflows/ci.yml` (base-ci quality + L3), `vite.config.ts` Vitest and `playwright.config.ts` are enforcement. If they disagree, that is a failure — raise enforcement to match this file; never lower the contract to a weaker hook.
- Human docs: [README.md](README.md) and `docs/*.md`. Version is `package.json` `"version"` as `1.2.3`, displayed `v1.2.3`. No env files are required. Global machine rules live in the machine `AGENTS.md` and `rules/git-commit.md`.
- Accidents: [Retrospective.md](Retrospective.md).

## Project invariants

- All content ships in-repo. Runtime needs no API keys, database, or env files.
- Tasting journal stays in the browser; damaged local data must not be silently overwritten.
- Cloudflare Worker serves static Vite assets only (`coffee.hexly.ai`). Do not add D1 or remote `-test` resources.
- `/api/live` is a build-emitted JSON health document, not an application API.
- Ambient audio is synthesized in-browser and stays muted until the user enables it.

## Setup and commands

TypeScript strict (`tsc -b`); Bun 1.4.0 (`packageManager`); Vite 8 + React 19 on Cloudflare Workers static assets; Biome lint; Vitest/V8 L1 with four 95% coverage floors plus Playwright L3; no database (browser localStorage). Layout: `src/{components,data,lib,pages}`, `tests/{*.test.ts,e2e}`, `docs/`, `public/`, `scripts/`. MVVM: keep viewmodels free of View/DOM imports; routes stay thin.

```bash
bun install
bun run dev                 # Vite, default http://localhost:5173
bun run typecheck           # tsc -b
bun run lint                # biome check --error-on-warnings . (check-only)
bun run build               # tsc -b && vite build && scripts/check-budgets.mjs
bun run test                # vitest run --coverage (tests/**/*.test.ts)
bun run test:e2e            # playwright; local preview :4173 unless COFFEE_BASE_URL
bun run deploy:check        # wrangler deploy --dry-run
bun run deploy              # validate + dry-run + wrangler deploy (owner only)
```

## Testing and quality contract

Quality follows System1 v1.3.0 Native Mode (`nocoo/base-ci v2026.15`) in `.github/workflows/quality-slots.yml` and `.github/workflows/ci.yml` (`Verify coffee`). Statuses: `enforced` | `planned` | `manual` | `N/A`.

| Slot              | Status   | Evidence                                                |
| ----------------- | -------- | ------------------------------------------------------- |
| `S1` Types        | enforced | `bun run typecheck` in CI                               |
| `S2` Lint         | enforced | `bun run lint` in CI                                    |
| `S3` Workflow     | enforced | SHA-pinned workflow action check in CI                  |
| `G1` Secrets      | enforced | `gitleaks` scan in CI                                   |
| `G2` Dependencies | enforced | `osv-scanner` scan (`bun.lock`) in CI                   |
| `B1` Build        | enforced | `bun run build && bunx wrangler deploy --dry-run` in CI |
| `L1` Unit         | enforced | `bun run test` (Vitest/V8 95% floors) in CI             |
| `L2` Runtime      | N/A      | Static site; `/api/live` emitted as static JSON asset   |
| `L3` Integration  | N/A      | Static site without application API                     |
| `L4` E2E          | enforced | `bun run test:e2e` (Playwright Chromium) in CI          |
| `P1` Package      | N/A      | Deployed as Cloudflare Worker, not an npm package       |
| `Z1` Gate         | enforced | `quality / Z1: Gate` required status check on `main`    |

Docs remain `manual` review; release runs `.github/workflows/release.yml` (`deploy-worker.yml`) after green `Verify coffee`. No husky hooks installed; `--no-verify` forbidden.

## Resources and isolation

| Purpose | Port / resource        | Isolation                                     |
| ------- | ---------------------- | --------------------------------------------- |
| Dev     | 5173 Vite              | local static app; may bind `0.0.0.0`          |
| L3      | 4173 `bun run preview` | Playwright `webServer`; do not use production |

E2E never touches prod data stores. Do not invent a SQLite database for this static app. Never deploy remote `-test` Workers.

## Operations / release

- Entry: `bun run deploy` or tag `v*.*.*` → `release.yml`
- Auth: Cloudflare account owner (`CLOUDFLARE_API_TOKEN`)
- Before ship: `bun run validate` and dry-run; live site `https://coffee.hexly.ai`
- Runbook: [docs/deployment.md](docs/deployment.md)

## Retrospective

| Kind                                  | Where                                |
| ------------------------------------- | ------------------------------------ |
| Accident narrative                    | [Retrospective.md](Retrospective.md) |
| Project-specific rule that will recur | one line here (cap ~10)              |
| Cross-project lesson                  | nmem / global `AGENTS.md` / `rules/` |
| Deterministically checkable rule      | hook or test, not prose              |
- Do not point Playwright at production via `COFFEE_BASE_URL` during local or CI L3.
