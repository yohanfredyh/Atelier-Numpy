// Générateurs d'illustrations SVG (toutes les valeurs numériques sont calculées ici)
const C = {
  teal: '#0f766e', tealL: '#ccebe6', tealXL: '#e7f5f3',
  orange: '#c2410c', orangeL: '#fbd5bf', orangeXL: '#fdf0e8',
  violet: '#6d28d9', violetL: '#ddd0fa', violetXL: '#f1ebfd',
  navy: '#14213d', ink: '#1c2333', gray: '#64748b', grayL: '#e2e8f0', grayXL: '#f1f5f9',
  blue: '#2563eb', blueL: '#dbeafe', red: '#dc2626', redL: '#fee2e2', green: '#15803d', greenL: '#dcfce7',
  amber: '#d97706', amberL: '#fef3c7',
};
const F = `font-family="Inter,Helvetica,sans-serif"`;

function svg(w, h, body, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${F}>
<defs>
${['ink', 'teal', 'orange', 'violet', 'gray', 'navy', 'red'].map(k => `<marker id="${id}-a-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C[k] || C.ink}"/></marker>`).join('\n')}
</defs>${body}</svg>`;
}
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 12}" fill="${o.fill || C.ink}" text-anchor="${o.anchor || 'middle'}" font-weight="${o.w || 400}" ${o.italic ? 'font-style="italic"' : ''} ${o.family ? `font-family="${o.family}"` : ''} dominant-baseline="${o.base || 'middle'}">${s}</text>`;
const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${o.fill || 'none'}" stroke="${o.stroke || 'none'}" stroke-width="${o.sw || 1}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.op ? `opacity="${o.op}"` : ''}/>`;
const L = (x1, y1, x2, y2, id, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[o.c || 'ink']}" stroke-width="${o.sw || 1.6}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.noarrow ? '' : `marker-end="url(#${id}-a-${o.c || 'ink'})"`}/>`;
const P = (d, id, o = {}) => `<path d="${d}" fill="none" stroke="${C[o.c || 'ink']}" stroke-width="${o.sw || 1.6}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.noarrow ? '' : `marker-end="url(#${id}-a-${o.c || 'ink'})"`}/>`;
const M = (x, y, s, o = {}) => T(x, y, s, { family: 'Serif4,Georgia,serif', italic: true, ...o });
function box(x, y, w, h, label, o = {}) {
  return R(x, y, w, h, { rx: o.rx ?? 7, fill: o.fill || C.grayXL, stroke: o.stroke || C.gray, sw: o.sw || 1.2, dash: o.dash }) +
    (Array.isArray(label) ? label.map((l, i) => T(x + w / 2, y + h / 2 + (i - (label.length - 1) / 2) * (o.lh || 14), l, { size: o.size || 11.5, w: o.w || 600, fill: o.tc || C.ink })).join('')
      : T(x + w / 2, y + h / 2 + 0.5, label, { size: o.size || 11.5, w: o.w || 600, fill: o.tc || C.ink }));
}
function grid(x, y, M_, cs, o = {}) {
  let s = '';
  M_.forEach((row, i) => row.forEach((v, j) => {
    const fill = o.fillFn ? o.fillFn(v, i, j) : (o.fill || '#fff');
    s += R(x + j * cs, y + i * cs, cs, cs, { fill, stroke: o.stroke || '#94a3b8', sw: 0.8 });
    if (v !== null && v !== undefined && !o.novals) s += T(x + j * cs + cs / 2, y + i * cs + cs / 2 + 0.5, v, { size: o.size || 11, fill: o.tcFn ? o.tcFn(v, i, j) : C.ink, w: 500 });
  }));
  return s;
}
// pseudo aléatoire déterministe
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// ============ PARTIE 9 ============
function pixels() {
  const id = 'px';
  const img = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 40, 230, 250, 240, 60, 0],
    [0, 0, 0, 10, 220, 90, 0],
    [0, 0, 0, 120, 200, 0, 0],
    [0, 0, 30, 240, 60, 0, 0],
    [0, 0, 180, 150, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]];
  const cs = 30;
  let s = T(110, 14, 'Image en niveaux de gris (H×W)', { size: 11.5, w: 700, fill: C.navy });
  s += grid(5, 28, img, cs, { fillFn: v => `rgb(${v},${v},${v})`, tcFn: v => v > 120 ? C.ink : '#fff', size: 9.5 });
  s += T(110, 252, 'pixel = intensité ∈ [0, 255]', { size: 10.5, fill: C.gray });
  s += L(232, 132, 290, 132, id, { c: 'teal', sw: 2 });
  s += T(261, 118, '÷ 255', { size: 10.5, fill: C.teal, w: 600 });
  // RGB stack
  const cols = [['#fecaca', '#dc2626', 'R'], ['#bbf7d0', '#16a34a', 'G'], ['#bfdbfe', '#2563eb', 'B']];
  s += T(420, 14, 'Image couleur : tenseur C×H×W', { size: 11.5, w: 700, fill: C.navy });
  cols.forEach(([f, st, n], k) => {
    const x = 330 + k * 26, y = 58 - k * 0 + k * 22;
    s += R(x, y, 150, 150, { fill: f, stroke: st, sw: 1.5, op: 0.95 });
    for (let i = 1; i < 5; i++) { s += `<line x1="${x}" y1="${y + i * 30}" x2="${x + 150}" y2="${y + i * 30}" stroke="${st}" stroke-opacity=".25"/><line x1="${x + i * 30}" y1="${y}" x2="${x + i * 30}" y2="${y + 150}" stroke="${st}" stroke-opacity=".25"/>`; }
    s += T(x + 12, y + 13, n, { size: 12, w: 800, fill: st });
  });
  s += T(530, 216, 'H', { size: 12, fill: C.gray, w: 600, italic: true });
  s += T(457, 262, 'W', { size: 12, fill: C.gray, w: 600, italic: true });
  s += T(342, 42, 'C = 3 canaux', { size: 10.5, fill: C.gray, anchor: 'start' });
  // shapes info
  s += R(568, 60, 150, 128, { rx: 8, fill: C.tealXL, stroke: C.teal });
  s += T(643, 80, 'Conventions', { size: 11, w: 700, fill: C.teal });
  s += T(643, 102, 'PyTorch : (N, C, H, W)', { size: 10, fill: C.ink });
  s += T(643, 120, 'TF / PIL : (H, W, C)', { size: 10, fill: C.ink });
  s += T(643, 142, '224×224×3', { size: 10, fill: C.ink });
  s += T(643, 158, '= 150 528 valeurs', { size: 10, fill: C.ink, w: 700 });
  s += T(643, 176, 'par image', { size: 10, fill: C.gray });
  return svg(725, 270, s, id);
}

