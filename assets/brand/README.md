# Coffee identity

The owner approved the native peach ceramic cup, latte leaf, saucer and brass teaspoon on September 11, 2026. The independent rose/oat paper presentation uses broken cupping rings and short tasting spokes. Study `coffee/2026-09-11-01`, finishing `01`, is preserved in the sibling Hexly artwork archive, including the original icon, exact prompt, raw decision, extraction and all ten export sizes.

| File or consumer | Role |
| --- | --- |
| `../../logo.png` | Canonical 2048 px transparent master, exact selected bytes |
| `icon.png` | Square 2048 px presentation master |
| `icon-rounded.png` | Rounded 2048 px presentation; both README headers and the social header |
| `background.png` | Independent 2048 px paper field for the maskable platform derivative |
| `../../public/logo-80.png` | Transparent application mark used by the shared `Logo` component in the responsive header, footer, loading view and exhibition |
| `../../public/favicon-16.png`, `../../public/favicon.png` | Transparent browser icons at 16 and 32 px; the 404 page uses the 32 px asset |
| `../../public/icon-192.png`, `../../public/icon-512.png` | Square presentation for Apple touch and ordinary PWA icons |
| `../../public/icon-maskable-512.png` | Separate square PWA source: full paper background, the complete foreground uniformly placed at 94%, and an independent soft shadow |
| `../../public/og.png` | Existing 1536 × 1024 flavor-wheel social composition with the selected rounded mark |

Run `bun run assets:render` to regenerate the actual consumers with the existing Playwright renderer. Browser and application marks retain alpha and have no tile, CSS background or corner crop. At 16 px, the cup and handle silhouette carry recognition; the latte leaf and incised bean merge.

The standard foreground's farthest visible pixel is 856.84 px from the center of its 2048 px canvas. The maskable placement reduces this to 805.43 px, inside the 819.2 px safe radius. The platform background remains full bleed; a PWA mask may trim decorative paper and shadow outside that safe circle.

Native material samples, source hashes and the selected placement are recorded in Hexly's `palette.json` and finishing manifest. Exact master dimensions and checksums are in [source.json](source.json). Existing application theme tokens remain primary `#c7d9a9`, background `#f8f6f0`, and ink `#36352f`; the artwork does not redefine them.

Review: [Coffee identity](https://index.dev.hexly.ai/logos/coffee) and the local static study at `artwork/logo-family/coffee/2026-09-11-01/review.html`. This adoption is local; it does not establish a push or deployment.
