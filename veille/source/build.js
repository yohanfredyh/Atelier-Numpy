const fs = require('fs');
const path = require('path');
const katex = require('katex');
const { execSync } = require('child_process');
const D = require('./diagrams');
const { chromium } = require('playwright-core');

const dir = __dirname;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const KW = new Set('def class return for in if else elif while import from as with not and or is None True False lambda yield try except finally raise pass break continue global'.split(' '));
const NB = new Set('print range len super self torch nn np F optim enumerate zip list dict float int sum max min tuple isinstance'.split(' '));
function highlight(code) {
  const re = /(#[^\n]*)|("""[\s\S]*?"""|'[^'\n]*'|"[^"\n]*")|\b(\d+\.?\d*(?:e-?\d+)?)\b|([A-Za-z_]\w*)(\s*\()?/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    if (m[1]) out += `<span class="cm">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="st">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="nu">${m[3]}</span>`;
    else if (m[4]) {
      const w = m[4];
      if (KW.has(w)) out += `<span class="kw">${w}</span>`;
      else if (NB.has(w)) out += `<span class="nb">${w}</span>`;
      else if (m[5]) out += `<span class="fn">${w}</span>`;
      else out += w;
      if (m[5]) out += esc(m[5]);
    }
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}

const macros = { '\\R': '\\mathbb{R}', '\\softmax': '\\operatorname{softmax}', '\\diag': '\\operatorname{diag}' };
const dec = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function renderMath(html) {
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => katex.renderToString(dec(m.trim()), { displayMode: true, throwOnError: true, macros, strict: false }));
  html = html.replace(/\$([^$\n]+?)\$/g, (_, m) => katex.renderToString(dec(m), { displayMode: false, throwOnError: true, macros, strict: false }));
  return html;
}

function process(src) {
  const codes = [];
  src = src.replace(/<pre class="(\w+)">\n?([\s\S]*?)<\/pre>/g, (_, lang, code) => {
    codes.push(`<pre><span class="lang">${lang === 'py' ? 'python' : lang}</span>${lang === 'py' ? highlight(code.replace(/\s+$/, '')) : esc(code.replace(/\s+$/, ''))}</pre>`);
    return `@@CODE${codes.length - 1}@@`;
  });
  src = renderMath(src);
  src = src.replace(/\{\{fig:(\w+)\}\}/g, (_, n) => { const r = D[n](); return typeof r === 'string' ? r : r.svg; });
  src = src.replace(/@@CODE(\d+)@@/g, (_, i) => codes[+i]);
  return src;
}

const parts = ['p9.html', 'p10.html', 'p11.html', 'annexe.html'].map(f => process(read(f)));
const body = parts.join('\n');

// --- Table des matières
function toc(pages) {
  const re = /<h1[^>]*data-toc="([^"]+)"[^>]*data-cls="(\w+)"[^>]*>|<h2 id="([\w-]+)"><span class="n">([^<]+)<\/span>\s*([^<]+)<\/h2>/g;
  let out = '<div class="toc"><h1>Sommaire</h1><div class="lead">Veille Deep Learning — Parties 9, 10 et 11 : vision, séquences et attention.</div>';
  let m, cls = 'sx';
  while ((m = re.exec(body))) {
    if (m[1]) { cls = m[2]; const key = m[1]; out += `<div class="p ${cls}"><span class="lbl">${key}</span><span class="dots"></span><span class="pg">${pages[key] ?? '00'}</span></div>`; }
    else out += `<div class="row"><span class="lbl"><b>${m[4]}</b>${m[5].trim()}</span><span class="dots"></span><span class="pg">${pages[m[3]] ?? '00'}</span></div>`;
  }
  return out + '</div>';
}

