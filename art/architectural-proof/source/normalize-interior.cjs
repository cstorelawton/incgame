/* Reproduce the approved shell from its preserved generated source.
 * npm dependency: sharp. Run from any working directory with:
 * node public/art/architectural-proof/source/normalize-interior.cjs
 * Only alpha-channel housekeeping, not architectural redrawing.
 */
const path = require('node:path');
const sharp = require('sharp');
async function main() {
  const input = path.join(__dirname, 'interior-shell-corrected-original.png');
  const output = path.join(__dirname, '..', 'interior-shell.png');
  const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) throw new Error('Expected the preserved RGBA source.');
  let transparentPixels = 0;
  let opaquePixels = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      data[i] = data[i + 1] = data[i + 2] = 0;
      transparentPixels++;
    } else if (data[i + 3] >= 250) {
      data[i + 3] = 255;
      opaquePixels++;
    }
  }
  await sharp(data, { raw: info }).png().toFile(output);
  console.log(JSON.stringify({ output, width: info.width, height: info.height, transparentPixels, opaquePixels }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
