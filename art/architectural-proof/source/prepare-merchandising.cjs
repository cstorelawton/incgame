const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const specs = [
  { id: 'proof-display-flower', label: 'STRATA house-brand flower', left: 0, corners: [[76,555],[429,716],[495,672],[142,511]], visualHeight: 511 },
  { id: 'proof-display-edibles', label: 'SUNSHIFT edibles', left: 543, corners: [[615,554],[968,715],[1035,671],[682,510]], visualHeight: 511 },
  { id: 'proof-display-concentrates', label: 'VECTOR concentrates', left: 1086, corners: [[1156,556],[1509,718],[1575,674],[1222,512]], visualHeight: 513 },
  { id: 'proof-merch', label: 'COMMON SIGNAL apparel and bags', left: 1629, corners: [[1704,567],[2045,716],[2110,673],[1769,524]], visualHeight: 525 },
];
(async () => {
  const result = {
    source: 'source/merchandising-original.png', sourceDimensions: { width: 2172, height: 724 },
    sourceKind: 'Original generated artwork; geometry reference was our fixture-display-basic.png; no third-party photograph used as generation input.',
    intendedProjection: { type: 'orthographic-isometric', groundSlope: 0.577350269 },
    notes: [
      'All four authored physical targets are 1.6m wide, 0.45m deep, 1.6m high.',
      'Ground polygon uses visible leg-contact samples and an inferred back corner; anchor is polygon center.',
      'Source ground slopes are approximate rather than exactly +/-30 degrees. Measured values are provided explicitly.',
      'Alpha values below 8 and all but the largest 8-connected object component are removed. Source remains unchanged.',
    ], sprites: {},
  };
  for (const spec of specs) {
    const sourceRegion = { left: spec.left, top: 0, width: 543, height: 724 };
    const {data,info} = await sharp(path.join(__dirname,'merchandising-original.png')).extract(sourceRegion).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const count = info.width*info.height, labels = new Int32Array(count), queue = new Int32Array(count);
    let label=0, largest=0, largestCount=0, originalPixels=0;
    const componentSizes=[];
    for (let i=0;i<count;i++) if(data[i*4+3]>=8) originalPixels++;
    for (let at=0;at<count;at++) {
      if(labels[at]||data[at*4+3]<8) continue;
      label++; let read=0,write=1; queue[0]=at;labels[at]=label;
      while(read<write) {
        const i=queue[read++],x=i%info.width,y=Math.floor(i/info.width);
        for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++) {
          if(!ox&&!oy)continue; const nx=x+ox,ny=y+oy;
          if(nx<0||nx>=info.width||ny<0||ny>=info.height)continue;
          const n=ny*info.width+nx;
          if(!labels[n]&&data[n*4+3]>=8){labels[n]=label;queue[write++]=n;}
        }
      }
      componentSizes.push(write);
      if(write>largestCount){largestCount=write;largest=label;}
    }
    let minX=info.width,minY=info.height,maxX=0,maxY=0;
    for(let i=0;i<count;i++) {
      if(labels[i]!==largest){data[i*4+3]=0;continue;}
      const x=i%info.width,y=Math.floor(i/info.width);
      minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
    }
    const trim={left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1};
    await sharp(data,{raw:info}).extract(trim).png().toFile(path.join(root,spec.id+'.png'));
    const sourceOrigin={x:sourceRegion.left+minX,y:minY};
    const corners=spec.corners.map(([x,y])=>({x:x-sourceOrigin.x,y:y-sourceOrigin.y}));
    const anchor={x:corners.reduce((s,p)=>s+p.x,0)/4,y:corners.reduce((s,p)=>s+p.y,0)/4};
    const slope=(a,b)=>(b[1]-a[1])/(b[0]-a[0]);
    result.sprites[spec.id]={
      url:'/art/architectural-proof/'+spec.id+'.png',label:spec.label,width:trim.width,height:trim.height,
      sourceRegion,sourceOrigin,requestedWorldMeters:{width:1.6,depth:.45,height:1.6},
      groundCorners:corners,groundAnchorPixels:anchor,groundAnchorNormalized:{x:anchor.x/trim.width,y:anchor.y/trim.height},
      groundSlopesMeasured:{front:slope(spec.corners[0],spec.corners[1]),depth:slope(spec.corners[1],spec.corners[2])},
      authoredVisualHeightPixels:spec.visualHeight,scaleFor72PixelsPerVerticalMeter:115.2/spec.visualHeight,
      animation:{type:'static',frames:1},
      alphaCleanup:{minimumAlpha:8,retainedConnectedComponents:1,discardedComponents:label-1,discardedPixels:originalPixels-largestCount,retainedPixels:largestCount,componentSizes:componentSizes.sort((a,b)=>b-a)},
    };
  }
  fs.writeFileSync(path.join(root,'merchandising-extraction.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result.sprites,null,2));
})();
