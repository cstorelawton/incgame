# Basic architectural fixtures: source and extraction

Created with the session image-generation tool on 2026-11-01. Original generated file: `exec-153e4d49-5609-4a74-a453-9f4e5897f203.png`, retained here as `fixtures-original.png` (2081 × 756 RGBA). These are original generated assets. No third-party image was supplied to the generator and no third-party asset license is claimed. Coffee Inc 2 screenshots were studied separately for composition and scale; none of its artwork was used as generation input or copied into these sprites.

Requested art direction: exactly three separate basic dispensary fixtures, huge transparent gutters, original crisp architectural illustration, pale oak/off-white stone/sage/deep green, broad matte faces, restrained upper-left daylight, minimal texture/shadows. Orthographic camera azimuth 45° and elevation 35.264°, target ground axes ±30°, verticals vertical. No people, plants, floors, room, branding, leaf icons, text, or UI.

Requested modules:

1. Service counter: 2.4m wide × 0.7m deep × 1m high, pale oak base, thin deep-green trim, clear glass display with small jars, one discreet POS register at far end.
2. Product cabinet: 1.6m wide × 0.45m deep × 1.6m high, slender off-white/sage frame, orderly small jars and sealed boxes without legible labels.
3. Welcome podium: 0.8m wide × 0.5m deep × 1m high, light stone/oak and green, tiny flat tablet.

The generated source retains some restrained grain. Root inspected and approved it for phone assembly. Projection is approximate: sampled ground slopes are about +0.54 and −0.60 rather than exactly ±0.577; `fixtures-extraction.json` records measured values and physical targets separately. Do not describe the generated source as mathematically exact.

Run from the repository root:

```sh
node public/art/architectural-proof/source/prepare-fixtures.cjs
```

This extracts three separate RGBA sprites and their local metadata. It drops alpha values below 8 and retains only the largest 8-connected component per object, removing detached dust while preserving the original source. It does not touch the shared runtime manifest. Ground anchors are authored footprint centers; occluded back corners are inferred from the three visible plinth corners. Suggested scale factors match 72 source-scene pixels per vertical meter, using visible fixture height spans; verify them in the assembled room with a 1.75m adult.
