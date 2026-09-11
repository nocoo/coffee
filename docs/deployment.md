# Deployment and production verification

## Targets and ownership

- Source: public GitHub repository **https://github.com/nocoo/coffee**, branch `main`.
- Production: **https://coffee.hexly.ai**.
- Cloudflare Worker name: `coffee`.
- Account: `d51a8fde361e4be31db17d8c56737c1f` (an identifier, not a secret).
- Compatibility date: `2026-09-11`; Wrangler v4 is pinned through `bun.lock`.
- Git identity: `Zheng Li <lizheng@lizheng.me>`.

Only this repository, Worker and hostname belong to this deployment. No unrelated
repository, DNS record, zone setting or Worker needs to change.

## Configuration

[`wrangler.jsonc`](../wrangler.jsonc) uses the installed `wrangler/config-schema.json`.
Its asset directory is `./dist` and `not_found_handling` is `single-page-application`.
There is no `main` entry because Workers Static Assets supports a purely static deployment.
There is no empty handler, database, R2 bucket, secret, runtime API or custom binding.

The custom-domain route is:

```json
{ "pattern": "coffee.hexly.ai", "custom_domain": true }
```

Use the exact hostname, without scheme, wildcard or `/*`. `custom_domain: true` makes
the Worker the origin, allowing Cloudflare to create the DNS binding and certificates.
It is different from a zone route placed in front of an existing server. The account must
already control an active `hexly.ai` zone. Do not replace another Worker's binding without
checking ownership. `workers_dev` is enabled as a secondary diagnostic endpoint; preview
URLs are disabled. Production branding/canonical URLs always use the custom domain.

## Local checks

```sh
bun install
bun run lint
bun run typecheck
bun run test
bun run build
bunx wrangler deploy --dry-run
PLAYWRIGHT_BROWSERS_PATH=.work/browsers bunx playwright install chromium
bun run test:e2e
```

Run browser tests against a stable production build, not a dev server being changed by HMR.
`bun run build` includes the reproducible resource budgets. `bun run validate` combines the
first four verification scripts and build; `bun run deploy:check` is the Wrangler dry-run.
The dry-run validates bundling/configuration but does not verify domain permissions or TLS.

## GitHub publication

Use the personal GitHub CLI configuration on the owner's machine:

```sh
GH_CONFIG_DIR=/Users/nocoo/.config/gh-personal gh repo view nocoo/coffee
```

If the repository does not exist, create the public repository and connect this directory:

```sh
GH_CONFIG_DIR=/Users/nocoo/.config/gh-personal gh repo create nocoo/coffee --public --source=. --remote=origin
```

For an existing repository, inspect its branch/history before connecting; never force-push
over unrelated work. Use Conventional Commits and normal verification hooks. Commit files
explicitly; `.work/`, credentials, `dist/`, dependency directories and browser artifacts are
ignored.

```sh
git push -u origin main
GH_CONFIG_DIR=/Users/nocoo/.config/gh-personal gh repo view nocoo/coffee --json url,defaultBranchRef
git rev-parse HEAD
```

If HTTPS Git authentication is unavailable, the owner's existing personal SSH identity can
be used without editing any global SSH configuration:

```sh
git remote set-url origin git@github.com-personal:nocoo/coffee.git
GIT_SSH_COMMAND='ssh -i /Users/nocoo/.ssh/id-personal -o IdentitiesOnly=yes' git push -u origin main
```

## Cloudflare publication

Wrangler uses the existing local OAuth session. `bunx wrangler login` is needed only if the
session is missing or expired. Do not print the OAuth file, copy tokens into the repository,
or expose secret environment variables while troubleshooting.

```sh
bunx wrangler whoami
bunx wrangler deployments list --name coffee
bun run deploy
```

`bun run deploy` rechecks lint, types, tests, build and dry-run before running the actual
`wrangler deploy`. Browser tests are a separate release gate and should already be green.
On a first-ever deployment the deployments-list command can return “Worker not found”.
Record the actual version ID printed by deploy and inspect the resulting deployment:

```sh
bunx wrangler deployments list --name coffee
bunx wrangler versions list --name coffee
```

The GitHub Actions workflow performs verification only. It does not require production
tokens, publish previews or automatically deploy on pull requests.

## Verify the live result

```sh
curl --fail --silent --show-error --dump-header - https://coffee.hexly.ai/ --output /dev/null
curl --fail --silent --show-error --head https://coffee.hexly.ai/og.png
curl --fail --silent --show-error --head https://coffee.hexly.ai/icon-512.png
curl --fail --silent --show-error --head https://coffee.hexly.ai/manifest.webmanifest
COFFEE_BASE_URL=https://coffee.hexly.ai bun run test:e2e
```

Check the exact hashed script and stylesheet URLs referenced by the live HTML, not filenames
from an older build. They must return the expected JavaScript/CSS MIME types and the shipped
bytes. Check fonts, both icons, manifest, OpenGraph metadata and image, favicon, sitemap and
robots. Inspect security headers from [`public/_headers`](../public/_headers); Vite preview
does not apply Cloudflare's `_headers` rules.

Verify that HTML includes `no-transform` and that a real browser receives no injected
analytics script. Cloudflare's zone-level automatic Web Analytics injection can otherwise
produce a CSP error even when curl's HTML is unchanged. The response directive is the
[documented opt-out](https://developers.cloudflare.com/web-analytics/get-started/#sites-proxied-through-cloudflare)
for this application; it does not require changing a shared zone setting. Also verify
`/oss-licenses.txt`, which Vite generates from the dependencies actually bundled.

In a real browser verify language and theme persistence, a 3D flavor selection, calculator
output, journal export, exhibition autoplay and the muted → enabled → muted sound flow.
Look for console errors, failed chunks or CSP violations. Test 390px-class mobile, normal
desktop and 1920×1080 exhibition layouts. DNS/certificate provisioning may take time; a
successful CLI upload alone is not evidence that the custom hostname is ready.

SPA paths such as `/learn?article=water` should load directly. Unknown routes display the
localized 404 view and set `noindex`; Static Assets SPA fallback serves the shell with HTTP
200. `public/404.html` also provides a standalone bilingual fallback page. In this assets-only
SPA configuration an unmatched asset path can return that HTML shell as well: MIME checks
are necessary, and `nosniff` prevents that HTML from executing as JavaScript. There is no
server-side 404 handler or full-content prerendering in this release.

## Recovery and updates

Keep the previous deployment/version ID when releasing. If a new version fails validation,
inspect `bunx wrangler rollback --help`, select the known-good version from the deployment
history and use Wrangler's supported rollback command. Do not delete the Worker or domain
to solve a bad asset release. Redeploy a corrected build once verified.

Update source and `bun.lock` together. Preserve published content IDs or migrate journal
schema before removing them. Rename immutable-cached font files when their contents change.
For a domain move, update Wrangler, canonical/OpenGraph links, sitemap, manifest and docs
together; browser-local notes do not automatically transfer across origins.
