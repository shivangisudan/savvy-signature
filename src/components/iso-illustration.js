// Variant A hero illustration: line-art isometric scene drawn in code.
// Ad spend + WhatsApp follow-ups + Pipeline  ->  Savvy Software engine  ->  Revenue.
// Colours come from CSS custom properties so the scene follows the A tokens.

const COS = 0.866, SIN = 0.5;
let OX = 0, OY = 0;
const P = (x, y, z = 0) => [OX + (x - y) * COS, OY + (x + y) * SIN - z];
const pts = (arr) => arr.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');

function box({ x, y, z = 0, w, d, h, top = 'var(--iso-top)', left = 'var(--iso-left)', right = 'var(--iso-right)', cls = '' }) {
  const T = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  const R = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
  const L = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  return `<g class="iso-box ${cls}">
    <polygon points="${pts(L)}" fill="${left}"/>
    <polygon points="${pts(R)}" fill="${right}"/>
    <polygon points="${pts(T)}" fill="${top}"/>
  </g>`;
}

function line(a, b, cls = 'iso-route') {
  return `<path class="${cls}" d="M${a.map((n) => n.toFixed(1)).join(' ')} L${b.map((n) => n.toFixed(1)).join(' ')}"/>`;
}
function poly(points, cls) {
  return `<path class="${cls}" d="${points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')}"/>`;
}

function tag(anchor, text, tone, dy = -46) {
  const [ax, ay] = anchor;
  const w = text.length * 7.3 + (tone === 'live' ? 34 : 22);
  const x = ax - w / 2, y = ay + dy - 26;
  const dot = tone === 'live' ? `<circle cx="${(x + 13).toFixed(1)}" cy="${(y + 13).toFixed(1)}" r="3" class="iso-tag__dot"/>` : '';
  const tx = tone === 'live' ? x + 23 : x + 11;
  return `<g class="iso-tag iso-tag--${tone}">
    <line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${ax.toFixed(1)}" y2="${(y + 26).toFixed(1)}" class="iso-leader"/>
    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="26" rx="2"/>
    ${dot}<text x="${tx.toFixed(1)}" y="${(y + 17).toFixed(1)}">${text.toUpperCase()}</text>
  </g>`;
}