function conv() {
  const id = 'cv';
  const X = [[1, 2, 0, 1, 3], [0, 1, 3, 2, 1], [2, 1, 0, 1, 0], [1, 3, 2, 0, 2], [0, 2, 1, 3, 1]];
  const K = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
  const Y = [0, 1, 2].map(i => [0, 1, 2].map(j => { let a = 0; for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) a += X[i + u][j + v] * K[u][v]; return a; }));
  const hi = [1, 2]; // fenêtre mise en valeur -> Y[1][2]
  const cs = 34;
  let s = '';
  s += T(90, 14, 'Entrée X (5×5)', { size: 11.5, w: 700, fill: C.navy });
  s += grid(5, 28, X, cs, { fillFn: (v, i, j) => (i >= hi[0] && i < hi[0] + 3 && j >= hi[1] && j < hi[1] + 3) ? C.tealL : '#fff' });
  s += R(5 + hi[1] * cs, 28 + hi[0] * cs, 3 * cs, 3 * cs, { stroke: C.teal, sw: 3 });
  s += T(203, 105, '⊛', { size: 26, fill: C.navy });
  s += T(292, 14, 'Filtre K (3×3)', { size: 11.5, w: 700, fill: C.navy });
  s += T(292, 30, 'Sobel vertical', { size: 9.5, fill: C.gray });
  s += grid(241, 45, K, cs, { fillFn: v => v > 0 ? C.blueL : v < 0 ? C.redL : '#fff' });
  s += T(380, 105, '=', { size: 24, fill: C.navy });
  s += T(469, 14, 'Carte de caractéristiques Y (3×3)', { size: 11.5, w: 700, fill: C.navy });
  s += grid(418, 45, Y, cs, { fillFn: (v, i, j) => (i === hi[0] && j === hi[1]) ? C.teal : '#fff', tcFn: (v, i, j) => (i === hi[0] && j === hi[1]) ? '#fff' : C.ink });
  // lien fenêtre -> sortie
  // calcul
  const terms = [];
  for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) if (K[u][v] !== 0) terms.push(`${K[u][v]}·${X[hi[0] + u][hi[1] + v]}`);
  s += R(5, 205, 720, 30, { rx: 7, fill: C.tealXL, stroke: C.teal });
  s += T(365, 220, `Y[1,2] = ${terms.join(' + ').replace(/\+ -/g, '− ')} = ${Y[hi[0]][hi[1]]}`, { size: 11, fill: C.ink, w: 600 });
  s += T(620, 80, 'Les mêmes 9 poids', { size: 10, fill: C.gray, anchor: 'start' });
  s += T(620, 95, 'glissent sur toute', { size: 10, fill: C.gray, anchor: 'start' });
  s += T(620, 110, "l'image :", { size: 10, fill: C.gray, anchor: 'start' });
  s += T(620, 128, 'partage des poids', { size: 10.5, fill: C.teal, anchor: 'start', w: 700 });
  return { svg: svg(730, 240, s, id), Y, X, K };
}

function padstride() {
  const id = 'ps';
  const cs = 24;
  let s = '';
  // padding P=1 stride 2
  s += T(110, 12, 'Padding P=1, stride S=2, K=3', { size: 11.5, w: 700, fill: C.navy });
  const P0 = Array.from({ length: 7 }, (_, i) => Array.from({ length: 7 }, (_, j) => (i === 0 || j === 0 || i === 6 || j === 6) ? 0 : null));
  s += grid(20, 26, P0, cs, { fillFn: (v, i, j) => (i === 0 || j === 0 || i === 6 || j === 6) ? C.grayXL : C.tealXL, size: 9, tcFn: () => C.gray });
  // windows at stride 2
  const wins = [[0, 0, C.teal], [0, 2, C.orange], [2, 0, C.violet]];
  wins.forEach(([i, j, c], k) => { s += R(20 + j * cs + 2 * k * 0, 26 + i * cs, 3 * cs, 3 * cs, { stroke: c, sw: 2.6, dash: k ? '5 3' : null, rx: 2 }); });
  s += T(104, 207, 'entrée 5×5 + bordure de zéros', { size: 9.5, fill: C.gray });
  s += L(200, 110, 240, 110, id, { c: 'gray' });
  const O = [[null, null, null], [null, null, null], [null, null, null]];
  s += grid(250, 74, O, cs, { fillFn: (v, i, j) => (i === 0 && j === 0) ? C.tealL : (i === 0 && j === 1) ? C.orangeL : (i === 1 && j === 0) ? C.violetL : '#fff' });
  s += T(286, 160, 'sortie 3×3', { size: 9.5, fill: C.gray });
  s += T(286, 176, '⌊(5+2−3)/2⌋+1 = 3', { size: 9.5, fill: C.navy, w: 600 });
  // max pool
  const A = [[1, 3, 2, 0], [4, 6, 1, 2], [0, 2, 9, 5], [3, 1, 7, 8]];
  const quad = (i, j) => ((i < 2) ? 0 : 2) + ((j < 2) ? 0 : 1);
  const qc = [C.tealL, C.orangeL, C.violetL, C.amberL];
  const qs = [C.teal, C.orange, C.violet, C.amber];
  const mp = [[6, 2], [3, 9]];
  const ap = [['3,5', '1,25'], ['1,5', '7,25']];
  s += T(510, 12, 'Pooling 2×2, stride 2', { size: 11.5, w: 700, fill: C.navy });
  s += grid(370, 40, A, 30, { fillFn: (v, i, j) => qc[quad(i, j)] });
  s += L(500, 80, 530, 70, id, { c: 'gray' });
  s += L(500, 110, 530, 135, id, { c: 'gray' });
  s += T(587, 34, 'Max pooling', { size: 10, w: 600, fill: C.ink });
  s += grid(557, 44, mp, 30, { fillFn: (v, i, j) => qc[i * 2 + j] });
  s += T(587, 118, 'Average pooling', { size: 10, w: 600, fill: C.ink });
  s += grid(557, 128, ap, 30, { fillFn: (v, i, j) => qc[i * 2 + j], size: 9.5 });
  s += T(430, 176, 'divise H et W par 2', { size: 9.5, fill: C.gray });
  s += T(430, 192, 'aucun paramètre appris', { size: 9.5, fill: C.gray });
  return svg(660, 215, s, id);
}

function cnnarch() {
  const id = 'ca';
  let s = '';
  const blocks = [
    { l: ['Entrée'], d: '3×32×32', h: 120, w: 8, c: '#94a3b8' },
    { l: ['Conv 3×3', '+BN+ReLU'], d: '32×32×32', h: 120, w: 16, c: C.teal },
    { l: ['MaxPool'], d: '32×16×16', h: 70, w: 16, c: '#5eead4' },
    { l: ['Conv 3×3', '+BN+ReLU'], d: '64×16×16', h: 70, w: 26, c: C.teal },
    { l: ['MaxPool'], d: '64×8×8', h: 40, w: 26, c: '#5eead4' },
    { l: ['Conv 3×3', '+BN+ReLU'], d: '128×8×8', h: 40, w: 38, c: C.teal },
    { l: ['Global', 'AvgPool'], d: '128', h: 10, w: 38, c: '#5eead4' },
  ];
  let x = 12; const cy = 110;
  blocks.forEach((b, i) => {
    const dx = b.w * 0.6, dy = b.w * 0.45;
    const y = cy - b.h / 2;
    s += `<polygon points="${x},${y} ${x + dx},${y - dy} ${x + dx + b.w},${y - dy} ${x + b.w},${y}" fill="${b.c}" opacity=".55" stroke="${C.navy}" stroke-width=".7"/>`;
    s += `<polygon points="${x + b.w},${y} ${x + b.w + dx},${y - dy} ${x + b.w + dx},${y + b.h - dy} ${x + b.w},${y + b.h}" fill="${b.c}" opacity=".8" stroke="${C.navy}" stroke-width=".7"/>`;
    s += R(x, y, b.w, b.h, { fill: b.c, stroke: C.navy, sw: 0.7 });
    const mx = x + b.w / 2 + dx / 2;
    b.l.forEach((t, k) => s += T(mx, 188 + k * 13, t, { size: 9.5, w: 600, fill: C.navy }));
    s += T(mx, 30, b.d, { size: 9, fill: C.gray, w: 500 });
    const nx = x + b.w + dx + 34;
    if (i < blocks.length - 1) s += L(x + b.w + dx + 6, cy, nx - 6, cy, id, { c: 'gray', sw: 1.2 });
    x = nx;
  });
  // FC + softmax
  s += box(x, cy - 22, 62, 44, ['Linéaire', '128→10'], { fill: C.orangeXL, stroke: C.orange, size: 9.5 });
  s += L(x + 64, cy, x + 88, cy, id, { c: 'gray', sw: 1.2 });
  s += box(x + 90, cy - 22, 62, 44, ['Softmax', '10 classes'], { fill: C.violetXL, stroke: C.violet, size: 9.5 });
  // brackets
  s += P(`M 20 224 L 20 230 L ${x - 30} 230 L ${x - 30} 224`, id, { c: 'teal', noarrow: true, sw: 1.4 });
  s += T((x - 10) / 2, 243, 'Extracteur de caractéristiques (backbone convolutif)', { size: 10, w: 700, fill: C.teal });
  s += P(`M ${x} 224 L ${x} 230 L ${x + 152} 230 L ${x + 152} 224`, id, { c: 'orange', noarrow: true, sw: 1.4 });
  s += T(x + 76, 243, 'Tête de classification', { size: 10, w: 700, fill: C.orange });
  s += T(380, 262, 'Résolution spatiale ↓   ·   nombre de canaux ↑   ·   champ réceptif ↑', { size: 9.5, fill: C.gray });
  return svg(x + 160, 272, s, id);
}

