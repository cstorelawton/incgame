# COMMON SIGNAL storefront and checkout modules

Scope: one branded p1 storefront and two reusable counter states. Ordinary context
buildings, the accepted room shell, and the old fixture assets remain available.
No new city or room was generated.

## Reference study and original output

Before generation, the real retail photos in `docs/reference/dispensary-retail/`
were inspected: Cookies retail display, Oregrown retail room, and Superette retail
room. Observations used were disciplined brand-color blocks, mixed packaged
merchandise rather than only jars, commercial glass fixtures, and clear product
presentation. Their layouts, lettering, branded packages, and artwork were not
copied or supplied as generation inputs. Only this project's own architectural
building and counter assets were used as image-edit references.

COMMON SIGNAL's editable wordmark and symbol are separate vector overlays owned
by the root integration pass; generated sprites contain no lettering or fake text.
Palette direction: off-white `#F5F1E8`, charcoal `#202533`, cobalt `#3155E7`, and
warm orange `#F58245`.

| Retained source | Generation record | Purpose |
| --- | --- | --- |
| `source/building-shop-before-brand.png` | Existing accepted architectural proof | Exact pre-edit building pixels |
| `source/building-shop-brand-edit.png` | `exec-066308e5-39d5-4635-b1b7-8e842415cb1e` | Ground-floor color edit |
| `source/counters-branded-original.png` | `exec-27f1bb7f-d89c-4418-b694-6298f6af7d6e` | Starter and improved counter pair |
| `source/counter-improved-repaired.png` | `exec-142a5401-8291-4566-ba7d-485d9364b1ae` | Improved counter corner completion and padding |

AI-output usage follows the applicable account terms recorded in `docs/ART.md`.
These are original generated project assets, not downloaded commercial brand art.

## Storefront preservation and sign sockets

`building-shop-branded.png` keeps the accepted 584×601 canvas and its exact alpha
silhouette. The generator's color edit was aligned to that canvas and composited
only through an explicit ground-floor polygon. Validation found **zero changed
alpha pixels** and **zero changed RGBA channels outside the ground-floor mask**.
The original upper brick stories, roof, cornice and their pixels are preserved.

Use `branded-building-contract.json` for the unchanged ground anchor and measured
left/right blank fascia quads. Only p1 uses this branded sprite. p2, p3 and
noninteractive context retain ordinary building art. No wordmark is baked in.

## Counter contract

`branded-counters-contract.json` exposes `proof-counter-starter` and
`proof-counter-improved` with URLs, dimensions, center-of-ground anchors, visible
footprints, authored glass heights, and the intended common physical occupancy
of 2.4 × 0.7 × 1m. Use the same room socket and occupancy for both states.

- Starter: white powder-coated base, cobalt front, orange end accent, framed glass,
  jars/pouches/boxes, one POS, and two small paper bags.
- Improved: dark base, cobalt front, orange end accent, frameless glass, stepped
  product stands, mixed packaging, two POS terminals, and an unlit white LED channel.
- The improved source originally touched the image's bottom edge. The separate
  repair output supplies the complete plinth corner; the final integration PNG
  uses that repaired source.
- The physical glass-height target is 1m. At the existing 221.4-world-pixel display
  width, these rasters give approximately 70–72 vertical world pixels, matching
  the existing fixture reference closely.
- Generated projection is approximate: long base edges measure about 24° and26°,
  below the target30°. The contract exposes actual footprints; actual in-engine
  floor alignment remains a review point rather than an exact-CAD claim.
- The physical white LED channel is part of the module. Any light emission/glow
  remains a separate renderer overlay.

## Reproduction and inspection

```sh
node public/art/architectural-proof/source/prepare-branded-city.cjs
node public/art/architectural-proof/source/prepare-branded-counters.cjs
node public/art/architectural-proof/source/finalize-branded-counters.cjs
```

Sharp handles extraction, alpha cleanup, generated-edit alignment/masking, and
inspection copies. Original generated sources remain unchanged.

`branded-building-phone.png` was inspected at a 190px building width;
`branded-counters-phone.png` was inspected at 222px module widths. The branding,
mixed products, clean base silhouettes, and distinct upgrade materials remain
readable. These standalone proofs do not replace the final browser composition
and occlusion checks.
