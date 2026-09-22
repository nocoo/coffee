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

TypeScript strict (`tsc -b`); Bun 1.4.0 (`packageManager`); Vite 8 + React 19 on Cloudflare Workers static assets; Biome lint; Vitest L1 (no coverage gate) plus Playwright L3; no database (browser localStorage). Layout: `src/{components,data,lib,pages}`, `tests/{*.test.ts,e2e}`, `docs/`, `public/`, `scripts/`. MVVM: keep viewmodels free of View/DOM imports; routes stay thin.

```bash
bun install
bun run dev                 # Vite, default http://localhost:5173
bun run typecheck           # tsc -b
bun run lint                # biome check .  (check-only)
bun run build               # tsc -b && vite build && scripts/check-budgets.mjs
bun run test                # vitest run (tests/**/*.test.ts)
bun run test:e2e            # playwright; local preview :4173 unless COFFEE_BASE_URL
bun run deploy:check        # wrangler deploy --dry-run
bun run deploy              # validate + dry-run + wrangler deploy (owner only)
```

## Testing and quality contract

6DQ keeps its name with unified L1, L2/L3, G2 and D1; the owner merged former G1 into L1 on 2026-09-21.
Required L1 bar: statements/branches/functions/lines each ≥ 95% with no `.skip`/`.only`, strict types and check-only lint/format with zero errors/warnings, installed hooks and failure rejection.
Statuses: `enforced` | `planned` | `manual` | `N/A`.

| Dimension | Required proof | Status | Evidence |
|---|---|---|---|
| L1 pre-commit quality | Four coverage metrics ≥ 95%, no `.skip`/`.only`, strict types and check-only lint with zero errors/warnings | planned | CI `bun run test` has no coverage thresholds in `vite.config.ts`; CI `bun run typecheck`; lint is `biome check .` without `--error-on-warnings` so warnings do not fail; no husky installed |
| L2 API | Real HTTP, 100% surface | N/A | no application API; `/api/live` is static JSON |
| L3 UI path | Playwright desktop+mobile | enforced | CI job `browser-e2e` → `bun run test:e2e` |
| G2 security | osv-scanner + gitleaks | enforced | base-ci `quality.yml` default `security: true` |
| D1 isolation | Fresh browser state and a guarded local target | planned | Playwright creates isolated contexts; preview defaults to loopback :4173. `COFFEE_BASE_URL` can bypass the local server, and dev-mode server reuse lacks an ownership guard. SQLite/`_test_marker` are N/A because there is no database |
| Build | `bun run build` + wrangler dry-run | enforced | CI `build-command` |
| Docs | numbered/architecture doc if behavior changed | manual | human review |
| Release | version + changelog + Worker deploy | enforced | `.github/workflows/release.yml` after green Verify coffee |

No husky. Target (unmeasured): pre-commit unified L1 on an index snapshot (`git checkout-index`) <30s; pre-push L2+G2 on stdin push refs <3min. Check-only; `--no-verify` forbidden.

## Resources and isolation

| Purpose | Port / resource | Isolation |
|---|---|---|
| Dev | 5173 Vite | local static app; may bind `0.0.0.0` |
| L3 | 4173 `bun run preview` | Playwright `webServer`; do not use production |

E2E never touches prod data stores. Do not invent a SQLite database for this static app. Never deploy remote `-test` Workers.

## Operations / release

- Entry: `bun run deploy` or tag `v*.*.*` → `release.yml`
- Auth: Cloudflare account owner (`CLOUDFLARE_API_TOKEN`)
- Before ship: `bun run validate` and dry-run; live site `https://coffee.hexly.ai`
- Runbook: [docs/deployment.md](docs/deployment.md)

## Retrospective

| Kind | Where |
|---|---|
| Accident narrative | [Retrospective.md](Retrospective.md) |
| Project-specific rule that will recur | one line here (cap ~10) |
| Cross-project lesson | nmem / global `AGENTS.md` / `rules/` |
| Deterministically checkable rule | hook or test, not prose |

- Do not point Playwright at production via `COFFEE_BASE_URL` during local or CI L3.
