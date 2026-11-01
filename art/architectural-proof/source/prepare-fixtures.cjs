/* Reproducible extraction of original generated fixtures; no runtime/shared manifest edits. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const specs = [
  { id: 'fixture-counter-basic', region: { left: 0, top: 0, width: 850, height: 756 }, meters: { width: 2.4, depth: 0.7, height: 1 }, corners: [[69,410],[605,701],[745,617],[209,326]], topFrontLeft: [69,184] },
  { id: 'fixture-display-basic', region: { left: 850, top: 0, width: 700, height: 756 }, meters: { width: 1.6, depth: 0.45, height: 1.6 }, corners: [[1009,516],[1381,718],[1447,678],[1075,476]], topFrontLeft: [1009,51] },
  { id: 'fixture-welcome-basic', region: { left: 1550, top: 0, width: 531, height: 756 }, meters: { width: 0.8, depth: 0.5, height: 1 }, corners: [[1731,571],[1905,667],[2008,605],[1834,509]], topFrontLeft: [1731,333] },
];

(async () => {
  const manifest = {
    source: 'source/fixtures-original.png',
    sourceDimensions: { width: 2081, height: 756 },
    sourceKind: 'Original generated art; no Coffee Inc artwork used as an input',
    intendedProjection: { type: 'orthographic-isometric', azimuthDegrees: 45, elevationDegrees: 35.264, groundSlope: 0.57735 },
    notes: [
      'Ground corners are authored pixel samples of the visible plinth, ordered left/front/right/back; the occluded back corner is inferred by parallelogram closure.',
      'Ground anchor is the exact average of the four authored corners, not the bottom of the image.',
      'Desired world dimensions are art-direction targets. Generated projection/scale are approximate; measured ground slopes and visual height are provided for alignment.',
      'Alpha below 8 and all disconnected components except the largest are discarded; original source is retained unchanged.',
    ],
    sprites: {},
  };
  for (const spec of specs) {
    const { data, info } = await sharp(path.join(__dirname, 'fixtures-original.png')).extract(spec.region).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const size = info.width * info.height;
    const labels = new Int32Array(size);
    const queue = new Int32Array(size);
    let label = 0, largest = 0, largestCount = 0, removedComponents = 0;
    for (let at = 0; at < size; at++) {
      if (labels[at] || data[at * 4 + 3] < 8) continue;
      label++;
      let read = 0, write = 1;
      queue[0] = at; labels[at] = label;
      while (read < write) {
        const i = queue[read++], x = i % info.width, y = Math.floor(i / info.width);
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          if (!ox && !oy) continue;
          const nx = x + ox, ny = y + oy;
          if (nx < 0 || nx >= info.width || ny < 0 || ny >= info.height) continue;
          const n = ny * info.width + nx;
          if (!labels[n] && data[n * 4 + 3] >= 8) { labels[n] = label; queue[write++] = n; }
        }
      }
      if (write > largestCount) { largestCount = write; largest = label; }
    }
    let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
    for (let i = 0; i < size; i++) {
      if (labels[i] !== largest) { data[i * 4 + 3] = 0; continue; }
      const x = i % info.width, y = Math.floor(i / info.width);
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
    removedComponents = label - 1;
    const trim = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
    await sharp(data, { raw: info }).extract(trim).png().toFile(path.join(root, spec.id + '.png'));
    const sourceOrigin = { x: spec.region.left + minX, y: spec.region.top + minY };
    const footprint = spec.corners.map(([x,y]) => ({ x: x - sourceOrigin.x, y: y - sourceOrigin.y }));
    const anchor = { x: footprint.reduce((v,p)=>v+p.x,0)/4, y: footprint.reduce((v,p)=>v+p.y,0)/4 };
    const slope = (a,b) => (b[1]-a[1])/(b[0]-a[0]);
    const verticalSpan = spec.corners[0][1] - spec.topFrontLeft[1];
    manifest.sprites[spec.id] = {
      url: '/art/architectural-proof/' + spec.id + '.png', width: trim.width, height: trim.height,
      sourceRegion: spec.region, sourceOrigin, requestedWorldMeters: spec.meters,
      groundCorners: footprint, groundAnchorPixels: anchor,
      groundAnchorNormalized: { x: anchor.x / trim.width, y: anchor.y / trim.height },
      groundSlopesMeasured: { front: slope(spec.corners[0],spec.corners[1]), depth: slope(spec.corners[1],spec.corners[2]) },
      authoredVisualHeightPixels: verticalSpan,
      scaleFor72PixelsPerVerticalMeter: 72 * spec.meters.height / verticalSpan,
      animation: { type: 'static', frames: 1 },
      alphaCleanup: { minimumAlpha: 8, retainedConnectedComponents: 1, discardedComponents: removedComponents, retainedPixels: largestCount },
    };
  }
  fs.writeFileSync(path.join(root, 'fixtures-extraction.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify(manifest.sprites, null, 2));
})();
