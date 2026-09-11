# Content model and editorial contract

All maintained product prose lives in TypeScript data or explicit `{ zh, en }` values.
`Localized` requires both locales at compile time. `b(zh, en)` is a short constructor, not
a translation fallback. Missing English never silently displays Chinese, or vice versa.

## Collections

| Collection | Count | Required information |
| --- | ---: | --- |
| Families | 8 | Stable ID, bilingual name/subtitle/description, original color and symbol |
| Flavor groups | 24 | Family ID and bilingual name/description |
| Flavors | 96 | Family/group, name, description, everyday reference, distinction, 3 related IDs, sources |
| Origins | 23 | Name, illustrative regions/elevation, map coordinate, species/varieties, processes, flavor associations, context, sources |
| Methods | 10 | Category, input-water or beverage-yield ratio, dose, ranges, grind, ≥4 steps, tip, caution, sources |
| Varieties / species groups | 15 | Name, species, contextual agronomic description, sources |
| Processes | 7 | Name, process description, possible effect, sources |
| Roast categories | 4 | Name, description, adjustment tip |
| Knowledge articles | 30 | Sensory/extraction/cupping/defects category, summary, body, practical exercise, sources |
| Learning paths | 2 | Audience, description, duration, 7 ordered lesson IDs and matching exercises |
| Quiz | 6 | Question, options, correct index and an explanation, all bilingual |
| Source registry | 20 | Stable key, original organization/publication name, HTTPS URL, bilingual citation scope |

The flavor hierarchy is an original educational arrangement, not an implementation of
the WCR's 110 attributes or a reproduction of the SCA wheel. Families have different numbers
of groups. Every group currently has four descriptors; each family receives an equal visual
sector and its subdivisions are computed from actual group and leaf counts.

Origins represent countries with examples of regions. Their map coordinates are illustrative
label locations, not farm coordinates or national centroids. Growing-elevation bands describe
examples, not a country's complete minimum and maximum. The Asia-Pacific browsing group
includes Papua New Guinea; it is not a political or botanical classification.

## Meaning of the numbers

The journal's acidity, sweetness, bitterness and body values are personal **descriptive
intensity** on a 1–5 practice scale. Liking is a separate 1–5 question. Neither is an official
quality score or a converted CVA score. The journal is not an SCA form.

Origin acidity/body values are editorial matching hints on the same bounded integer range.
They are not research measurements, official country ratings, predictions or a ranked list
of coffee quality. A lot's variety, climate, harvest, process, storage, roast and preparation
can substantially change the cup. Those caveats are visible in the product.

`recommend()` first respects the requested processing filter, then scores candidate origins:

```text
6 points when a linked flavor matches the preferred family
+ 10 − absolute acidity distance − absolute body distance
```

Stable origin ID breaks ties. The top three results retain the selected roast and a supported
process. Body preference ≥4 suggests French press; otherwise V60 is the first exploration
method. Explanations show why an origin was included. This is intentionally a readable starting
rule, with no fabricated inventory, commercial bean products, machine-learning confidence
or promise that a roast will preserve a specific aroma.

For the calculator, `amount` is **per recipe serving**. `water = coffee × ratio`; reversing
the basis calculates `coffee = water ÷ ratio`, then multiplies both by the number of servings.
Espresso uses the same arithmetic but labels the second mass as **beverage yield**.
Other recipes use **input water**, not final cup weight. The helper preserves precision;
display rounds to one decimal, while journal fields accept fractional imported doses.
Counts must be integers 1–20, ratio 1–30, coffee 0.1–1000 g per serving and total mass ≤10 kg.
Method sliders further narrow the ratio to the relevant starting range.

Recipe numbers are editorial practice ranges, except identified cupping parameters.
Cold-brew figures refer to refrigerated brewing; moka temperature means starting boiler
water, not coffee-bed temperature. Vessel capacity and the manufacturer's directions take
priority over calculator scaling. The detailed source distinctions are in the research document.

## Adding or changing content

1. Read the original publication or manufacturer's guide and note its date and reuse terms.
2. Add or update the source registry and the scope in `docs/research-sources.md`. A source
   proves only the stated facts, not every editorial exercise placed beside it.
3. Write both languages, including cautions and exercises. Use “some lots”, “may” and
   “starting point” where appropriate. Keep aroma, taste, mouthfeel and personal liking distinct.
4. Add stable kebab-case IDs, valid relationships and source keys. Avoid changing IDs of
   published flavors without a storage migration, because local notes reference them.
5. Run `bun run validate`. `tests/data.test.ts` recursively validates locale pairs and
   nonempty strings, checks namespace uniqueness, parent/related/source links, geographical
   bounds, recipe ranges, lesson references and quiz indices. TypeScript strict additionally
   enforces every required field.
6. Check the new material in both languages and follow its search/deep link. Run relevant
   browser tests if behavior or layout changes. Update collection counts when deliberately
   expanding the catalogue rather than weakening integrity checks.

Do not add scraped text, official diagrams, copyrighted forms or branded images to `public/`.
The repository's MIT license covers our original expression; it cannot relicense third-party
research merely because it is linked.
