const sharp=require('sharp'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const regions={'counter-branded-starter':{left:0,top:0,width:1100,height:724},'counter-branded-improved':{left:1100,top:0,width:1072,height:724}};
(async()=>{const info={};for(const [name,region]of Object.entries(regions)){
 const crop=await sharp(path.join(__dirname,'counters-branded-original.png')).extract(region).raw().toBuffer({resolveWithObject:true});
 const raw=crop.data,w=crop.info.width,h=crop.info.height,seen=new Uint8Array(w*h);let main=[];
 for(let p=0;p<w*h;p++){if(seen[p]||raw[p*4+3]<8)continue;const group=[p];seen[p]=1;for(let i=0;i<group.length;i++){const v=group[i],x=v%w,y=Math.floor(v/w);for(const n of[x>0?v-1:-1,x<w-1?v+1:-1,y>0?v-w:-1,y<h-1?v+w:-1])if(n>=0&&!seen[n]&&raw[n*4+3]>=8){seen[n]=1;group.push(n);}}if(group.length>main.length)main=group;}
 const mask=new Uint8Array(w*h);for(const v of main){const x=v%w,y=Math.floor(v/w);for(let yy=Math.max(0,y-2);yy<=Math.min(h-1,y+2);yy++)for(let xx=Math.max(0,x-2);xx<=Math.min(w-1,x+2);xx++)mask[yy*w+xx]=1;}
 for(let p=0;p<w*h;p++)if(!mask[p])raw[p*4+3]=0;
 const clean=await sharp(raw,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
 const {data,info:m}=await sharp(clean).trim({threshold:12}).png().toBuffer({resolveWithObject:true});await sharp(data).toFile(path.join(root,name+'.png'));
 info[name]={url:'/art/architectural-proof/'+name+'.png',width:m.width,height:m.height,sourceRegion:region,sourceOrigin:{x:region.left-m.trimOffsetLeft,y:region.top-m.trimOffsetTop}};
}fs.writeFileSync(path.join(root,'branded-counters-extraction.json'),JSON.stringify(info,null,2));console.log(info);})();
