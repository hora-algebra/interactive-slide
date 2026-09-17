// qa-deck.cjs — headless checks for a single-file deck. Run against a local static server.
//
//   python3 -m http.server 8000 --bind 127.0.0.1 --directory site      (in another terminal)
//   DECK_URL=http://127.0.0.1:8000/ node qa-deck.cjs [--shots out/] [--report report.json]
//
// Needs Playwright (npm i -D playwright && npx playwright install chromium), or point
// PLAYWRIGHT_MODULE at an existing install. For every slide × viewport it checks:
//   errors      no page errors / console.error
//   external    no request leaves the deck's origin (the deck must work offline)
//   overflow-x  nothing wider than the viewport
//   overflow-y  desktop slides fit without scrolling (mobile may scroll inside the slide)
//   fit         desktop content uses ≥60% of the height and ≥70% of the width (see references/layout-and-navigation.md)
//   overlap     figure text does not collide with lines/fills/labels (svg-label-overlap.cjs)
// and once per run: keyboard / hash / edge-click navigation works. Exit 1 on any failure.
const {OVERLAP_FN}=require('./svg-label-overlap.cjs');
const fs=require('fs'),path=require('path');
const args=process.argv.slice(2);const opt=n=>{const i=args.indexOf(n);return i>=0?args[i+1]:null;};
const SHOTS=opt('--shots'),REPORT=opt('--report');
const VIEWPORTS=[
 {name:'mobile-375',width:375,height:812,fit:false},
 {name:'desktop-1440',width:1440,height:900,fit:true},
 {name:'projector-2000',width:2000,height:1000,fit:true},
 {name:'ultrawide-3440',width:3440,height:1440,fit:true},
 {name:'dark-1440',width:1440,height:900,fit:true,colorScheme:'dark'},
];
(async()=>{
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
 const url=new URL(process.env.DECK_URL||'http://127.0.0.1:8000/');
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE});
 const failures=[],report={url:url.href,viewports:{}};
 const fail=(vp,slide,check,detail)=>{failures.push({vp,slide,check,detail});};
 for(const vp of VIEWPORTS){
  const ctx=await browser.newContext({viewport:{width:vp.width,height:vp.height},colorScheme:vp.colorScheme||'light',reducedMotion:'no-preference'});
  const page=await ctx.newPage();
  const errors=[],external=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==url.origin){external.push(u.href);return r.abort();}return r.continue();});
  await page.goto(url.href,{waitUntil:'networkidle'});
  const total=await page.locator('.slide[data-slide]').count();
  const per=[];
  for(let i=0;i<total;i++){
   await page.evaluate(n=>{location.hash='#'+n;},i);
   await page.waitForTimeout(120);
   const m=await page.evaluate(()=>{
    const s=document.querySelector('.slide[data-slide]:not([hidden])');if(!s)return null;
    const inner=s.querySelector('.slide-inner')||s;
    const boxes=[...inner.children].map(e=>e.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0);
    const usage=boxes.length?{h:(Math.max(...boxes.map(r=>r.bottom))-Math.min(...boxes.map(r=>r.top)))/innerHeight,w:(Math.max(...boxes.map(r=>r.right))-Math.min(...boxes.map(r=>r.left)))/innerWidth}:{h:0,w:0};
    return {index:+s.dataset.slide,id:s.dataset.id||'',fit:s.dataset.fit||'',sw:s.scrollWidth,cw:s.clientWidth,sh:s.scrollHeight,ch:s.clientHeight,usage};
   });
   if(!m){fail(vp.name,i,'visible','no visible slide');continue;}
   const overlaps=await page.evaluate(OVERLAP_FN);
   const rec={i,id:m.id,fit:m.fit,usage:{h:+m.usage.h.toFixed(2),w:+m.usage.w.toFixed(2)},overflowX:m.sw>m.cw+2,overflowY:m.sh>m.ch+2,overlaps:overlaps.length};
   per.push(rec);
   if(rec.overflowX)fail(vp.name,i,'overflow-x',`${m.sw}>${m.cw}`);
   if(vp.fit&&rec.overflowY)fail(vp.name,i,'overflow-y',`${m.sh}>${m.ch}`);
   if(vp.fit&&(m.usage.h<.6||m.usage.w<.7))fail(vp.name,i,'fit',JSON.stringify(rec.usage));
   if(overlaps.length)fail(vp.name,i,'overlap',JSON.stringify(overlaps.slice(0,3)));
   if(SHOTS){fs.mkdirSync(SHOTS,{recursive:true});await page.screenshot({path:path.join(SHOTS,`${vp.name}-${String(i).padStart(2,'0')}.png`)});}
  }
  if(errors.length)fail(vp.name,'*','errors',errors.slice(0,3).join(' | '));
  if(external.length)fail(vp.name,'*','external',[...new Set(external)].slice(0,3).join(' '));
  report.viewports[vp.name]={slides:per,errors,external:[...new Set(external)]};
  await ctx.close();
 }
 // navigation smoke test (desktop)
 {
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(url.href+'#0',{waitUntil:'networkidle'});
  const at=async()=>page.evaluate(()=>+document.querySelector('.slide[data-slide]:not([hidden])').dataset.slide);
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(80);
  if(await at()!==1)fail('nav','*','keyboard','ArrowRight did not advance');
  if(!/#1$/.test(page.url()))fail('nav','*','hash','hash not updated after ArrowRight');
  await page.keyboard.press('ArrowLeft');await page.waitForTimeout(80);
  if(await at()!==0)fail('nav','*','keyboard','ArrowLeft did not go back');
  const edge=await page.$('.edge.next');if(edge){await edge.click({position:{x:5,y:450}});await page.waitForTimeout(80);if(await at()!==1)fail('nav','*','edge','edge click did not advance');}
  const total=await page.locator('.slide[data-slide]').count();
  await page.goto(url.href+'#'+(total-1));await page.waitForTimeout(80);
  if(await at()!==total-1)fail('nav','*','deep-link','#last did not open the last slide');
  await page.close();
 }
 await browser.close();
 report.failures=failures;
 if(REPORT)fs.writeFileSync(REPORT,JSON.stringify(report,null,1));
 for(const vp of Object.keys(report.viewports)){const v=report.viewports[vp];const minH=Math.min(...v.slides.map(s=>s.usage.h)),minW=Math.min(...v.slides.map(s=>s.usage.w));console.log(`${vp.padEnd(16)} slides ${v.slides.length}  min usage h ${minH.toFixed(2)} w ${minW.toFixed(2)}  errors ${v.errors.length}  external ${v.external.length}`);}
 if(failures.length){console.log(`FAIL (${failures.length})`);failures.slice(0,40).forEach(f=>console.log(` ${f.vp} #${f.slide} ${f.check}: ${f.detail}`));process.exit(1);}
 console.log('OK: all checks passed');
})().catch(e=>{console.error(e);process.exit(1);});
