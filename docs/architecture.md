# Architecture

coffee is a static, bilingual React application. Content, recommendations and personal
notes need no server API. Cloudflare Workers Static Assets distributes the Vite build;
the browser owns interaction state. This keeps the system understandable and prevents
private tasting notes from being sent to a service.

## Information architecture

| Route | Main task | Useful deep links |
| --- | --- | --- |
| `/` | Explore the original hierarchical 3D flavor wheel and dictionary | `?flavor=jasmine` |
| `/origins` | Compare countries, illustrative regions, processes and varieties | `?origin=ethiopia` |
| `/brew` | Select a method, calculate a recipe and get preference-based suggestions | `?method=v60&origin=ethiopia&process=washed&roast=light` |
| `/learn` | Follow a learning path, read an article, compare materials, take a quiz | `?article=water`; `?topic=processes&item=washed` |
| `/journal` | Write, save, edit, copy or export a personal sensory record | Local records only |
| `/display` | Run an unattended 18-stop, 12-second exhibition | `?lang=en` supported on every route |

Global search spans flavors, origins, methods, articles, varieties, processes and roasts.
Type, family, continent and processing filters combine with AND semantics. A result opens
the actual selected item, with its content in the current language. Query matching searches
both languages. The original names of brands, species and source organizations remain intact.

## Rendering and loading

Vite 8 + React 19 + strict TypeScript produce the application shell. Secondary pages use
`React.lazy`. Three.js and React Three Fiber live in a separate dynamically requested engine
chunk, with the small scene implementation separate again. The dictionary is shared by
search, recommendation, journal validation and the wheel; duplicating it across separate
API payloads would provide little benefit at this scale.

The 3D wheel consists of 128 individually selectable, extruded wedges: 8 family sectors,
24 group sectors and 96 flavor sectors. A lathed ceramic cup and small procedural fruit,
flower, leaf or bean objects reinforce the selected family. R3F raycasting maps mesh
selection to the content graph. Rotation and zoom also have ordinary HTML buttons.
There are no textures, HDR environments, remote models or post-processing pipelines.

| Device / condition | Rendering behavior |
| --- | --- |
| Visible desktop, motion allowed | Demand renderer invalidated about 30 times per second; subtle tilt only |
| Mobile, ≤700 CSS px | DPR 1, fewer geometry segments, no antialiasing, demand rendering |
| Desktop | DPR capped at 1.5, no shadow maps |
| Reduced motion (system or preference) | No continuous 3D animation; CSS transitions/animations and smooth scrolling reduced |
| Hidden tab / offscreen wheel | Continuous invalidation stops; hidden exhibition timers and sound suspend |
| Explicit lightweight mode, Save-Data, ≤2 logical processors, missing WebGL2 | SVG wheel; engine download avoided |
| Graphics failure or WebGL context loss | SVG fallback with the same flavor selection and controls |

Mobile keeps the useful 3D model when capable, but does not animate continuously. Keyboard
users can choose every flavor from the HTML dictionary or SVG links. The 3D implementation
does not pretend that a canvas alone provides accessible semantics.

## State and storage

`CoffeeProvider` uses the native History API, validated local preferences and ordinary React
state. There is no routing or state-management dependency. Normal links retain modifier-click
and open-in-new-tab behavior. Forward/back navigation restores the selected route.

- `coffee.preferences.v1`: locale, theme, contrast, reduced motion, lightweight graphics,
  favorite flavor IDs and completed article IDs. Unknown IDs are discarded; malformed values
  fall back to defaults. Language changes replace the active `lang` parameter as well as
  saving the preference, so reload cannot restore a stale query language.
- `coffee.journal.v1`: versioned local records, up to 200. Runtime validation checks dates,
  quantities, unique IDs, enums, flavor references and intensity bounds. A failed write never
  reports success. Invalid stored data is preserved for raw backup; another save cannot
  overwrite it silently. Storage events refresh the visible list in other tabs.
- Unsaved form fields, flavors and the edited record's identity survive SPA navigation
  within the visit. Refresh keeps explicitly saved records; it does not auto-save drafts.
- Generated audio, live exhibition position and quiz answers are session state. Sound
  permission is deliberately not remembered across reloads.

Journal export escapes Markdown control characters. JSON backup contains only records the
user created. There is no import UI, user account, analytics SDK, third-party cookie or cloud
storage. These are current product boundaries, not unfinished backend stubs.

## Audio and exhibition

`useAmbientSound` creates its first `AudioContext` inside the user's button handler.
Three low-volume sine voices with slow amplitude modulation form the ambience; a brief
enveloped oscillator provides selection feedback. A master gain controls volume. Muting
suspends the context; unmounting closes it. No music file or sound library is involved.
Exhibition playback starts muted and runs without input. Pause, next/previous, direct stop
selection, theme, language, fullscreen and exit remain available.

## Delivery, accessibility and resource budgets

The app uses self-hosted Latin fonts plus system CJK fallbacks, three color-token themes,
visible focus styles, native labels/dialogs/fieldsets, live calculation results, accessible
names, a skip link and reduced-motion rules. Automated WCAG A/AA checks run on six routes,
three themes and both desktop/mobile viewports. They complement, rather than replace,
human review of reading order, legibility and interactions.

`scripts/check-budgets.mjs` fails the build above these limits:

| Resource | Limit |
| --- | --- |
| All JavaScript, including every lazy route and Three | 460 KiB gzip |
| Lazy Three + R3F engine | 250 KiB gzip |
| Main entry and shared bilingual content | 100 KiB gzip |
| Styles | 20 KiB gzip |
| All WOFF2 fonts | 100 KiB raw |

Gzip is a reproducible local comparison, not a claim about every CDN response encoding.
Vite's generic 500 kB uncompressed chunk warning remains visible for Three. It is accepted
because Three is the central interactive renderer, lazy, bounded and avoidable in 2D mode.

The static CSP allows local modules, fonts and assets, React's inline styles, and local
Blob downloads; it forbids remote scripts, plugins, framing and arbitrary form targets.
Hashed assets use immutable caching. Font filenames are currently stable: rename them
when updating font bytes because their cache headers are immutable too.

HTML uses `Cache-Control: public, max-age=0, must-revalidate, no-transform`. The `no-transform`
directive prevents automatic Cloudflare analytics-beacon injection, keeping this app's
self-only script policy and local-data behavior intact. Asset/font rules replace that
header with immutable caching. Vite emits the actual bundled dependency licenses as
`oss-licenses.txt`, accessible from Sources & credits.

## Checks

Vitest verifies graph and locale integrity, arithmetic, recommendation constraints,
cross-language filters and storage failure paths. Playwright checks real mesh clicks,
persistence, search-to-detail navigation, recipe-to-journal flow, copying/downloading,
edit identity, learning, automatic exhibition and Web Audio consent. CI runs the static
asset deployment dry-run but does not have production credentials or deploy automatically.

See [content model](content-model.md), [research](research-sources.md) and
[deployment](deployment.md) for the other contracts.
