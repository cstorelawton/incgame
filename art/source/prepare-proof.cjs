const sharp = require('sharp');
const path = require('path');
const root = path.resolve(__dirname, '..');
(async () => {
  const input = path.join(__dirname, 'proof-original.png');
  const regions = {
    storefront: {left:0,top:0,width:635,height:625},
    interior: {left:635,top:0,width:619,height:625},
    checkout: {left:0,top:625,width:635,height:629},
    staff: {left:635,top:625,width:619,height:629},
  };
  const result={};
  for(const [name,region] of Object.entries(regions)) {
    const cropped=await sharp(input).extract(region).png().toBuffer();
    const trimmed=await sharp(cropped).trim({threshold:12}).png().toBuffer();
    await sharp(trimmed).toFile(path.join(root,name+'.png'));
    const m=await sharp(trimmed).metadata();
    result[name]={url:'/art/'+name+'.png',width:m.width,height:m.height,anchor:{x:.5,y:.96}};
  }
  require('fs').writeFileSync(path.join(root,'proof-manifest.json'),JSON.stringify(result,null,2));
  const assets=await Promise.all([
    ['interior',370,10,40],['checkout',126,93,219],['staff',31,230,235],['storefront',116,250,375]
  ].map(async ([n,w,left,top])=>({input:await sharp(path.join(root,n+'.png')).resize({width:w}).png().toBuffer(),left,top})));
  await sharp({create:{width:390,height:520,channels:4,background:'#eae8dc'}}).composite(assets).png().toFile(path.join(root,'proof-phone.png'));
  console.log(result);
})();
