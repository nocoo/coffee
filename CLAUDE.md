# Coffee

Bilingual 3D coffee flavor wheel, origin atlas, brew lab, and tasting journal.
Profile: ts-worker-web
Direction: [docs/architecture.md](docs/architecture.md). Frameworks must not rewrite this file.

## Sources of Truth

This file is the **contract**. Hooks, CI, and config are **enforcement**. If they disagree, that is a failure — raise enforcement to match this file; never lower the contract to a weaker hook.

| Fact | Where |
|---|---|
| Agent handbook | this file |
| Human docs | README.md, `docs/*.md` |
| Version | `package.json` `"version"` as `1.2.3`, display `v1.2.3` |
| Enforcement | `.github/workflows/ci.yml` (base-ci quality + L3), `vite.config.ts` vitest, `playwright.config.ts` |
| Machine rules | global `AGENTS.md`, `rules/git-commit.md` |
| Accidents | [Retrospective.md](Retrospective.md) |
| Env files | none required |

## Project Invariants

- All content ships in-repo. Runtime needs no API keys, database, or env files.
- Tasting journal stays in the browser; damaged local data must not be silently overwritten.
- Cloudflare Worker serves static Vite assets only (`coffee.hexly.ai`). Do not add D1 or remote `-test` resources.
- `/api/live` is a build-emitted JSON health document, not an application API.
- Ambient audio is synthesized in-browser and stays muted until the user enables it.

## Stack / Layout

| Component | Choice |
|---|---|
| Language | TypeScript strict (tsc -b) |
| Package manager | Bun 1.4.0 (`packageManager`) |
| Runtime | Vite 8 + React 19; Cloudflare Workers static assets |
| Lint | Biome |
| Tests | Vitest L1 (no coverage gate) + Playwright L3 |
| Data | none (browser localStorage) |

```
src/{components,data,lib,pages}
tests/{*.test.ts,e2e}
docs/  public/  scripts/
```

MVVM: keep viewmodels free of View/DOM imports; routes stay thin.

## Commands

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

## Verification

Status: `enforced` | `planned` | `manual` | `N/A`.
6DQ = L1/L2/L3 + G1/G2 + D1. Required L1 bar is statements/branches/functions/lines each ≥ 95% with no `.skip` / `.only`.

| Change | Proof | Status | Evidence |
|---|---|---|---|
| Logic | L1 Vitest four metrics each ≥ 95% | planned | CI `bun run test` has no coverage thresholds in `vite.config.ts` |
| API / schema | L2 real HTTP, 100% surface | N/A | no application API; `/api/live` is static JSON |
| UI path | L3 Playwright desktop+mobile | enforced | CI job `browser-e2e` → `bun run test:e2e` |
| Types / lint | G1 0 error, 0 warning | enforced | CI `bun run typecheck`, `bun run lint`; no pre-commit |
| Deps / secrets | G2 osv-scanner + gitleaks | enforced | base-ci `quality.yml` default `security: true` |
| Test isolation | D1 per-run local state | planned | L3 defaults to local preview :4173; no persist-to/marker. Do not set `COFFEE_BASE_URL` (that targets a live host) |
| Bundler output | `bun run build` + wrangler dry-run | enforced | CI `build-command` |
| Docs | numbered/architecture doc if behavior changed | manual | human review |
| Release | version + changelog + Worker deploy | enforced | `.github/workflows/release.yml` after green Verify coffee |

No local husky. CI is the gate. Hooks elsewhere must stay check-only; `--no-verify` is forbidden.

## Resources / Isolation

| Purpose | Port / resource | Isolation |
|---|---|---|
| Dev | 5173 Vite | local static app; may bind `0.0.0.0` |
| L3 | 4173 `bun run preview` | Playwright `webServer`; do not use production |

E2E never touches prod data stores. Worker tests, if added, must use local Wrangler/Miniflare + per-run SQLite, never remote `-test`.

## Operations / Release

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
