# Coffee

Bilingual 3D coffee flavor wheel, origin atlas, brew lab, and tasting journal built with Vite 8, React 19, and strict TypeScript on Cloudflare Workers Static Assets (`coffee.hexly.ai`).
Docs: [README.md](README.md) · [Architecture](docs/architecture.md) · [Content Model](docs/content-model.md) · [Deployment](docs/deployment.md) · [Retrospective](Retrospective.md)

## Commands

Run from root with Bun 1.4.0 (`packageManager`) and strict TypeScript (`tsc -b`). No `.env` files or database are required. Layout: `src/{components,data,lib,pages}`, `tests/{*.test.ts,e2e}`, `docs/`, `public/`, `scripts/`.

```sh
bun install
bun run dev                 # Vite, default http://localhost:5173 (binds 0.0.0.0)
bun run typecheck           # S1: tsc -b
bun run lint                # S2: biome check --error-on-warnings . (check-only, 0 warnings)
bun run test                # L1: vitest run --coverage (80% floors, tests/**/*.test.ts)
bun run test:e2e            # L4: Playwright Chromium (local preview :4173 unless COFFEE_BASE_URL)
bun run build               # B1: tsc -b && vite build && node scripts/check-budgets.mjs
bun run validate            # lint + typecheck + test + build
bun run deploy:check        # wrangler deploy --dry-run
bun run deploy              # validate + deploy:check + wrangler deploy (owner only)
```

## Invariants

- All content ships in-repo; runtime requires no API keys, database, SQLite, or `.env` files.
- Tasting journal stays in browser `localStorage`; damaged or incompatible local data must never be silently overwritten.
- Cloudflare Worker serves static Vite assets only (`coffee.hexly.ai`); do not add D1, server runtimes, or remote `-test` Workers.
- `/api/live` is a build-emitted static JSON health document, not an application API.
- Ambient audio is synthesized in-browser and stays muted until the user explicitly enables it.
- MVVM: keep viewmodels/logic (`src/lib`) free of View/DOM imports and keep page routes thin.
- Version authority is `package.json` `"version"` (`1.2.3`), displayed as `v1.2.3`.
- Never point Playwright at production via `COFFEE_BASE_URL` during local or CI E2E runs.
- Production release (`bun run deploy` or `v*.*.*` tag, owner `CLOUDFLARE_API_TOKEN`) requires explicit authorization; run `bun run validate` and `bun run deploy:check` first ([Deployment](docs/deployment.md)).

## Quality & Local Gates

Follows `system1-quality`; CI slot definitions and pinned `base-ci` revision live in `.github/workflows/quality-slots.yml` (invoked by `.github/workflows/ci.yml` `Verify coffee`; `quality / Z1: Gate` required on `main`). Status vocabulary: `enforced`, `planned`, `manual`, `N/A`.

- **Exceptions / gaps**: `L2 Runtime` (`N/A`, static site and static `/api/live`), `L3 Integration` (`N/A`, no app API); docs review is `manual`.
- **Enforcement**: `L1 Unit` enforces 80% Vitest/V8 floors (`vite.config.ts`: `allowOnly: false`, `passWithNoTests: false`, covering `src/lib/**/*.ts` and `src/data/**/*.ts`, excluding `src/data/types.ts`, `src/lib/sound.ts`, and View `.tsx` files); `P1 Package` validates `bunx wrangler deploy --dry-run` against the `B1` artifact; `L4 E2E` uses `playwright.config.ts`; `.github/workflows/release.yml` deploys after green `Verify coffee`. Never weaken CI or hooks.
- **Local hooks**: no `.husky/` or `.githooks/` installed (local hooks `planned`); run `bun run validate` before committing and never pass `--no-verify`.

## Resources & Isolation

| Lane   | Endpoint / State                                                        | Boundary                                                                 |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Dev    | `http://localhost:5173` (Vite, binds `0.0.0.0`), browser `localStorage` | Local static app; no database or `.env`                                  |
| L4 E2E | `http://127.0.0.1:4173` (`bun run preview`, Playwright `webServer`)     | Isolated local build; never target prod via `COFFEE_BASE_URL`            |
| Prod   | `https://coffee.hexly.ai` (Worker `coffee`)                             | Read-only checks unless release is authorized; no remote `-test` Workers |

## Retrospective

Record incident narratives in [Retrospective.md](Retrospective.md); promote recurring project constraints to `Invariants` above and enforceable safeguards to tests/hooks.
