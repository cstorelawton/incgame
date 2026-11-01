# Architectural interior proof

Accepted by the implementation lead for in-engine assembly on 2026-11-01.
This is a new empty architectural shell for the p1 proof, not a furnished room.
All counters, displays, check-in stations, staff, customers, products, and upgrades
remain separate renderer modules.

## Original sources

Generated with the OpenAI image-generation tool in this session:

- `source/interior-shell-original.png`: initial generated architectural candidate,
  generation `exec-00865db3-21fb-43c3-b8c0-7c31eb011bc1`.
- `source/interior-shell-corrected-original.png`: edit of our initial candidate,
  generation `exec-22cb3c93-3a4f-45db-82cd-3906858ed7d5`.

The initial request was a new generation with no image reference supplied. Official
Coffee Inc. 2 screenshots were studied for broad architectural principles only:
ordinary human scale, orthographic planes, restrained shading, and an urban street
context. No screenshot, artwork, layout, brand, or logo from that game was fed into
the generation or copied into this asset. The correction referenced only our own
initial generated candidate.

The correction removed material grain, simplified the floor to regular seam lines,
removed the secondary rear door, and made the front entrance one complete connected
portal with its glass leaf open toward the sidewalk. Both generated originals are
preserved unchanged; layered illustration sources are not supplied by the generator.

These are original AI-generated outputs, not third-party stock art. Use is governed
by the OpenAI terms applicable to the generating account; this file does not grant a
new license or assert exclusive copyright. No third-party game assets ship here.

## Production and geometry

`source/normalize-interior.cjs` reproduces `interior-shell.png` from the corrected
source using Sharp. It clears hidden RGB where alpha is already zero, normalizes
near-opaque alpha 250–254 to 255, and retains ordinary antialiased edges. It does not
redraw geometry, remove floors, fabricate a doorway, or alter the visible palette.
The approved output has 734,286 fully transparent pixels and 821,421 opaque pixels.

The full sprite is 1536 × 1024. Target projection is orthographic isometric with
30-degree ground axes; the generator's geometry is an artist-rendered approximation,
not mechanically exact CAD. Estimated floor corners, door threshold, wall height,
actor scale, and suggested module sockets are in `interior-shell-metadata.json`.
Socket placement must be checked with real fixtures before scene acceptance.

The floor occupies a roughly 10m × 8m commercial footprint. The 3.2m rear walls have
an observed vertical height of about 226 source pixels; a 1.75m adult is therefore
about 124 source pixels tall before scene scaling. No oversized miniature people
or fixtures are implied. The sidewalk and thin street strip belong to the fixed
shell. The entrance portal is currently baked into the architectural layer; any
foreground extraction required by the renderer must preserve its exact alpha and
avoid covering the floor with an opaque crop.
