const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'..');
const input=path.join(__dirname,'city-buildings-original.png');
const regions={
  'building-shop':{left:0,top:0,width:680,height:793},
  'building-apartments':{left:680,top:0,width:490,height:793},
  'building-office':{left:1170,top:0,width:813,height:793}
};
(async()=>{
 const result={};
 for(const [name,region] of Object.entries(regions)){
  const cropped=await sharp(input).extract(region).png().toBuffer();
  const {data,info}=await sharp(cropped).trim({threshold:12}).png().toBuffer({resolveWithObject:true});
  await sharp(data).toFile(path.join(root,name+'.png'));
  result[name]={url:'/art/architectural-proof/'+name+'.png',width:info.width,height:info.height,sourceRegion:region,trimOffset:{x:-(info.trimOffsetLeft||0),y:-(info.trimOffsetTop||0)}};
 }
 fs.writeFileSync(path.join(root,'city-extraction.json'),JSON.stringify(result,null,2));
 console.log(result);
 const overlays=await Promise.all([
  ['building-shop',168,18,145],['building-apartments',113,208,50],['building-office',195,156,317]
 ].map(async([name,width,left,top])=>({input:await sharp(path.join(root,name+'.png')).resize({width}).png().toBuffer(),left,top})));
 await sharp({create:{width:390,height:560,channels:4,background:'#e9e5db'}}).composite(overlays).png().toFile(path.join(root,'city-phone-proof.png'));
})();
