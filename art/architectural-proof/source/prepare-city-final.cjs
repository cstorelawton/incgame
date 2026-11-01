const sharp=require('sharp');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const office=await sharp(path.join(__dirname,'city-office-repaired.png')).trim({threshold:12}).png().toBuffer();
 await sharp(office).toFile(path.join(root,'building-office-final.png'));
 const contract={
  version:1,
  targetProjection:{type:'orthographic isometric',azimuthDegrees:45,elevationDegrees:35.264,groundAxisDegrees:30},
  projectionNote:'Artist-rendered approximation, not mechanically exact CAD. Visible edge slopes vary roughly 0.53–0.64. Renderer uses 30-degree axes; review assembled phone scene.',
  lighting:'upper-left daylight',
  sprites:{
   shop:{url:'/art/architectural-proof/building-shop-corrected.png',width:584,height:601,anchor:{x:297/584,y:598/601},groundAnchorPx:{x:297,y:598},footprintPx:[[290,317],[9,466],[252,598],[343,598],[578,473]],footprintOrder:'inferred back, visible left, chamfer near-left, chamfer near-right, visible right',stories:3,worldFootprintMeters:{width:12,depth:10}},
   apartments:{url:'/art/architectural-proof/building-apartments-corrected.png',width:427,height:744,anchor:{x:237/427,y:742/744},groundAnchorPx:{x:237,y:742},footprintPx:[[187,510],[7,619],[237,742],[417,633]],footprintOrder:'inferred back, visible left, visible front, visible right',stories:5,worldFootprintMeters:{width:9,depth:12}},
   office:{url:'/art/architectural-proof/building-office-final.png',width:1015,height:1078,anchor:{x:670/1015,y:1076/1078},groundAnchorPx:{x:670,y:1076},footprintPx:[[347,496],[4,710],[670,1076],[1013,862]],footprintOrder:'inferred back, visible left, visible front, visible right',stories:3,storyCountNote:'Observed final sprite: ground-floor glazing plus two upper window rows. Original generation brief requested four stories; output contains three.',worldFootprintMeters:{width:15,depth:12}}
  },
  geometryNote:'Ground vertices are manually calibrated from opaque alpha base contours. Hidden back vertices are inferred from visible wall edges; shop has a chamfered entrance corner. Anchors are actual near-ground contact positions, not image centers.',
  sources:{shop:'source/city-buildings-corrected.png',apartments:'source/city-buildings-corrected.png',office:'source/city-office-repaired.png'},
  atlas:'/art/architectural-proof/city-atlas.json'
 };
 fs.writeFileSync(path.join(root,'city-contract.json'),JSON.stringify(contract,null,2));
 const defs=[['shop',168,18,145],['apartments',113,208,50],['office',195,156,317]];
 const layers=await Promise.all(defs.map(async([key,width,left,top])=>({input:await sharp(path.join(root,path.basename(contract.sprites[key].url))).resize({width}).png().toBuffer(),left,top})));
 await sharp({create:{width:390,height:560,channels:4,background:'#e9e5db'}}).composite(layers).png().toFile(path.join(root,'city-final-phone-proof.png'));
 const atlasLayers=[],frames={};
 for(const [i,[id,s]] of Object.entries(contract.sprites).entries()){
  const {data,info}=await sharp(path.join(root,path.basename(s.url))).resize({width:500,height:740,fit:'inside',withoutEnlargement:true}).png().toBuffer({resolveWithObject:true});
  const x=i*512+6,y=6;atlasLayers.push({input:data,left:x,top:y});
  frames[id]={frame:{x,y,w:info.width,h:info.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:info.width,h:info.height},sourceSize:{w:info.width,h:info.height},anchor:s.anchor};
 }
 await sharp({create:{width:1536,height:768,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(atlasLayers).png().toFile(path.join(root,'city-atlas.png'));
 fs.writeFileSync(path.join(root,'city-atlas.json'),JSON.stringify({frames,meta:{image:'city-atlas.png',format:'RGBA8888',size:{w:1536,h:768},scale:'1'}},null,2));
 console.log('Final city contract, atlas, and phone proof saved.');
})();
