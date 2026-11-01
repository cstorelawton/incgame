# COMMON SIGNAL original identity

An original vector identity for the fictional chain: a circle above two horizontal bars, bold outlined capitals, off-white `#F5F1E8`, charcoal `#202533`, cobalt `#3155E7`, and orange `#F58245`. The mark continues the original cream-tee and cream-bag motif in the accepted merchandise sheet. STRATA is the house-brand flower identity; SUNSHIFT and VECTOR retain their separate fictional product motifs.

The editable SVG assets contain paths, not runtime text. Glyph outlines are generated from the project's Manrope variable font instantiated at weight 800. Manrope is Copyright 2018 The Manrope Project Authors, licensed under the [SIL Open Font License 1.1](../../../fonts/Manrope-OFL.txt). No third-party logo, retail photo, or game artwork was copied into these original identity assets. No modified font binary is distributed here.

## Assets

- `proof-brand-wordmark`: white horizontal COMMON SIGNAL capitals with an orange mark, transparent, for storefront fascia overlays.
- `proof-brand-mark`: cobalt symbol with true transparency, suitable for original packaging and merchandise.
- `proof-brand-sign`: cobalt feature-wall panel, white two-line wordmark, orange symbol, and slim white keyline. Flat artwork; the renderer applies the wall projection.
- `proof-brand-glow`: separate low-opacity edge/symbol glow on transparency, exactly matching the sign dimensions and anchor. No room, furniture, opaque backing, or animation is baked in. Its maximum raster alpha is 56/255; keep runtime intensity restrained.
- `proof-brand-floor`: original planar border inlay/mat with the mark, already projected with exact ±30° ground axes. It is a floor graphic, not furniture. Do not apply a wall-plane skew to it.
- `proof-menu-panel`: physical category sign reading FLOWER, EDIBLES, CONCENTRATES with matching original color/motif chips. It contains no prices, invented SKUs, or controls.

`brand-contract.json` records PNG/SVG URLs, exact dimensions, centered anchors, alpha bounds and validation, floor projection, and a pointer to `../branded-building-contract.json` for the existing two storefront wordmark-face quads. No building geometry is changed by this artwork. Use actual alpha bounds when trimming the horizontal wordmark's transparent margins for fascia placement.

## Rebuild and inspection

From the repository root:

```sh
python3 public/art/architectural-proof/branding/source/build-brand.py
```

The script uses `fontTools` (`SVGPathPen` and variable-font instancing) and then Sharp to render the editable SVGs into PNGs. It also regenerates the contract and `brand-contact-phone.png`, a 390px-wide art review sheet. These are standard original vector graphics, not generated illustrations.

The phone contact sheet and full-resolution feature sign were inspected directly after rendering. All text is crisp and unclipped. Alpha and dimensions were verified for all six assets; the floor's mathematically defined projection is recorded in the contract. Final scene placement still requires inspection in the game, especially both city fascia faces and the projected feature wall.