export function renderIsoIllustration(el) {
  const W = 1280, H = 720;
  OX = 610; OY = 150;
  let s = '';

  // Floor grid
  let grid = '';
  for (let i = -520; i <= 520; i += 40) {
    grid += line(P(i, -520), P(i, 520), 'iso-grid');
    grid += line(P(-520, i), P(520, i), 'iso-grid');
  }
  s += `<g class="iso-grid-wrap">${grid}</g>`;

  // Input pillars (stacked blocks), back-left
  const pillars = [
    { x: -330, y: -40, n: 4, label: 'Ad spend' },
    { x: -330, y: 110, n: 3, label: 'WhatsApp follow-ups' },
    { x: -330, y: 260, n: 2, label: 'Pipeline' },
  ];
  const junction = P(-150, 160);
  let routes = '';
  pillars.forEach((p) => {
    const foot = P(p.x + 64, p.y + 32);
    routes += poly([foot, P(-200, p.y + 32), junction], 'iso-route iso-route--dashed');
  });
  const engineIn = P(-80, 160);
  routes += poly([junction, engineIn], 'iso-route iso-route--dashed');
  s += `<g class="iso-routes">${routes}</g>`;

  // Engine (Savvy Software): base + two layers
  const E = { x: -80, y: 40, w: 260, d: 220 };
  s += box({ x: E.x, y: E.y, w: E.w, d: E.d, h: 44, cls: 'iso-engine-base' });
  s += box({ x: E.x + 20, y: E.y + 20, z: 44, w: E.w - 40, d: E.d - 40, h: 26, top: 'var(--iso-sage-top)', left: 'var(--iso-sage-side)', right: 'var(--iso-sage-side2)', cls: 'iso-engine-mid' });
  s += box({ x: E.x + 46, y: E.y + 46, z: 70, w: E.w - 92, d: E.d - 92, h: 26, top: 'var(--iso-teal-top)', left: 'var(--iso-teal-side)', right: 'var(--iso-teal-side2)', cls: 'iso-engine-top' });
  const c = P(E.x + E.w / 2, E.y + E.d / 2, 96);
  s += `<g class="iso-mark"><ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="30" ry="17"/><text x="${c[0].toFixed(1)}" y="${(c[1] + 6).toFixed(1)}" class="iso-mark__s">S</text><g class="iso-mark__img" data-x="${(c[0] - 13).toFixed(1)}" data-y="${(c[1] - 13).toFixed(1)}"></g></g>`;

  // Output route to revenue plate (solid, animated)
  const R = { x: 300, y: 120, w: 230, d: 150 };
  s += poly([P(E.x + E.w, E.y + E.d / 2 + 30), P(R.x, R.y + R.d / 2)], 'iso-route iso-route--solid');

  // Pillars drawn after routes so they sit on top
  pillars.forEach((p) => {
    for (let i = 0; i < p.n; i++) {
      s += box({ x: p.x, y: p.y, z: i * 26, w: 64, d: 64, h: 22, top: i === p.n - 1 ? 'var(--iso-sage-top)' : 'var(--iso-top)', cls: 'iso-block' });
    }
  });

  // Revenue plate + rising bars
  s += box({ x: R.x, y: R.y, w: R.w, d: R.d, h: 12, cls: 'iso-plate' });
  const bars = [34, 54, 76, 100, 132];
  const barTops = [];
  bars.forEach((bh, i) => {
    const bx = R.x + 22 + i * 40, by = R.y + 50;
    const last = i === bars.length - 1;
    s += box({ x: bx, y: by, z: 12, w: 24, d: 24, h: bh, cls: `iso-bar iso-bar--${i}`, top: last ? 'var(--iso-teal-top)' : 'var(--iso-top)', left: last ? 'var(--iso-teal-side)' : 'var(--iso-left)', right: last ? 'var(--iso-teal-side2)' : 'var(--iso-right)' });
    barTops.push(P(bx + 12, by + 12, 12 + bh + 10));
  });
  s += poly(barTops, 'iso-trend');
  const lt = barTops[barTops.length - 1];
  s += `<path class="iso-trend-head" d="M${(lt[0] - 9).toFixed(1)} ${(lt[1] + 2).toFixed(1)} L${lt[0].toFixed(1)} ${lt[1].toFixed(1)} L${(lt[0] - 3).toFixed(1)} ${(lt[1] + 9).toFixed(1)}"/>`;

  // Tags
  pillars.forEach((p) => { s += tag(P(p.x + 32, p.y + 32, p.n * 26), p.label, 'neutral', -34); });
  s += tag(P(E.x + E.w / 2, E.y + E.d / 2, 112), 'Savvy Software', 'live', -26);
  s += tag(P(R.x + 22 + 4 * 40 + 12, R.y + 62, 12 + 132 + 20), 'Revenue', 'accent', -24);

  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="iso-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${s}</svg>`;

  // Fit the viewBox to the scene itself (grid excluded) so nothing spills out.
  const svg = el.firstElementChild;
  const fit = () => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    svg.querySelectorAll(':scope > g:not(.iso-grid-wrap), :scope > path').forEach((n) => {
      if (getComputedStyle(n).display === 'none') return;
      const b = n.getBBox();
      if (!b.width && !b.height) return;
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
    });
    if (!isFinite(x0)) return;
    const pad = 28;
    svg.setAttribute('viewBox', `${(x0 - pad).toFixed(0)} ${(y0 - pad).toFixed(0)} ${(x1 - x0 + pad * 2).toFixed(0)} ${(y1 - y0 + pad * 2).toFixed(0)}`);
    el.style.aspectRatio = `${(x1 - x0 + pad * 2).toFixed(0)} / ${(y1 - y0 + pad * 2).toFixed(0)}`;
  };
  fit();
  window.addEventListener('resize', () => { clearTimeout(el._fitT); el._fitT = setTimeout(fit, 120); });

  // Logo mark on the engine: only swap in the image if it actually loads.
  const slot = svg.querySelector('.iso-mark__img');
  const probe = new Image();
  probe.onload = () => {
    slot.innerHTML = `<image href="/brand/s-mark.png" x="${slot.dataset.x}" y="${slot.dataset.y}" width="26" height="26"/>`;
    svg.querySelector('.iso-mark__s').style.display = 'none';
  };
  probe.src = '/brand/s-mark.png';
}
