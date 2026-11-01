#!/usr/bin/env python3
"""Original COMMON SIGNAL vector identity; outline Manrope OFL glyphs, then rasterize with Sharp."""
from pathlib import Path
import hashlib, json, math, subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[3]
SVG = ROOT / 'svg'
SVG.mkdir(parents=True, exist_ok=True)
FONT = REPO / 'public/fonts/manrope.ttf'
font = instantiateVariableFont(TTFont(FONT), {'wght': 800}, inplace=False)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
colors = {'ivory':'#F5F1E8','charcoal':'#202533','cobalt':'#3155E7','orange':'#F58245'}

def outlined(text, x, baseline, size, fill, tracking=0):
    paths=[]
    cursor=x
    scale=size/upm
    for char in text:
        name=cmap[ord(char)]
        pen=SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        if pen.getCommands():
            paths.append(f'<path fill="{fill}" d="{pen.getCommands()}" transform="translate({cursor:.6f} {baseline}) scale({scale:.8f} {-scale:.8f})"/>')
        cursor+=font['hmtx'].metrics[name][0]*scale+tracking
    return ''.join(paths)

def signal(x=0,y=0,scale=1,fill=None):
    fill=fill or colors['cobalt']
    return f'<g transform="translate({x} {y}) scale({scale})" fill="{fill}"><circle cx="100" cy="56" r="49"/><path d="M24 126H176V155H24Z M24 184H176V213H24Z"/></g>'

