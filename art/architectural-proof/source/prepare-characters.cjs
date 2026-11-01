/* Reproduce six original adult sprites from the retained image-generation source.
 * Run: node public/art/architectural-proof/source/prepare-characters.cjs
 * Cropping, alpha housekeeping, connected-component cleanup, atlas packing only.
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const docs = path.resolve(root, '../../../docs/screenshots/art-direction');
const entries = [
  {key:'proof-staff-1',label:'Budtender 01 · adult 27',role:'budtender',age:27,region:[0,280],feet:[[75,719],[190,799]],description:'Black woman, natural curls, cobalt graphic tee, relaxed black trousers, plain white sneakers.'},
  {key:'proof-staff-2',label:'Budtender 02 · adult 26',role:'budtender',age:26,region:[280,600],feet:[[367,737],[499,805]],description:'Brown-skinned man, beanie, charcoal hoodie with orange geometric panel, cargo trousers, plain sneakers.'},
  {key:'proof-staff-3',label:'Budtender 03 · adult 28',role:'budtender',age:28,region:[600,885],feet:[[678,749],[801,818]],description:'Adult with cropped dyed hair and cap, cream graphic tee, cobalt overshirt, slim jeans, geometric forearm tattoo.'},
  {key:'proof-manager',label:'Owner / manager · adult 35',role:'manager',age:35,region:[885,1215],feet:[[966,760],[1108,822]],description:'Warm brown-skinned adult, tousled hair, stone overshirt with rolled sleeves, cobalt tee, dark jeans, plain sneakers.'},
  {key:'proof-customer-1',label:'Customer 01 · adult 34',role:'customer',age:34,region:[1215,1510],feet:[[1299,746],[1418,812]],description:'Adult woman with rust jacket, cream top, black trousers, plain white sneakers.'},
  {key:'proof-customer-2',label:'Customer 02 · adult 53',role:'customer',age:53,region:[1510,1806],feet:[[1605,758],[1723,821]],description:'Adult man with gray hair and beard, muted teal shirt, light gray jacket, comfortable dark shoes.'},
];
function largestComponent(data,width,height){
  const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let largest=[];let count=0;
  for(let start=0;start<width*height;start++){
    if(seen[start]||data[start*4+3]<8)continue;
    let head=0,tail=1;queue[0]=start;seen[start]=1;
    while(head<tail){const i=queue[head++],x=i%width,y=(i/width)|0;
      for(const n of [x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1])if(n>=0&&!seen[n]&&data[n*4+3]>=8){seen[n]=1;queue[tail++]=n;}}
    count++;if(tail>largest.length)largest=Array.from(queue.subarray(0,tail));
  }
  const keep=new Uint8Array(width*height);for(const i of largest)keep[i]=1;
  return {keep,discardedComponents:count-1};
}
async function main(){
  const source=path.join(__dirname,'characters-lineup-clean-original.png');
  const sourceMeta=await sharp(source).metadata();
  const sprites={},details={},frames={},atlasLayers=[],contactLayers=[];
  for(let e=0;e<entries.length;e++){
    const entry=entries[e],left=entry.region[0],regionWidth=entry.region[1]-left;
    const {data,info}=await sharp(source).extract({left,top:0,width:regionWidth,height:sourceMeta.height}).raw().toBuffer({resolveWithObject:true});
    const component=largestComponent(data,info.width,info.height);
    let minX=info.width,minY=info.height,maxX=-1,maxY=-1,opaque=0,transparent=0;
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
      const i=y*info.width+x,k=i*4;
      if(!component.keep[i]||data[k+3]<8){data[k]=data[k+1]=data[k+2]=data[k+3]=0;transparent++;continue;}
      if(data[k+3]>=250){data[k+3]=255;opaque++;}
      minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
    }
    if(maxX<minX)throw new Error(`Empty actor: ${entry.key}`);
    minX=Math.max(0,minX-3);minY=Math.max(0,minY-3);maxX=Math.min(info.width-1,maxX+3);maxY=Math.min(info.height-1,maxY+3);
    const width=maxX-minX+1,height=maxY-minY+1;
    const buffer=await sharp(data,{raw:info}).extract({left:minX,top:minY,width,height}).png().toBuffer();
    await fs.writeFile(path.join(root,`${entry.key}.png`),buffer);
    const foot={x:(entry.feet[0][0]+entry.feet[1][0])/2-left-minX,y:(entry.feet[0][1]+entry.feet[1][1])/2-minY};
    const anchor={x:foot.x/width,y:foot.y/height};
    sprites[entry.key]={url:`/art/architectural-proof/${entry.key}.png`,width,height,anchor,role:entry.role,adultAge:entry.age,physicalHeightMeters:1.75,animation:{type:'single-frame-transform-rig',frames:1,idle:{scaleYAmplitude:0.006},walk:{pivotYAmplitude:2},economicEffect:false}};
    details[entry.key]={sourceRegion:{left,top:0,width:regionWidth,height:info.height},trimInRegion:{left:minX,top:minY,width,height},sourceOrigin:{x:left+minX,y:minY},authoredGroundContactsSource:entry.feet.map(([x,y])=>({x,y})),footAnchorPixels:foot,footAnchorNormalized:anchor,sourceHeadToGroundPixels:foot.y-3,description:entry.description,alpha:{minimumRetained:8,opaquePixels:opaque,transparentPixelsInRegion:transparent,discardedComponents:component.discardedComponents}};
    const ax=8+(e%3)*330,ay=8+Math.floor(e/3)*900;
    atlasLayers.push({input:buffer,left:ax,top:ay});frames[entry.key]={frame:{x:ax,y:ay,w:width,h:height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:width,h:height},sourceSize:{w:width,h:height},anchor};
    const targetHeight=350,scale=targetHeight/height;
    const display=await sharp(buffer).resize({height:targetHeight}).png().toBuffer();
    const dx=30+e*195+Math.round(85-foot.x*scale),dy=430-Math.round(foot.y*scale);
    contactLayers.push({input:display,left:dx,top:dy});
  }
  await sharp({create:{width:1024,height:2048,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(atlasLayers).png().toFile(path.join(root,'characters-atlas.png'));
  await fs.writeFile(path.join(root,'characters-atlas.json'),JSON.stringify({frames,meta:{image:'characters-atlas.png',size:{w:1024,h:2048},scale:'1'}},null,2)+'\n');
  await fs.writeFile(path.join(root,'characters-manifest.json'),JSON.stringify({version:1,scope:'Adult Common Signal character art; identities and economics remain renderer/simulation-owned.',sprites,atlas:'/art/architectural-proof/characters-atlas.json',sources:['source/characters-lineup-original.png','source/characters-lineup-clean-original.png'],footAnchorMethod:'Authored sole contact points in original source; arithmetic midpoint is ground anchor. Per-person source height is retained. Use consistent scene person height rather than arbitrary sprite width.'},null,2)+'\n');
  await fs.writeFile(path.join(root,'characters-extraction.json'),JSON.stringify({version:1,source:'source/characters-lineup-clean-original.png',generation:'exec-5b7f584d-fb51-4af9-b7b8-8a3ea4879a1d',initialGeneration:'exec-cc9e7d5c-a2e6-420e-a9c0-c11bae23213a',sourceDimensions:{width:sourceMeta.width,height:sourceMeta.height},actors:details},null,2)+'\n');
  const labels=entries.map((entry,i)=>`<text x="${115+i*195}" y="480" text-anchor="middle" font-size="14" font-family="sans-serif" fill="#293637">${entry.label.replace('&','&amp;')}</text><text x="${115+i*195}" y="503" text-anchor="middle" font-size="11" font-family="monospace" fill="#647370">${entry.key}</text>`).join('');
  const labelSvg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1215" height="540"><text x="30" y="38" font-family="sans-serif" font-weight="bold" font-size="22" fill="#293637">COMMON SIGNAL · ADULT CHARACTER ART PROOF</text><text x="30" y="61" font-family="sans-serif" font-size="12" fill="#647370">Four core staff / owner looks and two customers. Labels are documentation only, not baked into sprites.</text>${labels}</svg>`);
  await fs.mkdir(docs,{recursive:true});
  await sharp({create:{width:1215,height:540,channels:4,background:'#f0f1e9'}}).composite([...contactLayers,{input:labelSvg,left:0,top:0}]).png().toFile(path.join(docs,'common-signal-characters-lineup.png'));
  console.log(JSON.stringify({count:entries.length,sprites:Object.fromEntries(Object.entries(sprites).map(([k,v])=>[k,{width:v.width,height:v.height,anchor:v.anchor}])),source,proof:path.join(docs,'common-signal-characters-lineup.png')},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