function residual() {
  const id = 'rs';
  let s = '';
  s += M(30, 75, 'x', { size: 15 });
  s += L(42, 75, 80, 75, id);
  s += box(82, 55, 100, 40, ['Conv-BN-ReLU'], { fill: C.tealXL, stroke: C.teal, size: 10 });
  s += L(184, 75, 212, 75, id);
  s += box(214, 55, 80, 40, ['Conv-BN'], { fill: C.tealXL, stroke: C.teal, size: 10 });
  s += L(296, 75, 326, 75, id);
  s += `<circle cx="338" cy="75" r="11" fill="#fff" stroke="${C.navy}" stroke-width="1.6"/>` + T(338, 76, '+', { size: 16, w: 700 });
  s += P('M 60 75 L 60 25 L 338 25 L 338 62', id, { c: 'orange', sw: 1.8 });
  s += T(200, 15, 'connexion résiduelle (identité)', { size: 10, fill: C.orange, w: 600 });
  s += L(350, 75, 380, 75, id);
  s += box(382, 58, 50, 34, 'ReLU', { size: 10 });
  s += L(434, 75, 460, 75, id);
  s += M(495, 75, 'F(x) + x', { size: 14 });
  s += T(250, 115, 'Le bloc apprend un résidu F(x) ; le gradient circule directement par le raccourci.', { size: 10, fill: C.gray });
  return svg(540, 128, s, id);
}

function transfer() {
  const id = 'tf';
  let s = '';
  const row = (y, title, modes) => {
    s += T(8, y - 14, title, { size: 11.5, w: 700, fill: C.navy, anchor: 'start' });
    s += box(8, y, 52, 46, 'Image', { size: 10 });
    s += L(62, y + 23, 78, y + 23, id, { c: 'gray', sw: 1.2 });
    const names = ['Bloc 1', 'Bloc 2', 'Bloc 3', 'Bloc 4'];
    names.forEach((n, i) => {
      const x = 80 + i * 92, m = modes[i];
      const fill = m === 'frozen' ? '#e2e8f0' : m === 'slow' ? C.tealL : C.teal;
      const tc = m === 'train' ? '#fff' : C.ink;
      s += box(x, y, 80, 46, [n, m === 'frozen' ? 'gelé' : m === 'slow' ? 'lr faible' : 'entraîné'], { fill, stroke: m === 'frozen' ? '#94a3b8' : C.teal, tc, size: 10, lh: 15 });
      if (m === 'frozen') s += `<g transform="translate(${x + 66},${y + 6})"><rect x="0" y="5" width="9" height="7" rx="1.5" fill="${C.gray}"/><path d="M1.8 5 V3 a2.7 2.7 0 0 1 5.4 0 V5" fill="none" stroke="${C.gray}" stroke-width="1.4"/></g>`;
      s += L(x + 82, y + 23, x + 90, y + 23, id, { c: 'gray', sw: 1.2 });
    });
    s += box(450, y, 104, 46, ['Nouvelle tête', 'K classes'], { fill: C.orange, stroke: C.orange, tc: '#fff', size: 10, lh: 15 });
    s += L(556, y + 23, 574, y + 23, id, { c: 'gray', sw: 1.2 });
    s += M(600, y + 23, 'ŷ', { size: 15 });
  };
  s += T(239, 12, 'Backbone préentraîné (ImageNet)', { size: 10, fill: C.teal, w: 700 });
  s += P('M 80 20 L 80 24 L 434 24 L 434 20', id, { c: 'teal', noarrow: true });
  row(58, 'A · Extraction de caractéristiques', ['frozen', 'frozen', 'frozen', 'frozen']);
  row(140, 'B · Fine-tuning partiel (puis complet)', ['frozen', 'frozen', 'slow', 'slow']);
  s += R(8, 200, 630, 26, { rx: 6, fill: C.grayXL });
  s += T(320, 213, 'Les premières couches (bords, textures) sont génériques ; les dernières sont spécifiques à la tâche source.', { size: 9.5, fill: C.gray });
  return svg(640, 230, s, id);
}

function quadrant() {
  const id = 'qd';
  let s = '';
  const x0 = 120, y0 = 30, w = 240, h = 90;
  const cells = [
    ['Peu de données · domaine proche', 'Extraction de caractéristiques', 'tête linéaire seulement', C.tealXL, C.teal],
    ['Beaucoup de données · domaine proche', 'Fine-tuning complet', 'lr faible, toutes les couches', C.tealL, C.teal],
    ['Peu de données · domaine éloigné', 'Fine-tuning des couches hautes', '+ forte augmentation des données', C.orangeXL, C.orange],
    ['Beaucoup de données · domaine éloigné', 'Fine-tuning complet', '(ou entraînement depuis zéro)', C.orangeL, C.orange],
  ];
  cells.forEach(([a, b, c, f, st], k) => {
    const i = Math.floor(k / 2), j = k % 2;
    const x = x0 + j * (w + 8), y = y0 + i * (h + 8);
    s += R(x, y, w, h, { rx: 8, fill: f, stroke: st, sw: 1.2 });
    s += T(x + w / 2, y + 22, a, { size: 9.5, fill: C.gray });
    s += T(x + w / 2, y + 46, b, { size: 12, fill: st, w: 700 });
    s += T(x + w / 2, y + 66, c, { size: 10, fill: C.ink });
  });
  s += T(x0 + w / 2, 18, 'Petit jeu de données', { size: 10.5, w: 700, fill: C.navy });
  s += T(x0 + w + 8 + w / 2, 18, 'Grand jeu de données', { size: 10.5, w: 700, fill: C.navy });
  s += T(60, y0 + h / 2, 'Domaine', { size: 10.5, w: 700, fill: C.navy });
  s += T(60, y0 + h / 2 + 15, 'similaire', { size: 10.5, w: 700, fill: C.navy });
  s += T(60, y0 + h * 1.5 + 8, 'Domaine', { size: 10.5, w: 700, fill: C.navy });
  s += T(60, y0 + h * 1.5 + 23, 'différent', { size: 10.5, w: 700, fill: C.navy });
  return svg(620, 232, s, id);
}

