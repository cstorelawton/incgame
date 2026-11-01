# COMMON SIGNAL merchandising proof

Generated with the session image-generation tool on 2026-11-01. Original output `exec-f3ced7bb-f490-45c2-841c-e21d98679cdd.png` is preserved as `merchandising-original.png` (2172 × 724, true RGBA transparency).

The only supplied image reference was this project's original `fixture-display-basic.png`, used for cabinet geometry. Third-party retail project photographs were inspected separately for general merchandise organization, selective color placement, light fixture hierarchy, and apparel categories; no photograph, third-party logo, packaging, or store layout was copied into this image-generation input. This is original generated artwork, not an assertion of a commercial license to any studied photograph.

Art direction requested four separate basic modules at the same 1.6m wide × 0.45m deep × 1.6m high physical target, off-white `#F5F1E8` and charcoal `#202533` frames, selective cobalt `#3155E7` and orange `#F58245`, flat architectural illustration, upper-left diffuse daylight, no grain or baked glow. The existing store floorplan and circulation remain unchanged.

- `proof-display-flower`: mixed-size clear flower jars and cartons, original STRATA house-brand circle/stacked-band motifs, cobalt/cream identity, small matching display stand.
- `proof-display-edibles`: sealed orange/coral pouches and slim cartons, original SUNSHIFT sun-arc motifs, small matching display stand.
- `proof-display-concentrates`: charcoal/cobalt boxes and small concentrate containers, original VECTOR angular-chevron motifs, small matching display stand.
- `proof-merch`: two graphic tees, two caps, folded garments, and three paper shopping bags. The root art direction adopted the original circle plus two horizontal bands as the COMMON SIGNAL mark, matching the cream tee and cream bag.

No words, prices, UI text, location markers, people, floor, baseplate, or real branding are baked into the sprites. The approved source has approximate rather than mathematically exact isometric slopes; measured contact-corner slopes and original physical target dimensions are documented separately in `merchandising-extraction.json`.

Reproduce extraction from the repository root:

```sh
node public/art/architectural-proof/source/prepare-merchandising.cjs
```

The recipe retains the largest 8-connected alpha component per module and drops alpha below 8, removing detached dust. All four final PNGs have real transparent pixels. Normalized anchors refer to authored ground-footprint centers. Visible foot corners are sampled from the source; occluded back corners are inferred by parallelogram closure. Per-module scale factors calibrate visual fixture height to 1.6m at 72 vertical source-scene pixels per meter. Static animation metadata contains one frame. Original source remains unchanged.

The root inspected the generated sheet and approved extraction. An independent 390px-wide four-module proof was visually inspected after cleanup. Final acceptance still depends on inspection of the actual assembled city/store scene at phone size; this contact sheet is not a substitute for that check.