const css = read('style.css');
const page = (tocHtml) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Veille Deep Learning — Parties 9 à 11</title>
<link rel="stylesheet" href="node_modules/katex/dist/katex.min.css"><style>${css}</style></head><body>
${tocHtml}
${body}
</body></html>`;

const coverHtml = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css}@page{margin:0}</style></head><body>
<div class="cover">
<svg class="bg" viewBox="0 0 210 297" width="100%" height="100%" preserveAspectRatio="none">
<defs><radialGradient id="g1" cx="85%" cy="12%" r="60%"><stop offset="0" stop-color="#5eead4" stop-opacity=".28"/><stop offset="1" stop-color="#0b1428" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="10%" cy="80%" r="60%"><stop offset="0" stop-color="#a78bfa" stop-opacity=".25"/><stop offset="1" stop-color="#0b1428" stop-opacity="0"/></radialGradient></defs>
<rect width="210" height="297" fill="url(#g1)"/><rect width="210" height="297" fill="url(#g2)"/>
${(() => { // réseau décoratif
    const layers = [[150, [20, 34, 48]], [168, [12, 26, 40, 54]], [186, [20, 34, 48]], [200, [34]]];
    let s = '';
    for (let l = 0; l < layers.length - 1; l++) for (const a of layers[l][1]) for (const b of layers[l + 1][1]) s += `<line x1="${layers[l][0]}" y1="${a}" x2="${layers[l + 1][0]}" y2="${b}" stroke="#5eead4" stroke-opacity=".25" stroke-width=".25"/>`;
    for (const [x, ys] of layers) for (const y of ys) s += `<circle cx="${x}" cy="${y}" r="2.2" fill="#0b1428" stroke="#5eead4" stroke-width=".5"/>`;
    return s;
  })()}
</svg>
<div class="inner">
<div class="tag">Veille technologique · Deep Learning</div>
<h1>Vision, séquences<br/>&amp; <span>attention</span></h1>
<div class="sub">Réseaux convolutifs, réseaux récurrents et Transformers : théorie, mathématiques, illustrations et mise en pratique avec PyTorch &amp; Hugging Face.</div>
</div>
<div class="parts">
<div class="pc" style="border-top:3px solid #14b8a6"><div class="n" style="color:#5eead4">09</div><div class="l">Réseaux convolutifs &amp; apprentissage par transfert</div><div class="d">Convolution, pooling, CNN, ResNet, modèles préentraînés, fine-tuning</div></div>
<div class="pc" style="border-top:3px solid #f97316"><div class="n" style="color:#fdba74">10</div><div class="l">Données séquentielles &amp; réseaux récurrents</div><div class="d">Séries temporelles, fenêtres, RNN, BPTT, LSTM, GRU, validation chronologique</div></div>
<div class="pc" style="border-top:3px solid #8b5cf6"><div class="n" style="color:#c4b5fd">11</div><div class="l">Attention &amp; Transformers</div><div class="d">Tokenisation, Q/K/V, multi-têtes, positions, BERT/GPT/T5, Hugging Face</div></div>
</div>
<div class="foot"><span>Plan de veille Deep Learning · Parties 9 — 10 — 11</span><span>Octobre 2026</span></div>
</div></body></html>`;

const footer = `<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7.5px;color:#8a94a6;padding:0 18mm;display:flex;justify-content:space-between">
<span>Veille Deep Learning · Parties 9 – 11</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage();
  const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
  const render = async (html, file, opts) => {
    const f = path.join(dir, '_tmp.html'); fs.writeFileSync(f, html);
    await pg.goto('file://' + f); await pg.evaluate(() => document.fonts.ready);
    await pg.pdf({ path: path.join(out, file), format: 'A4', printBackground: true, preferCSSPageSize: true, ...opts });
  };
  const bodyOpts = { displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer, outline: true, tagged: true };
  // passe 1 : numéros provisoires
  await render(page(toc({})), 'body.pdf', bodyOpts);
  // localisation des titres (page du PDF final = page du corps + 1 pour la couverture)
  const n = +execSync(`pdfinfo ${out}/body.pdf | grep Pages | awk '{print $2}'`).toString().trim();
  const texts = []; for (let i = 1; i <= n; i++) texts.push(execSync(`pdftotext -f ${i} -l ${i} -layout ${out}/body.pdf -`).toString().replace(/\s+/g, ' '));
  const pages = {};
  const re = /<h1[^>]*data-toc="([^"]+)"[^>]*data-find="([^"]+)"|<h2 id="([\w-]+)"><span class="n">([^<]+)<\/span>\s*([^<]+)<\/h2>/g;
  let m;
  while ((m = re.exec(body))) {
    const key = m[1] || m[3];
    const needle = (m[2] || (m[4] + ' ' + m[5].trim().slice(0, 22))).replace(/\s+/g, ' ');
    const start = 1; // la page 1 est le sommaire
    for (let i = start; i < n; i++) if (texts[i].includes(needle)) { pages[key] = i + 1; if (m[1]) break; }
    if (!pages[key]) console.warn('introuvable :', key, needle);
  }
  await render(page(toc(pages)), 'body.pdf', bodyOpts);
  await render(coverHtml, 'cover.pdf', {});
  await browser.close();
  console.log(JSON.stringify(pages));
})();
