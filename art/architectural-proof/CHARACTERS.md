# Common Signal adult character sprites

This small original lineup replaces the old apron-based appearance for the
architectural proof while preserving employee IDs, roles, assignments, customers,
and all economic rules. It contains four core staff/owner looks and two adult
customers, all with ordinary adult proportions and a consistent elevated camera.

| Runtime key | Original visual design | Trimmed pixels |
| --- | --- | --- |
| `proof-staff-1` | Adult27, natural curls, cobalt tee, black trousers, white sneakers | 229×716 |
| `proof-staff-2` | Adult26, beanie, charcoal hoodie/orange panel, cargo trousers | 264×760 |
| `proof-staff-3` | Adult28, cap, cream tee/cobalt overshirt, jeans, forearm tattoo | 232×731 |
| `proof-manager` | Adult35, stone overshirt/cobalt tee, dark jeans, sneakers | 277×770 |
| `proof-customer-1` | Adult34, rust jacket, cream top, black trousers | 234×729 |
| `proof-customer-2` | Adult53, gray hair, teal shirt/light jacket, dark trousers | 260×739 |

These are visual archetypes, not new named employees. The renderer maps the
existing assigned employee IDs to variants deterministically. Do not spawn extra
staff as decoration. The manager and owner use the same ordinary human scale as
other people; role differences do not imply larger bodies.

## Provenance and source handling

Generated specifically for this project using OpenAI image generation:

- `source/characters-lineup-original.png`: generation
  `exec-cc9e7d5c-a2e6-420e-a9c0-c11bae23213a`.
- `source/characters-lineup-clean-original.png`: narrow edit removing unintended
  vendor-like sneaker marks, generation
  `exec-5b7f584d-fb51-4af9-b7b8-8a3ea4879a1d`.

Both source images are preserved unchanged. The first generation was original,
with no external image supplied to the generator. The edit referenced only our
own initial lineup. Official Coffee Inc.2 imagery was studied for adult scale and
camera principles only. Oregrown apparel photographs were studied for clothing
categories (tees, hoodies, caps, overshirts); those photographs contain no people.
These fictional character designs do not depict actual photographed staff and do
not copy any source brand's graphics or uniforms. No source photograph or game
artwork is a runtime asset.

The outputs are not third-party stock images and are not newly licensed under
Creative Commons. Their use is governed by the OpenAI terms applicable to the
generating account; this record does not assert exclusive copyright or grant a
new license. No shoe/vendor logos remain in the approved cleaned sprites.

## Reproduce and integrate

```sh
node public/art/architectural-proof/source/prepare-characters.cjs
```

The Sharp recipe performs cropping, connected-component/alpha housekeeping, and
packing only. It does not redraw character anatomy or invent additional frames.
The original sheet's six separate figures become six individual RGBA PNGs and a
1024×2048 atlas. Alpha below8 and disconnected extraction specks are removed;
near-opaque alpha250–254 becomes255, and ordinary antialiased edges remain.

`characters-extraction.json` records every crop, source origin, authored left/right
sole contact, and exact resulting normalized foot anchor. The anchor is the
arithmetic midpoint of the two authored ground contacts, not an arbitrary image
bottom centre. `characters-manifest.json` exposes these anchors and dimensions.
Use the existing scene-wide person height divided by the individual texture height;
do not size the manager differently or use a shared arbitrary texture width.

There is one idle frame per person. Existing restrained idle/walk transform loops
are retained; no new directional walk cycle is claimed. Animation remains purely
visual and must not create customers or revenue.

The inspection image `docs/screenshots/art-direction/common-signal-characters-lineup.png`
labels the four core looks and two customers for documentation only. No labels,
UI, names, or wordmarks are baked into the six runtime actor PNGs. Final browser
inspection must still check scale, occupied work positions, and depth ordering.
