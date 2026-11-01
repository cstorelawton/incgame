# Architectural city proof: three-building kit

## Scope and source

Three original reusable building sprites only, for a focused in-engine visual proof.
Existing `public/art` assets and its shared manifest are unchanged. This proof is
not a replacement claim for every game asset or a completed architectural art pass.

Official Side Labs Coffee Inc. 2 screenshots `docs/reference/coffee-inc2/ci2-01-en.png`,
`ci2-02-en.png`, and `ci2-03-en.png` were visually studied for general architectural
scale, restrained daytime color, precise repeated windows, ordinary story/door
proportions, and coherent projection. Their buildings, layouts, assets, logos and
branding were not copied. They were not supplied as image-generation references;
new generation used textual direction. Only this project's own new output was
used as the subsequent edit reference.

Original source sheets are retained unchanged in `source/`:

| Source | Generation record | Role |
| --- | --- | --- |
| `city-buildings-original.png` | `exec-40ae2d4c-de75-4e2e-9650-68e753f95851` | Initial three original designs |
| `city-buildings-corrected.png` | `exec-a52e265e-b6ec-43c9-8808-8e438b268291` | Flatter material treatment and improved common projection; accepted shop and apartments |
| `city-office-repaired.png` | `exec-e16f367d-61b6-424a-8d4e-249b59f8e8ae` | Office-only edit completing a clipped bottom corner, with transparent padding |

Usage follows the original AI-output provenance and applicable OpenAI account
terms described in `docs/ART.md`; these are not third-party stock or game assets.

## Accepted integration files

Use `city-contract.json` for dimensions, URLs, precise normalized anchors, visible
pixel ground polygons, and inferred hidden vertices. Unlike the original kit,
these buildings must not use a blanket `(0.5, 0.96)` anchor.

- `building-shop-corrected.png`: three-story brick/limestone mixed-use corner,
  deep-green ground-floor storefront; ground contact at `(297, 598)` in 584×601.
- `building-apartments-corrected.png`: narrow five-story cream apartment frontage;
  ground contact at `(237, 742)` in 427×744.
- `building-office-final.png`: three-story broad slate office/shop glazing;
  ground contact at `(670, 1076)` in 1015×1078.
- `city-atlas.png` / `city-atlas.json`: packed atlas for the same three final sprites.
- `city-final-phone-proof.png`: final standalone sprite inspection at 390×560,
  with widths of 168, 113, and 195px. This is art inspection, not an in-engine screenshot.

The original office generation brief requested four stories. Visual verification of
the final PNG shows three: ground-floor glazing and two upper window rows. The
contract records this observed count rather than the requested count. Source
images and generation history are retained unchanged.

No roads, sidewalks, buildings' ground tiles, cast ground shadows, people, text,
icons, baked upgrades, or gameplay markers are included. Flat roofs and sparse HVAC
are architectural features. Story count, footprint, and entrance scale remain
visible when placed among surrounding city context.

## Projection measurement and limits

Target: true orthographic isometric, azimuth 45°, elevation 35.264°, world-ground
axes at ±30° (slope ±0.577). This is generated architectural illustration, not a
mechanically exact CAD export. Measured visible base slopes are approximately
0.53–0.64 (about 28–33°), with variation at projecting plinths and the shop's
chamfered entrance. These actual limits are preserved in the contract; exact camera
compliance is not claimed. Use the renderer's common 30° street plane and review
obvious mismatches at normal phone size.

The first corrected office sheet clipped several pixels of its front ground
corner. It is retained for provenance but is not the integration asset. The final
office-only edit shows the complete corner with clear surrounding alpha.

## Reproduction

```sh
node public/art/architectural-proof/source/prepare-city.cjs
node public/art/architectural-proof/source/prepare-city-corrected.cjs
node public/art/architectural-proof/source/prepare-city-final.cjs
```

Node plus Sharp are required. Recipes only crop, clean disconnected alpha noise,
resize inspection/atlas copies, and pack textures. They do not geometrically warp
or redraw the source buildings. The full alpha sources remain available.
