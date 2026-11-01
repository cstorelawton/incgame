const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const contract=JSON.parse(fs.readFileSync(path.join(root,'brand-contract.json'),'utf8'));
 for(const [key,asset] of Object.entries(contract.assets)){
  const file=path.join(root,key+'.png');
  await sharp(path.join(root,'svg',key+'.svg')).png().toFile(file);
  const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let minX=info.width,minY=info.height,maxX=-1,maxY=-1,zero=0,maximumAlpha=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
   const alpha=data[(y*info.width+x)*4+3];maximumAlpha=Math.max(maximumAlpha,alpha);
   if(!alpha){zero++;continue;}minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
  }
  asset.alphaBounds={x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1};
  asset.alphaValidation={transparentPixels:zero,maximumAlpha,channels:info.channels};
  console.log(key,info.width,info.height,'transparent',zero,'alphaMax',maximumAlpha);
 }
 fs.writeFileSync(path.join(root,'brand-contract.json'),JSON.stringify(contract,null,2)+'\n');
 const overlays=[];
 overlays.push({input:await sharp({create:{width:390,height:100,channels:4,background:'#202533'}}).png().toBuffer(),left:0,top:0});
 const layout=[['proof-brand-wordmark',370,10,15],['proof-brand-sign',360,15,117],['proof-brand-mark',72,23,276],['proof-menu-panel',260,115,266],['proof-brand-floor',360,15,430]];
 for(const [key,width,left,top] of layout)overlays.push({input:await sharp(path.join(root,key+'.png')).resize({width}).png().toBuffer(),left,top});
 overlays.push({input:await sharp({create:{width:360,height:120,channels:4,background:'#202533'}}).png().toBuffer(),left:15,top:670});
 overlays.push({input:await sharp(path.join(root,'proof-brand-glow.png')).resize({width:360}).png().toBuffer(),left:15,top:670});
 await sharp({create:{width:390,height:810,channels:4,background:'#e6e3dc'}}).composite(overlays).png().toFile(path.join(root,'brand-contact-phone.png'));
})().catch(e=>{console.error(e);process.exitCode=1;});