def svg(w,h,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'

def write(key,w,h,body,**metadata):
    (SVG/f'{key}.svg').write_text(svg(w,h,body))
    contract['assets'][key]={'url':f'/art/architectural-proof/branding/{key}.png','svg':f'/art/architectural-proof/branding/svg/{key}.svg','width':w,'height':h,'anchor':{'x':.5,'y':.5},'animation':{'type':'static','frames':1},**metadata}

contract={'version':1,'brand':'COMMON SIGNAL','palette':colors,'font':{'family':'Manrope','weight':800,'source':'/fonts/manrope.ttf','license':'SIL Open Font License 1.1','licenseFile':'/fonts/Manrope-OFL.txt','fontSha256':hashlib.sha256(FONT.read_bytes()).hexdigest(),'delivery':'All text converted to paths; no runtime font dependency'},'originalIdentity':'Circle above two horizontal bars; original wordmark and geometric packaging identity. No third-party logos.','assets':{},'storefrontPlacementContract':'../branded-building-contract.json','notes':['Raster assets are generated from editable SVG sources.','Flat wall signage is projected by the renderer, not by this artwork.','Only the floor graphic is preprojected at mathematically exact +/-30 degree ground axes.','The optional glow is a separate low-opacity static texture; no flashing is baked into any asset.']}

# Main lockup: strong horizontal capitals, broad spacing around the identity glyph.
write('proof-brand-wordmark',1200,220,signal(24,29,.76,colors['orange'])+outlined('COMMON SIGNAL',198,153,113,colors['ivory'],-.6),purpose='Transparent fascia lockup. White capitals and orange mark.',contentBoundsHint={'x':42,'y':34,'width':1123,'height':157},placement='Map into wordmarkFaces.left/right quads in branded-building-contract.json; preserve aspect ratio or crop transparent margins before mapping.')
write('proof-brand-mark',200,240,signal(),purpose='Original cobalt circle-and-two-bars mark; transparent.')

# Feature sign: a deliberately asymmetric lockup with common-width stacked words.
sign_mark=signal(54,50,.88,colors['orange'])
panel=f'<rect x="1" y="1" width="898" height="298" rx="9" fill="{colors["cobalt"]}"/><rect x="17" y="17" width="866" height="266" rx="2" fill="none" stroke="{colors["ivory"]}" stroke-width="2"/>'
panel+=f'<path d="M253 48V252" stroke="{colors["ivory"]}" stroke-width="2" opacity=".42"/>'
panel+=sign_mark+outlined('COMMON',286,129,116,colors['ivory'],-.3)+outlined('SIGNAL',281,252,151,colors['ivory'],-.3)
write('proof-brand-sign',900,300,panel,purpose='Physical cobalt feature-wall sign. Renderer applies wall-plane transform.',physicalAspect=3)

# Optional glow is truly separate, sparse and translucent; it contains no opaque panel.
glow='<defs><filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter><filter id="symbolGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>'
glow+=f'<g filter="url(#edgeGlow)" opacity=".18"><rect x="17" y="17" width="866" height="266" rx="2" fill="none" stroke="{colors["ivory"]}" stroke-width="9"/></g>'
glow+=f'<g filter="url(#symbolGlow)" opacity=".12">{signal(54,50,.88,colors["ivory"])}</g>'
glow+=f'<rect x="17" y="17" width="866" height="266" rx="2" fill="none" stroke="{colors["cobalt"]}" stroke-width="3" opacity=".12"/>'
write('proof-brand-glow',900,300,glow,purpose='Optional transparent low-amplitude glow for the feature sign, same geometry/anchor. No opaque panel or text.',maximumSuggestedOpacity=.45)

# Floor mat is a planar original vector decal, not furniture or a room replacement.
c=math.sqrt(3)/2
tx=460-c*140
mat=f'<g transform="matrix({c:.9f} .5 {-c:.9f} .5 {tx:.9f} 20)"><rect x="0" y="0" width="640" height="360" rx="5" fill="{colors["ivory"]}"/>'
mat+=f'<rect x="12" y="12" width="616" height="336" rx="2" fill="none" stroke="{colors["cobalt"]}" stroke-width="12"/><rect x="29" y="29" width="582" height="302" fill="none" stroke="{colors["orange"]}" stroke-width="3"/>'
mat+=signal(240,83,.8,colors['cobalt'])
mat+=f'<path d="M44 30H154 M486 330H596" stroke="{colors["orange"]}" stroke-width="10" stroke-linecap="square"/></g>'
corners=[{'x':tx+c*x-c*y,'y':20+.5*x+.5*y} for x,y in [(0,0),(640,0),(640,360),(0,360)]]
write('proof-brand-floor',920,540,mat,purpose='Original flat floor inlay/mat for interior upgrade; already projected at +/-30 degrees.',projection={'type':'orthographic-isometric','axesDegrees':[30,-30],'matrix':[c,.5,-c,.5,tx,20]},groundCorners=corners,groundAnchorPixels={'x':460,'y':270},requestedWorldMeters={'width':2.4,'depth':1.35})

# Physical retail menu; categories only, no prices, invented SKUs or interactive controls.
menu=f'<rect x="1" y="1" width="638" height="298" rx="6" fill="{colors["charcoal"]}"/><path d="M28 22H510" stroke="{colors["cobalt"]}" stroke-width="5"/><path d="M510 22H612" stroke="{colors["orange"]}" stroke-width="5"/>'
menu+=f'<path d="M28 111H612 M28 201H612" stroke="{colors["ivory"]}" opacity=".18"/>'
menu+=signal(31,42,.23,colors['cobalt'])+outlined('FLOWER',108,87,45,colors['ivory'],1)
menu+=f'<path d="M40 176A24 24 0 0 1 88 176Z" fill="{colors["orange"]}"/>'+outlined('EDIBLES',108,177,45,colors['ivory'],1)
menu+=f'<path d="M40 270L63 242L87 270L63 258Z" fill="{colors["cobalt"]}"/>'+outlined('CONCENTRATES',108,267,45,colors['ivory'],.3)
write('proof-menu-panel',640,300,menu,purpose='Physical category menu: FLOWER / EDIBLES / CONCENTRATES only; no controls or prices.')

(ROOT/'brand-contract.json').write_text(json.dumps(contract,indent=2)+'\n')
subprocess.run(['node',str(ROOT/'source/render-brand.cjs')],cwd=REPO,check=True)
