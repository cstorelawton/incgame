# COMMON SIGNAL — architectural retail proof kit

Original reusable artwork for one Dispensary Inc. neighborhood and one storefront.
The accepted kit is indexed by `manifest.json`; `atlas.json` / `atlas.png` pack the
same 26 RGBA entries into a 4096×3584 texture. The game loads individual textures
with linear mipmaps, not both representations at once.

The ordinary building kit is reused around the unchanged Old Town properties.
Only Maple & Main receives the cobalt/orange storefront. The fixed interior shell
contains floor, walls, open entrance and sidewalk; fixtures, branding, lighting
and actual employee/customer actors remain separate. Starter and improved counters
share their socket and intended occupancy. A lighting upgrade adds independent
rendered channels to the existing product cabinets.

COMMON SIGNAL uses an original circle-over-two-bars symbol and outlined Manrope
wordmark. Cobalt and orange connect signage, counter panels, staff clothing, bags,
and merchandise. STRATA jars, SUNSHIFT pouches and VECTOR boxes distinguish the
three existing categories. These are visual identities, not new game inventory.

## Sources and reproduction

- `source/` retains generated raster originals and reproducible extraction recipes.
- `branding/svg/` contains editable original vector graphics with outlined glyphs.
- `branding/source/` rebuilds SVGs and PNGs using fontTools and Sharp.
- `city-contract.json`, `branded-building-contract.json`,
  `branded-counters-contract.json`, `fixtures-extraction.json`,
  `merchandising-extraction.json`, `interior-shell-metadata.json`, and
  `characters-manifest.json` record measured anchors, dimensions and physical targets.
- `scripts/prepare-art-proof.mjs` in the project rebuilds the shared manifest/atlas.
- `src/proofStoreLayout.ts` and `src/proofCity.ts` keep scene geometry separate from
  simulation. `scripts/check-art-layout.ts` audits the authored ground geometry.

Character IDs select sprites in the renderer. Art-direction ages in metadata do
not add employee age or progression systems to saves. Animation remains a small
visual-only transform rig. Raster sources are editable images; layered illustration
or skeletal-animation project files were not supplied by the generator.

## Geometry and rights

The common target is orthographic isometric with ±30° ground axes, upper-left
daylight, 3.2m stories, 2.1m doors, 1.75m adults and 1m counters. Generated rasters
approximate that projection; actual edge slopes and footprint anchors are recorded
rather than claimed to be exact CAD. Vector floor graphics use exact 30° axes.
Phone inspection and ground-polygon checks determine final placement.

Illustrations are original OpenAI image-generation outputs, governed by the
applicable OpenAI [Terms of Use](https://openai.com/policies/terms-of-use/) or
[Services Agreement](https://openai.com/policies/services-agreement/). This record
does not grant a new stock license or assert exclusive copyright. Individual
generation IDs and production edits are recorded in `CITY_ASSETS.md`,
`BRANDED_ASSETS.md`, `INTERIOR-PROVENANCE.md`, `CHARACTERS.md`, and the source notes.
The original wordmark uses Manrope under SIL OFL 1.1; its license is included in
the project and source download. No modified font binary is distributed.

Coffee Inc 2 screenshots and Cookies/Oregrown/Superette project photographs were
studied for principles. They are not included in runtime assets or the source
download, and no source logo, photograph, package artwork or city layout is reused.