// ============ PARTIE 10 ============
function timeseries() {
  const id = 'ts';
  const r = rng(7);
  const N = 120; const pts = []; const tr = [];
  for (let t = 0; t < N; t++) {
    const trend = 10 + 0.06 * t;
    const seas = 3 * Math.sin(2 * Math.PI * t / 12);
    const noise = (r() - 0.5) * 2.2;
    pts.push(trend + seas + noise); tr.push(trend);
  }
  const W = 660, H = 190, x0 = 40, y0 = 15, pw = W - x0 - 10, ph = 140;
  const ymin = 4, ymax = 22;
  const X = t => x0 + t / (N - 1) * pw, Y = v => y0 + ph - (v - ymin) / (ymax - ymin) * ph;
  let s = '';
  for (let v = 5; v <= 20; v += 5) s += `<line x1="${x0}" y1="${Y(v)}" x2="${x0 + pw}" y2="${Y(v)}" stroke="${C.grayL}"/>` + T(x0 - 6, Y(v), v, { size: 9, fill: C.gray, anchor: 'end' });
  s += `<line x1="${x0}" y1="${y0 + ph}" x2="${x0 + pw}" y2="${y0 + ph}" stroke="${C.gray}"/>`;
  s += `<polyline points="${pts.map((v, t) => `${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${C.orange}" stroke-width="1.8"/>`;
  s += `<polyline points="${tr.map((v, t) => `${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${C.navy}" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  // période
  s += P(`M ${X(27)} ${Y(19.5)} L ${X(39)} ${Y(19.5)}`, id, { c: 'violet', sw: 1.4 });
  s += P(`M ${X(39)} ${Y(19.5)} L ${X(27)} ${Y(19.5)}`, id, { c: 'violet', sw: 1.4 });
  s += T(X(33), Y(19.5) - 10, 'saisonnalité (période 12)', { size: 9.5, fill: C.violet, w: 600 });
  s += T(x0 + pw / 2, 178, 'temps t →', { size: 9.5, fill: C.gray });
  s += `<line x1="${W - 230}" y1="${y0 + ph + 30}" x2="${W - 210}" y2="${y0 + ph + 30}" stroke="${C.orange}" stroke-width="2"/>` + T(W - 205, y0 + ph + 30, 'série observée', { size: 9.5, anchor: 'start' });
  s += `<line x1="${W - 120}" y1="${y0 + ph + 30}" x2="${W - 100}" y2="${y0 + ph + 30}" stroke="${C.navy}" stroke-width="2" stroke-dasharray="5 3"/>` + T(W - 95, y0 + ph + 30, 'tendance', { size: 9.5, anchor: 'start' });
  return svg(W, H, s, id);
}

function windows() {
  const id = 'wd';
  let s = '';
  const Tn = 16, cs = 34, x0 = 90, L_ = 5, Hh = 2;
  s += T(10, 22, 'Série', { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
  for (let t = 0; t < Tn; t++) { s += R(x0 + t * cs, 10, cs, 24, { fill: '#fff', stroke: '#94a3b8' }); s += M(x0 + t * cs + cs / 2, 22, `x${String.fromCharCode(0x2080 + ((t + 1) % 10))}`.replace(/x(.)/, (m, d) => t + 1 >= 10 ? `x₁${d}` : `x${d}`), { size: 11 }); }
  const starts = [0, 1, 2, 9];
  starts.forEach((st, k) => {
    const y = 50 + k * 32;
    if (k === 3) { s += T(40, y - 6, '⋮', { size: 18, fill: C.gray, w: 700 }); }
    s += T(10, y + 12, k === 3 ? 'Fenêtre N' : `Fenêtre ${k + 1}`, { size: 10, fill: C.gray, anchor: 'start' });
    for (let t = 0; t < Tn; t++) {
      let fill = C.grayXL, stroke = '#e2e8f0';
      if (t >= st && t < st + L_) { fill = C.orangeL; stroke = C.orange; }
      else if (t >= st + L_ && t < st + L_ + Hh) { fill = C.navy; stroke = C.navy; }
      s += R(x0 + t * cs + 1, y + 1, cs - 2, 22, { rx: 3, fill, stroke });
    }
  });
  const yl = 186;
  s += R(x0, yl, 16, 12, { rx: 2, fill: C.orangeL, stroke: C.orange }) + T(x0 + 22, yl + 6, 'entrée X : L = 5 pas passés (lookback)', { size: 10, anchor: 'start' });
  s += R(x0 + 290, yl, 16, 12, { rx: 2, fill: C.navy }) + T(x0 + 312, yl + 6, 'cible y : horizon H = 2', { size: 10, anchor: 'start' });
  s += T(x0 + 8 * cs, 212, 'Glissement de pas 1  →  N = T − L − H + 1 exemples (ici 16 − 5 − 2 + 1 = 10)', { size: 10, fill: C.gray });
  return svg(x0 + Tn * cs + 10, 222, s, id);
}

function rnn() {
  const id = 'rn';
  let s = '';
  // replié
  s += box(40, 80, 70, 46, 'RNN', { fill: C.orangeXL, stroke: C.orange, size: 12, w: 700 });
  s += P('M 110 92 C 150 70, 150 136, 110 114', id, { c: 'orange', sw: 1.6 });
  s += M(152, 103, 'h', { size: 13, fill: C.orange, anchor: 'start' });
  s += L(75, 165, 75, 128, id); s += M(75, 178, 'xₜ', { size: 14 });
  s += L(75, 78, 75, 42, id); s += M(75, 30, 'yₜ', { size: 14 });
  s += T(200, 103, '=', { size: 26, fill: C.gray });
  s += T(200, 128, 'dépliage', { size: 9.5, fill: C.gray });
  const xs = [250, 370, 490, 610];
  const lab = ['1', '2', '3', 'T'];
  s += M(225, 82, 'h₀', { size: 13 });
  s += L(232, 103, 248, 103, id, { c: 'orange' });
  xs.forEach((x, i) => {
    s += box(x, 80, 70, 46, 'A', { fill: C.orangeXL, stroke: C.orange, size: 12, w: 700 });
    const sub = lab[i] === 'T' ? 'T' : String.fromCharCode(0x2080 + +lab[i]);
    s += L(x + 35, 165, x + 35, 128, id); s += M(x + 35, 178, lab[i] === 'T' ? 'x<tspan baseline-shift="sub" font-size="70%">T</tspan>' : `x${sub}`, { size: 14 });
    s += L(x + 35, 78, x + 35, 42, id); s += M(x + 35, 30, lab[i] === 'T' ? 'y<tspan baseline-shift="sub" font-size="70%">T</tspan>' : `y${sub}`, { size: 14 });
    if (i < 3) {
      const nx = xs[i + 1];
      if (i === 2) { s += T(nx - 25, 103, '···', { size: 16, fill: C.orange, w: 700 }); s += L(x + 72, 103, nx - 38, 103, id, { c: 'orange', noarrow: true }); s += L(nx - 14, 103, nx - 2, 103, id, { c: 'orange' }); }
      else s += L(x + 72, 103, nx - 2, 103, id, { c: 'orange' });
      s += M((x + 70 + nx) / 2, 92, `h${String.fromCharCode(0x2080 + i + 1)}`, { size: 12, fill: C.orange });
    }
  });
  s += T(430, 205, 'Mêmes paramètres (W<tspan baseline-shift="sub" font-size="75%">xh</tspan>, W<tspan baseline-shift="sub" font-size="75%">hh</tspan>, W<tspan baseline-shift="sub" font-size="75%">hy</tspan>) réutilisés à chaque pas de temps', { size: 10, fill: C.gray });
  return svg(700, 215, s, id);
}

function vanish() {
  const id = 'vn';
  const W = 620, H = 200, x0 = 50, y0 = 12, pw = 400, ph = 150;
  const tmax = 40;
  const lg = v => Math.log10(v);
  const ymin = -4, ymax = 2;
  const X = t => x0 + t / tmax * pw, Y = v => y0 + ph - (Math.max(ymin, Math.min(ymax, lg(v))) - ymin) / (ymax - ymin) * ph;
  let s = '';
  for (let e = ymin; e <= ymax; e++) s += `<line x1="${x0}" y1="${Y(10 ** e)}" x2="${x0 + pw}" y2="${Y(10 ** e)}" stroke="${C.grayL}"/>` + T(x0 - 6, Y(10 ** e), `10^${e}`.replace('^', '').replace(/10(-?\d)/, (m, d) => '10' + d.split('').map(c => c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')), { size: 9, fill: C.gray, anchor: 'end' });
  for (let t = 0; t <= tmax; t += 10) s += T(X(t), y0 + ph + 12, t, { size: 9, fill: C.gray });
  s += `<line x1="${x0}" y1="${y0 + ph}" x2="${x0 + pw}" y2="${y0 + ph}" stroke="${C.gray}"/>`;
  const curves = [[1.12, C.red, 'λ = 1,12 → explosion'], [1.0, C.gray, 'λ = 1 (idéal)'], [0.9, C.orange, 'λ = 0,9'], [0.75, C.violet, 'λ = 0,75 → disparition']];
  curves.forEach(([lam, col, lbl], k) => {
    const pts = []; for (let t = 0; t <= tmax; t++) { if (lg(lam ** t) < ymin) { pts.push(`${(X(t-1) + (X(t)-X(t-1)) * (ymin - lg(lam ** (t-1))) / (lg(lam ** t) - lg(lam ** (t-1)))).toFixed(1)},${Y(10 ** ymin).toFixed(1)}`); break; } pts.push(`${X(t).toFixed(1)},${Y(lam ** t).toFixed(1)}`); }
    s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="2" ${lam === 1 ? 'stroke-dasharray="5 4"' : ''}/>`;
    s += `<line x1="470" y1="${40 + k * 26}" x2="492" y2="${40 + k * 26}" stroke="${col}" stroke-width="2.4"/>` + T(498, 40 + k * 26, lbl, { size: 10, anchor: 'start' });
  });
  s += T(x0 + pw / 2, 190, 'distance temporelle t − k', { size: 10, fill: C.gray });
  s += T(14, y0 + ph / 2, '‖∂hₜ/∂hₖ‖ ≈ λᵗ⁻ᵏ', { size: 10, fill: C.navy, w: 600, anchor: 'middle' }).replace('<text ', `<text transform="rotate(-90 14 ${y0 + ph / 2})" `);
  return svg(W, H, s, id);
}

function lstm() {
  const id = 'ls';
  let s = '';
  // cellule
  s += R(70, 30, 440, 220, { rx: 18, fill: '#fffaf6', stroke: C.orange, sw: 1.6 });
  // ligne de cellule
  s += M(30, 60, 'cₜ₋₁', { size: 14, fill: C.navy });
  s += L(50, 60, 150, 60, id, { c: 'navy', sw: 2.4, noarrow: true });
  const op = (x, y, t) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff" stroke="${C.navy}" stroke-width="1.6"/>` + T(x, y + 1, t, { size: 15, w: 700, fill: C.navy });
  s += op(162, 60, '×');
  s += L(174, 60, 288, 60, id, { c: 'navy', sw: 2.4, noarrow: true });
  s += op(300, 60, '+');
  s += L(312, 60, 545, 60, id, { c: 'navy', sw: 2.4 });
  s += M(565, 60, 'cₜ', { size: 14, fill: C.navy });
  // entrée concat
  s += M(30, 225, 'hₜ₋₁', { size: 14, fill: C.navy });
  s += L(52, 225, 110, 225, id, { c: 'ink', noarrow: true });
  s += M(118, 290, 'xₜ', { size: 14, fill: C.navy });
  s += L(118, 278, 118, 225, id, { c: 'ink', noarrow: true });
  s += L(110, 225, 380, 225, id, { c: 'ink', noarrow: true });
  // gates
  const gate = (x, lbl, name, col, colL) => {
    s += L(x, 225, x, 186, id, { c: 'ink' });
    s += box(x - 22, 160, 44, 26, lbl, { fill: colL, stroke: col, size: 13, w: 700 });
    s += T(x + 5, 207, name, { size: 9.5, fill: col, w: 700, anchor: 'start' });
  };
  gate(162, 'σ', 'oubli fₜ', C.red, C.redL);
  gate(232, 'σ', 'entrée iₜ', C.green, C.greenL);
  gate(300, 'tanh', 'candidat', C.blue, C.blueL);
  gate(380, 'σ', 'sortie oₜ', C.violet, C.violetL);
  // connexions
  s += L(162, 158, 162, 74, id, { c: 'red' });
  s += P('M 232 158 L 232 120 L 288 120', id, { c: 'green', noarrow: true });
  s += op(300, 120, '×');
  s += L(300, 158, 300, 134, id, { c: 'blue' });
  s += L(300, 106, 300, 74, id, { c: 'ink' });
  // sortie
  s += P('M 420 60 L 420 92', id, { c: 'navy' });
  s += box(398, 94, 44, 24, 'tanh', { fill: C.blueL, stroke: C.blue, size: 11, w: 700 });
  s += L(420, 120, 420, 140, id, { c: 'ink', noarrow: true });
  s += P('M 380 158 L 380 152 L 408 152', id, { c: 'violet' });
  s += op(420, 152, '×');
  s += P('M 432 152 L 470 152 L 470 225 L 545 225', id, { c: 'ink' });
  s += P('M 470 152 L 470 15 L 545 15', id, { c: 'ink' });
  s += M(565, 225, 'hₜ', { size: 14, fill: C.navy });
  s += M(565, 15, 'hₜ', { size: 14, fill: C.navy });
  s += T(231, 41, 'mémoire à long terme (état de cellule)', { size: 9, fill: C.navy, w: 600 });
  return svg(600, 300, s, id);
}

function chrono() {
  const id = 'ch';
  let s = '';
  const x0 = 150, w = 450, cs = w / 30;
  const r = rng(3);
  const row = (y, lbl, fn, sub) => {
    s += T(10, y + 9, lbl, { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
    if (sub) s += T(10, y + 23, sub, { size: 9, fill: C.gray, anchor: 'start' });
    for (let t = 0; t < 30; t++) { const c = fn(t); if (c) s += R(x0 + t * cs + 0.6, y, cs - 1.2, 18, { rx: 2, fill: c }); }
  };
  const tr = C.orangeL, va = C.amber, te = C.navy;
  const rnd = Array.from({ length: 30 }, () => r());
  row(10, 'Découpage aléatoire', t => rnd[t] < 0.7 ? tr : rnd[t] < 0.85 ? va : te, '✗ fuite du futur');
  row(50, 'Découpage chronologique', t => t < 20 ? tr : t < 25 ? va : te, '✓ passé → futur');
  s += T(10, 104, 'Validation glissante', { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
  s += T(10, 118, '(walk-forward, fenêtre', { size: 9, fill: C.gray, anchor: 'start' });
  s += T(10, 130, 'croissante)', { size: 9, fill: C.gray, anchor: 'start' });
  for (let k = 0; k < 4; k++) {
    const y = 96 + k * 24; const end = 10 + k * 5;
    row(y, '', t => t < end ? tr : t < end + 5 ? va : null);
    s += T(x0 + w + 10, y + 9, `pli ${k + 1}`, { size: 9.5, fill: C.gray, anchor: 'start' });
  }
  s += L(x0, 200, x0 + w, 200, id, { c: 'gray' });
  s += T(x0 + w / 2, 212, 'temps →', { size: 9.5, fill: C.gray });
  const lx = x0;
  s += R(lx, 222, 14, 10, { rx: 2, fill: tr }) + T(lx + 20, 227, 'entraînement', { size: 9.5, anchor: 'start' });
  s += R(lx + 120, 222, 14, 10, { rx: 2, fill: va }) + T(lx + 140, 227, 'validation', { size: 9.5, anchor: 'start' });
  s += R(lx + 230, 222, 14, 10, { rx: 2, fill: te }) + T(lx + 250, 227, 'test', { size: 9.5, anchor: 'start' });
  return svg(650, 238, s, id);
}

// ============ PARTIE 11 ============
function tokens() {
  const id = 'tk';
  let s = '';
  s += T(10, 22, 'Texte', { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
  s += box(120, 8, 360, 28, '« Les transformers apprennent vite »', { fill: '#fff', stroke: C.gray, size: 11.5, w: 500 });
  s += L(300, 38, 300, 56, id, { c: 'violet' });
  s += T(310, 47, 'tokeniseur (sous-mots, WordPiece)', { size: 9.5, fill: C.violet, anchor: 'start' });
  s += T(10, 75, 'Tokens', { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
  const toks = ['[CLS]', 'les', 'transform', '##ers', 'apprennent', 'vite', '[SEP]'];
  const ids = [101, 2175, 19081, 2545, 30412, 13863, 102];
  const ws = [48, 42, 84, 42, 92, 54, 48];
  let x = 120; const xs = [];
  toks.forEach((t, i) => { const sp = i === 0 || i === 6; s += box(x, 62, ws[i], 26, t, { fill: sp ? C.grayXL : C.violetXL, stroke: sp ? C.gray : C.violet, size: 10, w: 600, rx: 5 }); xs.push(x + ws[i] / 2); x += ws[i] + 6; });
  s += T(10, 118, 'Identifiants', { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
  xs.forEach((cx, i) => { s += L(cx, 90, cx, 104, id, { c: 'gray', sw: 1 }); s += T(cx, 117, ids[i], { size: 10, family: 'JBMono,monospace', fill: C.ink }); });
  s += T(10, 165, 'Embeddings', { size: 10.5, w: 700, fill: C.navy, anchor: 'start' });
  s += T(10, 179, 'E[id] ∈ ℝᵈ', { size: 9.5, fill: C.gray, anchor: 'start' });
  const r = rng(11);
  xs.forEach((cx, i) => {
    s += L(cx, 126, cx, 136, id, { c: 'gray', sw: 1 });
    for (let k = 0; k < 6; k++) { const v = r(); const a = 0.15 + 0.85 * v; s += R(cx - 9, 140 + k * 9, 18, 9, { fill: `rgba(109,40,217,${a.toFixed(2)})`, stroke: '#fff', sw: 0.6 }); }
  });
  s += T(xs[6] + 30, 167, 'd = 768', { size: 9.5, fill: C.gray, anchor: 'start' });
  s += T(xs[6] + 30, 181, '(BERT-base)', { size: 9.5, fill: C.gray, anchor: 'start' });
  return svg(640, 200, s, id);
}

function attnmap() {
  const id = 'am';
  const toks = ['Le', 'chat', 'dort', 'car', 'il', 'est', 'fatigué'];
  const A = [
    [.55, .25, .08, .03, .04, .02, .03],
    [.20, .52, .14, .03, .06, .02, .03],
    [.06, .42, .34, .06, .05, .03, .04],
    [.04, .12, .30, .38, .06, .05, .05],
    [.04, .66, .08, .05, .12, .02, .03],
    [.02, .14, .06, .04, .30, .28, .16],
    [.02, .40, .08, .04, .22, .08, .16]];
  const cs = 40, x0 = 90, y0 = 70;
  let s = '';
  toks.forEach((t, j) => s += `<text x="${x0 + j * cs + cs / 2}" y="${y0 - 8}" font-size="10.5" fill="${C.ink}" text-anchor="start" transform="rotate(-40 ${x0 + j * cs + cs / 2} ${y0 - 8})">${t}</text>`);
  toks.forEach((t, i) => s += T(x0 - 8, y0 + i * cs + cs / 2, t, { size: 10.5, anchor: 'end', w: i === 4 ? 700 : 400, fill: i === 4 ? C.violet : C.ink }));
  A.forEach((row, i) => row.forEach((v, j) => {
    s += R(x0 + j * cs, y0 + i * cs, cs, cs, { fill: `rgba(109,40,217,${(0.05 + 0.95 * v / .66).toFixed(2)})`, stroke: '#fff', sw: 1 });
    s += T(x0 + j * cs + cs / 2, y0 + i * cs + cs / 2 + 0.5, v.toFixed(2).replace('0.', ','), { size: 9, fill: v > 0.3 ? '#fff' : C.ink });
  }));
  s += R(x0, y0 + 4 * cs, 7 * cs, cs, { stroke: C.orange, sw: 2.5 });
  s += T(x0 + 3.5 * cs, y0 + 7 * cs + 18, 'clés (positions regardées)  →', { size: 10, fill: C.gray });
  s += `<text x="22" y="${y0 + 3.5 * cs}" font-size="10" fill="${C.gray}" text-anchor="middle" transform="rotate(-90 22 ${y0 + 3.5 * cs})">requêtes (positions qui regardent)</text>`;
  // explication à droite
  const ex = x0 + 7 * cs + 30;
  s += T(ex, 110, 'Chaque ligne = une distribution', { size: 10.5, anchor: 'start', w: 600, fill: C.navy });
  s += T(ex, 126, 'de probabilité (somme = 1).', { size: 10.5, anchor: 'start', fill: C.navy });
  s += T(ex, 160, 'Ligne « il » : 66 % de l’attention', { size: 10.5, anchor: 'start', fill: C.orange, w: 600 });
  s += T(ex, 176, 'se porte sur « chat » → la', { size: 10.5, anchor: 'start', fill: C.orange });
  s += T(ex, 192, 'coréférence est résolue.', { size: 10.5, anchor: 'start', fill: C.orange });
  s += T(ex, 226, 'Représentation de sortie :', { size: 10.5, anchor: 'start', fill: C.navy });
  s += T(ex, 244, 'z<tspan baseline-shift="sub" font-size="70%">il</tspan> = Σ<tspan baseline-shift="sub" font-size="70%">j</tspan> α<tspan baseline-shift="sub" font-size="70%">il,j</tspan> v<tspan baseline-shift="sub" font-size="70%">j</tspan>', { size: 12.5, anchor: 'start', fill: C.navy, family: 'Serif4', italic: true });
  return svg(ex + 210, y0 + 7 * cs + 30, s, id);
}

function sdpa() {
  const id = 'sd';
  let s = '';
  // gauche : scaled dot product
  const cx = 150;
  s += T(cx, 12, 'Attention produit scalaire normalisée', { size: 11, w: 700, fill: C.navy });
  const steps = [['MatMul', 'Q Kᵀ'], ['Échelle', '÷ √dₖ'], ['Masque', '(optionnel)'], ['Softmax', 'par ligne'], ['MatMul', '× V']];
  const ys = [250, 200, 150, 100, 45];
  const cols = [[C.violetXL, C.violet], [C.grayXL, C.gray], [C.redL, C.red], [C.greenL, C.green], [C.violetXL, C.violet]];
  s += M(cx - 50, 312, 'Q', { size: 15, w: 700 }); s += M(cx, 312, 'K', { size: 15, w: 700 }); s += M(cx + 80, 312, 'V', { size: 15, w: 700 });
  s += L(cx - 50, 300, cx - 30, 278, id); s += L(cx, 300, cx - 10, 278, id);
  steps.forEach(([a, b], i) => {
    s += box(cx - 70, ys[i], 120, 28, `${a}  ${b}`, { fill: cols[i][0], stroke: cols[i][1], size: 10.5 });
    if (i < steps.length - 1) s += L(cx - 10, ys[i] - 2, cx - 10, ys[i + 1] + 30, id);
  });
  s += P(`M ${cx + 80} 300 L ${cx + 80} 59 L ${cx + 52} 59`, id);
  s += L(cx - 10, 43, cx - 10, 26, id, { noarrow: true });
  // droite : multi-tête
  const ox = 330;
  s += T(ox + 165, 12, 'Attention multi-têtes', { size: 11, w: 700, fill: C.navy });
  ['Q', 'K', 'V'].forEach((n, i) => {
    const x = ox + 40 + i * 100;
    s += M(x + 30, 312, n, { size: 15, w: 700 });
    s += L(x + 30, 300, x + 30, 280, id);
    for (let k = 2; k >= 0; k--) s += box(x + k * 5, 250 - k * 5, 60, 28, k === 0 ? 'Linéaire' : '', { fill: '#fff', stroke: C.violet, size: 10 });
    s += L(x + 30, 245, ox + 165, 197, id, { c: 'gray', sw: 1 });
  });
  for (let k = 2; k >= 0; k--) s += box(ox + 70 + k * 7, 160 - k * 7, 190, 34, k === 0 ? ['Attention normalisée', 'h têtes en parallèle'] : '', { fill: k === 0 ? C.violetXL : '#fff', stroke: C.violet, size: 10, lh: 13 });
  s += T(ox + 300, 145, 'h', { size: 13, w: 700, fill: C.violet, italic: true });
  s += L(ox + 165, 144, ox + 165, 118, id);
  s += box(ox + 115, 90, 100, 28, 'Concat', { fill: C.grayXL, stroke: C.gray, size: 10.5 });
  s += L(ox + 165, 88, ox + 165, 70, id);
  s += box(ox + 115, 42, 100, 28, ['Linéaire  Wᴼ'], { fill: '#fff', stroke: C.violet, size: 10.5 });
  s += L(ox + 165, 40, ox + 165, 24, id, { noarrow: true });
  return svg(680, 322, s, id);
}

function pe() {
  const id = 'pe';
  const P_ = 100, D = 64, cw = 7, ch = 2.2, x0 = 50, y0 = 20;
  let s = '';
  for (let p = 0; p < P_; p++) for (let i = 0; i < D; i++) {
    const k = Math.floor(i / 2); const ang = p / Math.pow(10000, 2 * k / D);
    const v = i % 2 === 0 ? Math.sin(ang) : Math.cos(ang);
    const t = (v + 1) / 2;
    // divergente violet -> blanc -> orange
    const a = [109, 40, 217], b = [255, 255, 255], c = [234, 88, 12];
    const mix = (u, w, f) => u.map((x, j) => Math.round(x + (w[j] - x) * f));
    const col = t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2);
    s += `<rect x="${(x0 + i * cw).toFixed(1)}" y="${(y0 + p * ch).toFixed(1)}" width="${cw + 0.3}" height="${ch + 0.3}" fill="rgb(${col.join(',')})"/>`;
  }
  s += T(x0 + D * cw / 2, 10, 'dimension i de l’encodage (d = 64) →', { size: 10, fill: C.gray });
  s += `<text x="30" y="${y0 + P_ * ch / 2}" font-size="10" fill="${C.gray}" text-anchor="middle" transform="rotate(-90 30 ${y0 + P_ * ch / 2})">position pos (0 → 49) →</text>`;
  // légende
  const lx = x0 + D * cw + 25;
  for (let k = 0; k < 50; k++) {
    const t = 1 - k / 49; const a = [109, 40, 217], b = [255, 255, 255], c = [234, 88, 12];
    const mix = (u, w, f) => u.map((x, j) => Math.round(x + (w[j] - x) * f));
    const col = t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2);
    s += `<rect x="${lx}" y="${y0 + k * 3}" width="12" height="3.2" fill="rgb(${col.join(',')})"/>`;
  }
  s += T(lx + 18, y0 + 3, '+1', { size: 9.5, anchor: 'start' }); s += T(lx + 18, y0 + 75, '0', { size: 9.5, anchor: 'start' }); s += T(lx + 18, y0 + 147, '−1', { size: 9.5, anchor: 'start' });
  s += T(lx, y0 + 175, 'Basses dimensions :', { size: 10, anchor: 'start', w: 600, fill: C.navy });
  s += T(lx, y0 + 189, 'haute fréquence', { size: 10, anchor: 'start' });
  s += T(lx, y0 + 207, 'Hautes dimensions :', { size: 10, anchor: 'start', w: 600, fill: C.navy });
  s += T(lx, y0 + 221, 'basse fréquence', { size: 10, anchor: 'start' });
  return svg(lx + 120, y0 + P_ * ch + 10, s, id);
}

function transformer() {
  const id = 'tr';
  let s = '';
  const block = (x, y, w, h, c) => R(x, y, w, h, { rx: 14, fill: c, stroke: C.gray, sw: 1.2 });
  // ENCODEUR
  const ex = 60, ew = 210;
  s += block(ex, 120, ew, 200, '#f8fafc');
  s += T(ex - 14, 220, 'N×', { size: 14, w: 800, fill: C.navy, anchor: 'end' });
  s += box(ex + 20, 268, ew - 40, 34, ['Attention multi-têtes'], { fill: C.violetXL, stroke: C.violet, size: 10.5 });
  s += box(ex + 20, 236, ew - 40, 22, 'Add & LayerNorm', { fill: C.amberL, stroke: C.amber, size: 10 });
  s += box(ex + 20, 176, ew - 40, 34, 'Feed-Forward (MLP)', { fill: C.blueL, stroke: C.blue, size: 10.5 });
  s += box(ex + 20, 144, ew - 40, 22, 'Add & LayerNorm', { fill: C.amberL, stroke: C.amber, size: 10 });
  s += box(ex + 20, 345, ew - 40, 30, 'Embedding + Position', { fill: C.grayXL, stroke: C.gray, size: 10.5 });
  s += T(ex + ew / 2, 400, 'Entrées (source)', { size: 10.5, w: 600 });
  s += L(ex + ew / 2, 390, ex + ew / 2, 377, id);
  s += L(ex + ew / 2, 343, ex + ew / 2, 304, id);
  // résiduelles
  s += P(`M ${ex + ew / 2} 330 L ${ex + 10} 330 L ${ex + 10} 247 L ${ex + 18} 247`, id, { c: 'amber' in C ? 'orange' : 'ink', sw: 1.2 });
  s += P(`M ${ex + ew / 2} 228 L ${ex + 10} 228 L ${ex + 10} 155 L ${ex + 18} 155`, id, { c: 'orange', sw: 1.2 });
  s += L(ex + ew / 2, 266, ex + ew / 2, 260, id);
  s += L(ex + ew / 2, 234, ex + ew / 2, 212, id);
  s += L(ex + ew / 2, 174, ex + ew / 2, 168, id);
  s += T(ex + ew / 2, 420, 'ENCODEUR', { size: 11, w: 800, fill: C.navy });
  // DECODEUR
  const dx = 350, dw = 220;
  s += block(dx, 50, dw, 270, '#f8fafc');
  s += T(dx + dw + 14, 190, '×N', { size: 14, w: 800, fill: C.navy, anchor: 'start' });
  s += box(dx + 20, 268, dw - 40, 34, ['Attention multi-têtes masquée'], { fill: C.violetXL, stroke: C.violet, size: 10 });
  s += box(dx + 20, 236, dw - 40, 22, 'Add & LayerNorm', { fill: C.amberL, stroke: C.amber, size: 10 });
  s += box(dx + 20, 176, dw - 40, 34, ['Attention croisée'], { fill: '#ede9fe', stroke: C.violet, size: 10.5 });
  s += box(dx + 20, 144, dw - 40, 22, 'Add & LayerNorm', { fill: C.amberL, stroke: C.amber, size: 10 });
  s += box(dx + 20, 92, dw - 40, 34, 'Feed-Forward (MLP)', { fill: C.blueL, stroke: C.blue, size: 10.5 });
  s += box(dx + 20, 60, dw - 40, 22, 'Add & LayerNorm', { fill: C.amberL, stroke: C.amber, size: 10 });
  s += box(dx + 20, 345, dw - 40, 30, 'Embedding + Position', { fill: C.grayXL, stroke: C.gray, size: 10.5 });
  s += T(dx + dw / 2, 400, 'Sorties décalées (cible)', { size: 10.5, w: 600 });
  s += L(dx + dw / 2, 390, dx + dw / 2, 377, id);
  s += L(dx + dw / 2, 343, dx + dw / 2, 304, id);
  s += L(dx + dw / 2, 266, dx + dw / 2, 260, id);
  s += L(dx + dw / 2, 234, dx + dw / 2, 212, id);
  s += L(dx + dw / 2, 174, dx + dw / 2, 168, id);
  s += L(dx + dw / 2, 142, dx + dw / 2, 128, id);
  s += L(dx + dw / 2, 90, dx + dw / 2, 84, id);
  s += P(`M ${dx + dw / 2} 330 L ${dx + dw - 8} 330 L ${dx + dw - 8} 247 L ${dx + dw - 18} 247`, id, { c: 'orange', sw: 1.2 });
  s += P(`M ${dx + dw / 2} 228 L ${dx + dw - 8} 228 L ${dx + dw - 8} 155 L ${dx + dw - 18} 155`, id, { c: 'orange', sw: 1.2 });
  s += P(`M ${dx + dw / 2} 136 L ${dx + dw - 8} 136 L ${dx + dw - 8} 71 L ${dx + dw - 18} 71`, id, { c: 'orange', sw: 1.2 });
  // cross attention arrow K,V
  s += P(`M ${ex + ew / 2} 142 L ${ex + ew / 2} 95 L 305 95 L 305 193 L ${dx + 18} 193`, id, { c: 'violet', sw: 2 });
  s += T(310, 110, 'K, V', { size: 11, w: 700, fill: C.violet, anchor: 'start', italic: true });
  // sortie
  s += L(dx + dw / 2, 58, dx + dw / 2, 40, id);
  s += box(dx + 30, 12, 75, 26, 'Linéaire', { fill: '#fff', stroke: C.gray, size: 10 });
  s += box(dx + dw - 105, 12, 75, 26, 'Softmax', { fill: C.greenL, stroke: C.green, size: 10 });
  s += L(dx + 107, 25, dx + dw - 107, 25, id, { c: 'gray', sw: 1.2 });
  s += T(dx + dw + 20, 25, 'P(token suivant)', { size: 10, anchor: 'start', w: 600 });
  s += T(dx + dw / 2, 333, '', {});
  s += T(dx + dw / 2 - 40, 0, '', {});
  s += T(dx + dw / 2, 420, 'DÉCODEUR', { size: 11, w: 800, fill: C.navy });
  return svg(700, 430, s, id);
}

function masks() {
  const id = 'mk';
  let s = '';
  const n = 6, cs = 20;
  const draw = (x0, title, sub, fn, col) => {
    s += T(x0 + n * cs / 2, 12, title, { size: 11, w: 700, fill: C.navy });
    s += T(x0 + n * cs / 2, 27, sub, { size: 9.5, fill: C.gray });
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += R(x0 + j * cs, 38 + i * cs, cs, cs, { fill: fn(i, j) ? col : '#f1f5f9', stroke: '#fff', sw: 1.2 });
  };
  draw(40, 'Encodeur (BERT)', 'attention bidirectionnelle', () => true, '#a78bfa');
  draw(260, 'Décodeur (GPT)', 'masque causal : j ≤ i', (i, j) => j <= i, C.orange);
  draw(480, 'Préfixe / enc-déc', 'source complète + cible causale', (i, j) => j < 3 || j <= i, C.teal);
  s += T(350, 175, 'Case colorée = la position i (ligne) peut regarder la position j (colonne) ; case grise = score mis à −∞.', { size: 9.5, fill: C.gray });
  return svg(680, 185, s, id);
}

function lora() {
  const id = 'lr';
  let s = '';
  s += M(250, 285, 'x ∈ ℝᵈ', { size: 14 });
  s += L(250, 272, 250, 256, id, { noarrow: true });
  s += P('M 250 256 L 120 256 L 120 232', id); s += P('M 250 256 L 370 256 L 370 232', id);
  // W0
  s += R(50, 82, 140, 148, { rx: 6, fill: '#e2e8f0', stroke: '#94a3b8', sw: 1.4 });
  s += M(120, 150, 'W₀', { size: 18, w: 700 });
  s += T(120, 172, 'd × d  ·  gelé', { size: 10, fill: C.gray });
  s += `<g transform="translate(160,92)"><rect x="0" y="6" width="14" height="10" rx="2" fill="${C.gray}"/><path d="M3 6 V3.5 a4 4 0 0 1 8 0 V6" fill="none" stroke="${C.gray}" stroke-width="1.8"/></g>`;
  // A, B
  s += `<polygon points="300,230 440,230 390,190 350,190" fill="${C.violetXL}" stroke="${C.violet}" stroke-width="1.4"/>`;
  s += M(370, 212, 'A', { size: 15, w: 700, fill: C.violet }); s += T(470, 212, 'r × d  (A aléatoire)', { size: 10, fill: C.violet, anchor: 'start' });
  s += `<polygon points="350,124 390,124 440,82 300,82" fill="${C.violetXL}" stroke="${C.violet}" stroke-width="1.4"/>`;
  s += M(370, 103, 'B', { size: 15, w: 700, fill: C.violet }); s += T(470, 103, 'd × r  (B = 0 au départ)', { size: 10, fill: C.violet, anchor: 'start' });
  s += L(370, 188, 370, 126, id, { c: 'violet' });
  s += T(385, 157, 'r ≪ d', { size: 11, w: 700, fill: C.violet, anchor: 'start' });
  // sum
  s += P('M 120 80 L 120 50 L 236 50', id); s += P('M 370 80 L 370 50 L 264 50', id, { c: 'violet' });
  s += `<circle cx="250" cy="50" r="13" fill="#fff" stroke="${C.navy}" stroke-width="1.6"/>` + T(250, 51, '+', { size: 17, w: 700 });
  s += L(250, 37, 250, 18, id);
  s += M(250, 10, 'h = W₀x + (α/r)·BAx', { size: 13 });
  return svg(640, 295, s, id);
}

module.exports = { pixels, conv, padstride, cnnarch, residual, transfer, quadrant, timeseries, windows, rnn, vanish, lstm, chrono, tokens, attnmap, sdpa, pe, transformer, masks, lora };
