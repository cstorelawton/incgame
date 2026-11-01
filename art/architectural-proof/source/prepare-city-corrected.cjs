const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'..');
const input=path.join(__dirname,'city-buildings-corrected.png');
const regions={
  'building-shop-corrected':{left:0,top:0,width:680,height:793},
  'building-apartments-corrected':{left:680,top:0,width:490,height:793},
  'building-office-corrected':{left:1170,top:0,width:813,height:793}
};
(async()=>{
 const result={};
 for(const [name,region] of Object.entries(regions)){
  const cropped=await sharp(input).extract(region).png().toBuffer();
  const decoded=await sharp(cropped).raw().toBuffer({resolveWithObject:true});
  const raw=decoded.data,w=decoded.info.width,h=decoded.info.height,seen=new Uint8Array(w*h);let main=[];
  for(let p=0;p<w*h;p++){if(seen[p]||raw[p*4+3]<6)continue;const group=[p];seen[p]=1;for(let i=0;i<group.length;i++){let v=group[i],x=v%w,y=Math.floor(v/w);for(const n of [x>0?v-1:-1,x<w-1?v+1:-1,y>0?v-w:-1,y<h-1?v+w:-1])if(n>=0&&!seen[n]&&raw[n*4+3]>=6){seen[n]=1;group.push(n)}}if(group.length>main.length)main=group;}
  const mask=new Uint8Array(w*h);for(const v of main){const x=v%w,y=Math.floor(v/w);for(let yy=Math.max(0,y-2);yy<=Math.min(h-1,y+2);yy++)for(let xx=Math.max(0,x-2);xx<=Math.min(w-1,x+2);xx++)mask[yy*w+xx]=1;}
  for(let p=0;p<w*h;p++)if(!mask[p])raw[p*4+3]=0;
  const clean=await sharp(raw,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
  const {data,info}=await sharp(clean).trim({threshold:12}).png().toBuffer({resolveWithObject:true});
  await sharp(data).toFile(path.join(root,name+'.png'));
  result[name]={url:'/art/architectural-proof/'+name+'.png',width:info.width,height:info.height,sourceRegion:region,trimOffset:{x:-(info.trimOffsetLeft||0),y:-(info.trimOffsetTop||0)}};
 }
 fs.writeFileSync(path.join(root,'city-corrected-extraction.json'),JSON.stringify(result,null,2));
 console.log(result);
 const overlays=await Promise.all([
  ['building-shop-corrected',168,18,145],['building-apartments-corrected',113,208,50],['building-office-corrected',195,156,317]
 ].map(async([name,width,left,top])=>({input:await sharp(path.join(root,name+'.png')).resize({width}).png().toBuffer(),left,top})));
 await sharp({create:{width:390,height:560,channels:4,background:'#e9e5db'}}).composite(overlays).png().toFile(path.join(root,'city-corrected-phone-proof.png'));
})();
