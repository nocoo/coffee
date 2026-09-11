# Credits and licenses

Original application code, bilingual educational prose, the custom flavor hierarchy,
procedural models, illustrations, logo and generated social-card artwork are licensed
under the [MIT License](LICENSE). This grant covers our work, not the referenced
organizations' publications, trademarks or designs.

| Included material | Author / source | License and treatment |
| --- | --- | --- |
| DM Sans Latin WOFF2 | The DM Sans Project Authors; [googlefonts/dm-fonts](https://github.com/googlefonts/dm-fonts) | SIL Open Font License 1.1; preserved in [DM-Sans-OFL.txt](public/fonts/DM-Sans-OFL.txt) |
| Instrument Serif regular and italic Latin WOFF2 | The Instrument Serif Project Authors; [Instrument/instrument-serif](https://github.com/Instrument/instrument-serif) | SIL Open Font License 1.1; preserved in [Instrument-Serif-OFL.txt](public/fonts/Instrument-Serif-OFL.txt) |
| Simplified world land geometry | [Natural Earth, 1:110m land](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/) | [Public domain](https://www.naturalearthdata.com/about/terms-of-use/); reprojected and rounded into `src/data/world-map.json` |
| React / React DOM | Meta and contributors | MIT; package license files retained by the package manager |
| Three.js | Three.js authors | MIT |
| React Three Fiber | Poimandres contributors | MIT |
| Lucide icons | Lucide contributors | ISC; derived Feather portions retain their MIT notices in the package |

The fonts are self-hosted. System CJK fonts are used as available and are not redistributed.
The `bun.lock` file records the complete dependency set; individual packages retain their
own licenses, including development tools. There are no downloaded photographs, licensed
music files or remotely hosted fonts in the product.

Each production build also emits [`/oss-licenses.txt`](https://coffee.hexly.ai/oss-licenses.txt)
through Vite's dependency-license collector. It includes the full license texts and copyright
notices found in the packages actually bundled, and is linked from the in-app Sources & credits panel.
The Fiber npm package omits its full license file, so its [v9.7.0 upstream MIT notice](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/LICENSE)
is additionally preserved at [`/react-three-fiber-license.txt`](public/react-three-fiber-license.txt)
and linked from the same panel.

WCR, SCA, CQI, ICO, the national agencies and manufacturers are factual references, not
sponsors. We do not distribute the SCA flavor-wheel artwork, WCR definitions or intensity
reference recipes, SCA standard PDFs, official assessment forms, manufacturer images,
or origin-guide prose. Ordinary flavor names and facts are expressed through original
wording and an original visual arrangement. Downloaded research files are excluded from Git.

The research discussion cites Batali, Ristenpart & Guinard (2020), *Brew temperature, at
fixed brew strength and extraction, has little impact on the sensory profile of drip
brew coffee*, Scientific Reports 10, 16450,
[doi:10.1038/s41598-020-73341-4](https://doi.org/10.1038/s41598-020-73341-4),
licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Our summaries and
translations are adaptations; no paper figures are reproduced. The authors do not endorse this app.

Full scope, access dates and limitations are in [research-sources.md](docs/research-sources.md).
