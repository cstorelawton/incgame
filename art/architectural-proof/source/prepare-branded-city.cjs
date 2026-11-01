const sharp=require('sharp'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
function contains(point,polygon){let c=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [xi,yi]=polygon[i],[xj,yj]=polygon[j];if(((yi>point[1])!==(yj>point[1]))&&point[0]<(xj-xi)*(point[1]-yi)/(yj-yi)+xi)c=!c;}return c;}
(async()=>{
 const {data:original,info}=await sharp(path.join(__dirname,'building-shop-before-brand.png')).raw().toBuffer({resolveWithObject:true});
 const generated=await sharp(path.join(__dirname,'building-shop-brand-edit.png')).resize({width:info.width,height:info.height,fit:'fill'}).raw().toBuffer();
 const polygon=[[0,339],[257,462],[342,465],[584,349],[584,601],[0,601]];
 const out=Buffer.from(original);let changed=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  if(!contains([x+.5,y+.5],polygon))continue;
  const p=(y*info.width+x)*4;if(!original[p+3])continue;
  const a=generated[p+3]/255;for(let channel=0;channel<3;channel++)out[p+channel]=Math.round(original[p+channel]*(1-a)+generated[p+channel]*a);
  changed++;
 }
 await sharp(out,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile(path.join(root,'building-shop-branded.png'));
 const contract={version:1,url:'/art/architectural-proof/building-shop-branded.png',width:584,height:601,anchor:{x:297/584,y:598/601},groundAnchorPx:{x:297,y:598},footprintPx:[[290,317],[9,466],[252,598],[343,598],[578,473]],facadeMaskPolygon:polygon,wordmarkFaces:{left:{quad:[[17,351],[251,467],[251,484],[17,369]],direction:'down-right',suggestedCenterPx:{x:133,y:418}},right:{quad:[[349,467],[571,362],[571,380],[349,485]],direction:'up-right',suggestedCenterPx:{x:460,y:424}}},notes:['Original accepted silhouette alpha preserved exactly.','All pixels outside ground-floor mask preserved exactly; only image-generator ground-floor color edit composited inside mask.','Generated source was resized to original accepted canvas for alignment; unchanged original upper facade/roof pixels retained.','Only p1 uses this storefront; ordinary neighbors keep existing building sprites.','Wordmarks are separate vector overlays; no text is baked into this sprite.']};
 fs.writeFileSync(path.join(root,'branded-building-contract.json'),JSON.stringify(contract,null,2));
 const phone=await sharp(out,{raw:{width:info.width,height:info.height,channels:4}}).resize({width:190}).png().toBuffer();
 await sharp({create:{width:260,height:270,channels:4,background:'#ece8df'}}).composite([{input:phone,left:35,top:28}]).png().toFile(path.join(root,'branded-building-phone.png'));
 let alphaDiff=0,upperDiff=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const p=(y*info.width+x)*4;if(out[p+3]!==original[p+3])alphaDiff++;if(!contains([x+.5,y+.5],polygon))for(let c=0;c<4;c++)if(out[p+c]!==original[p+c])upperDiff++;}
 console.log({changedGroundPixels:changed,alphaPixelsChanged:alphaDiff,nonGroundChannelsChanged:upperDiff});
})();
