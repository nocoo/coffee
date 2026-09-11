<p align="center">
  <img src="../public/icon-512.png" width="128" alt="Coffee logo" />
</p>
<h1 align="center">coffee · A coffee flavor universe</h1>
<p align="center">Explore coffee flavors, origins and brewing methods, then record what you taste.</p>
<p align="center">
  <a href="https://coffee.hexly.ai/?lang=en">Website</a> ·
  <a href="../README.md">简体中文</a>
</p>

Coffee is a bilingual space for sensory learning and brewing practice, with a slow exhibition mode for a coffee shop display. It runs entirely in the browser; the content and calculations need no account, API key or server database.

![Coffee — A little curiosity. A world of flavor.](../public/og.png)

## Features

- **An original 3D flavor wheel:** eight families, 24 groups and 96 descriptors. Select, rotate and zoom the Three.js model, follow breadcrumbs, explore related flavors, save favorites and try everyday sensory exercises. A keyboard-accessible SVG view provides a lighter alternative.
- **Bilingual reference material:** 23 producing countries and illustrative regions, 15 variety/species groups, seven processing methods and four roast categories. Thirty articles cover sensory practice, cupping, extraction, water and defects, with two learning paths and a six-question calibration exercise. Content, sources, search and exports support Chinese and English.
- **A brewing lab:** V60, Chemex, AeroPress, French press, espresso, moka pot, siphon, cold brew, Turkish coffee and Kalita. Adjust ratios, calculate from coffee or water mass and scale servings; espresso recipes explicitly identify the target beverage yield. Preference suggestions explain their reasoning and can become journal recipes.
- **A tasting journal:** record descriptive intensity separately from personal liking. Save, edit, copy and export notes as Markdown or JSON, including recipe, origin, process, roast and up to 12 flavors. Invalid stored data is preserved instead of silently overwritten.
- **Three moods:** Candy Daylight, Midnight Espresso and Natural Terroir. Language, theme, favorites and learning progress persist locally. High contrast and reduced motion are supported.
- **A shop exhibition:** 18 stops advance every 12 seconds through flavors, origins and brewing methods. Pause, jump, use fullscreen or change language and theme. Web Audio generates optional ambience; sound starts muted and requires an explicit action, with volume and mute controls.

## Usage

Open [coffee.hexly.ai](https://coffee.hexly.ai/?lang=en). Use the top bar to change language and theme, then explore the flavor wheel, origin atlas, brewing lab, learning space, journal or exhibition.

Journal records stay in this browser on this device. Export a backup when needed. There is no account, cloud synchronization or JSON import interface. Recommendations use readable local rules; they do not query store inventory or predict the score of a particular coffee lot.

## Development

Use Bun 1.4 or newer and a modern Node.js runtime. Asset generation and Playwright tooling use Node; CI uses Node 24.

```sh
bun install
bun run dev
```

Vite serves development at `http://localhost:5173`. Application content is checked into the repository, so local use requires no API keys, database or environment variables.

```sh
bun run lint
bun run typecheck
bun run test
bun run build
bun run deploy:check
```

`bun run validate` runs lint, strict type checking, Vitest and the production build. The build also checks JavaScript, Three.js engine, CSS and font budgets. Vite retains its generic warning for the Three engine chunk above 500 kB uncompressed; the engine loads on demand and has a separate hard limit of 250 KiB gzip.

```text
src/data/          Bilingual content, types, relationships and sources
src/lib/           Preferences, routes, calculations, search, notes and sound
src/components/    3D/SVG wheel and accessible shared components
src/pages/         Flavors, origins, brewing, learning, journal and exhibition
public/            Icons, social artwork, fonts, SEO and response headers
tests/             Data, arithmetic, storage and browser scenarios
scripts/           Reproducible image generation and resource budgets
docs/              Architecture, content model, research and deployment
```

See the [architecture](architecture.md) and [content model](content-model.md).

## Tests

`bun run test` checks content integrity, recipe calculations, search, recommendations and storage behavior. To run browser tests for the first time:

```sh
PLAYWRIGHT_BROWSERS_PATH=.work/browsers bunx playwright install chromium
bun run build
bun run test:e2e
```

Playwright starts the production preview on port 4173. Scenarios cover desktop and mobile viewports, all three themes, real 3D interaction, search, recipes, journal editing and exports, learning, exhibition playback and sound consent. Reports go to the ignored `playwright-report/`; traces and failure images go to `test-results/`.

To check a deployed environment:

```sh
COFFEE_BASE_URL=https://coffee.hexly.ai bun run test:e2e
```

Tests save notes only inside isolated browser contexts and do not write remote data. Chromium desktop, simulated mobile and 1920×1080 exhibition checks do not establish compatibility with every physical device, GPU or browser. CI runs static checks, unit tests, the build, a deployment dry run and browser tests; it does not publish production automatically.

## Stack

| Technology | Role |
| --- | --- |
| TypeScript / React | Bilingual interface, content model and interaction |
| Three.js / React Three Fiber | Selectable 3D flavor wheel, with a separate lightweight SVG view |
| Vite / Bun | Development, dependency management and static builds |
| History API / localStorage | Navigation, preferences, learning progress and local tasting notes |
| Web Audio API | Opt-in synthesized ambience |
| Cloudflare Workers Static Assets | Static delivery and the custom domain |
| Vitest / Playwright | Data, calculation, storage and desktop/mobile browser checks |

## Deployment

[wrangler.jsonc](../wrangler.jsonc) configures Cloudflare Workers Static Assets for **coffee.hexly.ai**. Wrangler v4 can publish the static directory directly, without an empty Worker script or additional backend.

```sh
bunx wrangler login
bun run deploy
```

The Cloudflare account must be able to manage the configured account and the `hexly.ai` zone. The custom-domain route creates the domain binding, DNS and certificate. See [deployment](deployment.md) for commands, access requirements, checks and rollback. Keep OAuth files, tokens, `.env` and `.dev.vars` out of Git.

## Sources and limits

Research draws on the WCR Sensory Lexicon and Varieties Catalog, SCA CVA and 102-2024, CQI, ICO, official origin organizations and coffee science papers. The application uses original Chinese and English explanations. [Research and attribution](research-sources.md) records access dates, citation scope and licensing.

Flavor descriptions are not quality scores, and an origin, variety or process does not guarantee a particular taste. Recipes are stated practice starting points. The flavor hierarchy, colors, model and kitchen exercises are original; they do not reproduce the SCA flavor wheel, official cupping forms or WCR's protected definitions and standard-reference recipes. This is an independent educational product with no institutional affiliation or endorsement.

The SVG view supports browsers without WebGL and devices using data-saving or lightweight modes. Mobile rendering uses a lower pixel ratio and demand rendering. The app provides SEO metadata, a sitemap and a no-JavaScript introduction, but does not prerender every page on the server or provide a complete offline cache.

## License

Original code, text and programmatic visuals use the [MIT license](../LICENSE). Fonts, map data and dependencies retain the terms in [Third-party notices](../THIRD_PARTY_NOTICES.md). `bun run assets:render` regenerates PNG icons and the native 1536×1024 social image.
