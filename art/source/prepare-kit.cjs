/* Lossless source extraction and atlas assembly. Original generated PNGs are retained. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'..');
const modules = {
  'storefront-budget':[0,0,455,510], 'storefront-premium':[455,0,440,515], tree:[895,0,359,520],
  display:[0,515,440,385], 'display-improved':[445,495,420,430], 'checkout-improved':[875,520,379,390],
  'interior-improved':[0,915,500,325], security:[550,900,230,340], marketing:[920,900,320,340],
};
const characters = {'customer-1':[0,0,600,782],'customer-2':[600,0,400,782],manager:[1000,0,450,782],'staff-walk':[1450,0,562,782]};
(async()=>{
  const sprites=JSON.parse(fs.readFileSync(path.join(root,'proof-manifest.json')));
  for(const [sheet,regions] of [['modules',modules],['characters',characters]]) {
    for(const [id,[left,top,width,height]] of Object.entries(regions)) {
      const crop=await sharp(path.join(__dirname,sheet+'-original.png')).extract({left,top,width,height}).png().toBuffer();
      // Keep the dominant connected alpha silhouette; sheet gutters occasionally
      // contain disconnected tips from an adjacent sprite. Preserve original edge alpha.
      const decoded=await sharp(crop).raw().toBuffer({resolveWithObject:true});
      const pixels=decoded.data, w=decoded.info.width,h=decoded.info.height;
      const visited=new Uint8Array(w*h);let largest=[];const components=[];
      for(let pos=0;pos<w*h;pos++) {
        if(visited[pos] || pixels[pos*4+3]<6)continue;
        const component=[pos];visited[pos]=1;
        for(let q=0;q<component.length;q++) {
          const v=component[q],x=v%w,y=Math.floor(v/w);
          const neighbors=[];if(x>0)neighbors.push(v-1);if(x<w-1)neighbors.push(v+1);if(y>0)neighbors.push(v-w);if(y<h-1)neighbors.push(v+w);
          for(const n of neighbors)if(!visited[n]&&pixels[n*4+3]>=6){visited[n]=1;component.push(n);}
        }
        components.push(component);if(component.length>largest.length)largest=component;
      }
      const mask=new Uint8Array(w*h);
      const kept=(id==='security' ? components.sort((a,b)=>b.length-a.length).slice(0,2) : components.filter(c=>c.length>=largest.length*0.04)).flat();
      for(const v of kept){const x=v%w,y=Math.floor(v/w);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<w&&yy<h)mask[yy*w+xx]=1;}}
      for(let pos=0;pos<w*h;pos++)if(!mask[pos])pixels[pos*4+3]=0;
      const clean=await sharp(pixels,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
      const data=await sharp(clean).trim({threshold:12}).png().toBuffer();
      await sharp(data).toFile(path.join(root,id+'.png'));
      const m=await sharp(data).metadata();
      sprites[id]={url:'/art/'+id+'.png',width:m.width,height:m.height,anchor:{x:.5,y:.96}};
    }
  }
  sprites['interior-improved'].anchor.y=.5;
  sprites.plant={...sprites.tree};
  const animations={
    idle:{type:'transform-keyframes',durationMs:2400,loop:true,keyframes:[{at:0,y:0,rotation:0},{at:.5,y:-.6,rotation:0},{at:1,y:0,rotation:0}]},
    walk:{type:'transform-keyframes',durationMs:520,loop:true,keyframes:[{at:0,y:0,rotation:-.025},{at:.25,y:-2,rotation:0},{at:.5,y:0,rotation:.025},{at:.75,y:-2,rotation:0},{at:1,y:0,rotation:-.025}],routeSpeed:42},
    staffStep:{type:'sprite-frames',durationMs:700,loop:true,frames:['staff','staff-walk']}
  };
  const manifest={version:1,projection:'2:1 isometric',lighting:'upper-left',palette:['#ede9db','#637656','#8c5b36','#b88045'],sprites,animations,atlas:'/art/atlas.json',sources:['source/proof-original.png','source/modules-original.png','source/characters-original.png']};
  fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
  const frames={}; const overlays=[];const ids=Object.keys(sprites).filter(id=>id!=='plant');
  for(let i=0;i<ids.length;i++) {
    const id=ids[i], info=sprites[id];
    const data=await sharp(path.join(root,id+'.png')).resize({width:500,height:500,fit:'inside',withoutEnlargement:true}).png().toBuffer();
    const m=await sharp(data).metadata(); const x=(i%4)*512+6,y=Math.floor(i/4)*512+6;
    overlays.push({input:data,left:x,top:y});
    frames[id]={frame:{x,y,w:m.width,h:m.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:m.width,h:m.height},sourceSize:{w:m.width,h:m.height},anchor:info.anchor};
  }
  const height=Math.ceil(ids.length/4)*512;
  await sharp({create:{width:2048,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(overlays).png().toFile(path.join(root,'sprites-atlas.png'));
  fs.writeFileSync(path.join(root,'atlas.json'),JSON.stringify({frames,animations:{staffStep:['staff','staff-walk']},meta:{app:'Dispensary Inc. asset assembly',version:'1',image:'sprites-atlas.png',format:'RGBA8888',size:{w:2048,h:height},scale:'1'}},null,2));
  // Contact sheet on the actual game background for edge and style inspection.
  const contact=await Promise.all(ids.map(async(id,i)=>({input:await sharp(path.join(root,id+'.png')).resize({width:180,height:180,fit:'inside'}).png().toBuffer(),left:(i%4)*200+10,top:Math.floor(i/4)*200+10})));
  await sharp({create:{width:800,height:Math.ceil(ids.length/4)*200,channels:4,background:'#eae8dc'}}).composite(contact).png().toFile(path.join(root,'kit-contact.png'));
  console.log(JSON.stringify({sprites:Object.keys(sprites),atlas:{width:2048,height},individualDimensions:Object.fromEntries(Object.entries(sprites).map(([k,v])=>[k,[v.width,v.height]]))},null,2));
})();
