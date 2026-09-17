#!/usr/bin/env node
// tex2svg.mjs — convert TeX strings to inline SVG at build time (no runtime math library in the deck).
//
//   npm i mathjax-full@3          (once, in your build directory)
//   echo '["\\\\int f", {"tex":"\\\\sum_n a_n","display":true}]' | node tex2svg.mjs > out.json
//   node tex2svg.mjs --file formulas.json --macros macros.json --colors colors.json > out.json
//
// Input: JSON array of strings or {tex, display} objects. Output: JSON array of <svg> strings.
// --macros: {"N":"\\mathbb{N}","da":["{\\color{DA}#1}",1]}   (name → expansion, or [expansion, nargs])
// --colors: {"DA":"var(--a)","IB":"var(--b)"}                 named colors used in \color{...} are rewritten
//           to CSS variables, so formulas follow the deck's semantic accent colors and dark mode.
// Text and lines use currentColor, so the SVG inherits the surrounding text color.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));
let mj;
try {
  mj = {
    mathjax: require('mathjax-full/js/mathjax.js').mathjax,
    TeX: require('mathjax-full/js/input/tex.js').TeX,
    SVG: require('mathjax-full/js/output/svg.js').SVG,
    liteAdaptor: require('mathjax-full/js/adaptors/liteAdaptor.js').liteAdaptor,
    RegisterHTMLHandler: require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler,
    AllPackages: require('mathjax-full/js/input/tex/AllPackages.js').AllPackages,
  };
} catch (e) {
  console.error('mathjax-full is not installed here. Run: npm i mathjax-full@3   (in the directory you build from)');
  process.exit(2);
}
const macros = opt('--macros') ? readJSON(opt('--macros')) : {};
const colors = opt('--colors') ? readJSON(opt('--colors')) : {};
const input = opt('--file') ? readJSON(opt('--file')) : JSON.parse(readFileSync(0, 'utf8'));
const adaptor = mj.liteAdaptor();
mj.RegisterHTMLHandler(adaptor);
const tex = new mj.TeX({ packages: mj.AllPackages, macros });
const svg = new mj.SVG({ fontCache: 'none' });     // 'none' keeps every SVG self-contained when inlined
const html = mj.mathjax.document('', { InputJax: tex, OutputJax: svg });
const out = input.map((item) => {
  const src = typeof item === 'string' ? item : item.tex;
  const display = typeof item === 'string' ? src.startsWith('\\displaystyle') : !!item.display;
  const node = html.convert(src, { display });
  let s = adaptor.outerHTML(node);
  const m = s.match(/<svg[\s\S]*<\/svg>/);
  s = m ? m[0] : s;
  for (const [name, css] of Object.entries(colors)) s = s.split(`"${name}"`).join(`"${css}"`);
  return s;
});
process.stdout.write(JSON.stringify(out));
