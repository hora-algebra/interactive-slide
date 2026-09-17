// svg-label-overlap.cjs — mechanically check that text in inline SVG figures does not collide with
// lines, fills, or other labels. Eyes miss small overlaps; this does not.
//
// Standalone:  DECK_URL=http://127.0.0.1:8000/ node svg-label-overlap.cjs [#hash ...]
//              (no hash → every .slide/[data-slide] is shown in turn and checked)
// From a QA script: const {OVERLAP_FN} = require('./svg-label-overlap.cjs');
//                   const hits = await page.evaluate(OVERLAP_FN); assert(hits.length === 0)
// Rules:
//   - Stroked shapes (path/circle/line/polyline/polygon/rect/ellipse) are sampled along their length;
//     a sample inside a label box (shrunk by 1px) counts as an overlap.
//   - Filled shapes that are not label containers are sampled along their outline the same way.
//   - Two label boxes intersecting counts as an overlap.
//   - Exception: a label with a halo (sibling rect.halo) may sit on a DASHED guide line.
//   - Containers (rect.node / circle.state / circle.hole / rect.halo) are not tested against their own label.
// Labels are <text> elements and <g class="mlabel"> groups (MathJax SVG placed as a label).
const OVERLAP_FN=`(()=>{
 const out=[];
 const num=v=>parseFloat(v)||0;
 const isNone=v=>!v||v==='none'||v==='transparent'||v==='rgba(0, 0, 0, 0)';
 for(const svg of document.querySelectorAll('svg')){
  if(svg.closest('.math,.mlabel')||svg.closest('[hidden]')||!svg.getClientRects().length)continue;
  const labels=[...svg.querySelectorAll('text,g.mlabel')].filter(e=>e.tagName==='text'?!e.closest('.mlabel'):true);
  const boxes=labels.map(e=>{const r=e.getBoundingClientRect();return {e,name:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,40),l:r.left+1,t:r.top+1,r:r.right-1,b:r.bottom-1,halo:!!e.parentElement?.querySelector(':scope>rect.halo')}}).filter(x=>x.r>x.l&&x.b>x.t);
  const inside=(p,b)=>p.x>=b.l&&p.x<=b.r&&p.y>=b.t&&p.y<=b.b;
  const shapes=[...svg.querySelectorAll('path,circle,line,polyline,polygon,rect,ellipse')].filter(el=>!el.closest('defs,.mlabel,text')&&typeof el.getTotalLength==='function');
  for(const el of shapes){
   const cs=getComputedStyle(el);
   const stroked=!isNone(cs.stroke)&&num(cs.strokeWidth)>0;
   const filled=!isNone(cs.fill)&&!el.matches('.node,.state,.hole,.halo');
   if(!stroked&&!filled)continue;
   const container=el.matches('.node,.state,.hole,.halo')?el.parentElement:null;
   const dashed=cs.strokeDasharray&&cs.strokeDasharray!=='none';
   const m=el.getScreenCTM();if(!m)continue;
   const len=el.getTotalLength();if(!len)continue;
   const n=Math.max(12,Math.ceil(len/3));
   for(let i=0;i<=n;i++){
    const q=el.getPointAtLength(len*i/n);
    const p={x:m.a*q.x+m.c*q.y+m.e,y:m.b*q.x+m.d*q.y+m.f};
    for(const b of boxes){
     if(container&&container.contains(b.e))continue;
     if(b.halo&&dashed)continue;
     if(b.e.contains(el))continue;
     if(inside(p,b)){out.push({type:stroked?'stroke':'fill',label:b.name,shape:el.tagName+(el.getAttribute('class')?'.'+el.getAttribute('class').trim().replace(/\\s+/g,'.'):''),svg:svg.getAttribute('aria-label')||''});break;}
    }
   }
  }
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
   const a=boxes[i],b=boxes[j];
   if(a.e.contains(b.e)||b.e.contains(a.e))continue;
   if(a.l<b.r&&b.l<a.r&&a.t<b.b&&b.t<a.b)out.push({type:'label',label:a.name,shape:'label:'+b.name,svg:svg.getAttribute('aria-label')||''});
  }
 }
 const seen=new Set();
 return out.filter(o=>{const k=JSON.stringify(o);if(seen.has(k))return false;seen.add(k);return true;});
})()`;
module.exports={OVERLAP_FN};
if(require.main===module){
 (async()=>{
  const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
  const url=new URL(process.env.DECK_URL||'http://127.0.0.1:8000/').href;
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(url,{waitUntil:'networkidle'});
  const hashes=process.argv.slice(2);
  const total=await page.locator('section.slide,[data-slide]').count();
  const targets=hashes.length?hashes:[...Array(total).keys()].map(i=>'#'+i);
  let bad=0;
  for(const h of targets){
   await page.goto(url+h);await page.waitForTimeout(150);
   const r=await page.evaluate(OVERLAP_FN);
   if(r.length){bad+=r.length;console.log(h,JSON.stringify(r));}
  }
  await browser.close();
  console.log(bad?`FAIL: ${bad} overlaps`:`OK: no label/figure overlap in ${targets.length} pages`);
  process.exit(bad?1:0);
 })().catch(e=>{console.error(e);process.exit(1)});
}
