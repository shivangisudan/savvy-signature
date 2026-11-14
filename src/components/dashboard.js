// Savvy Software "Visual Dashboard", rebuilt in HTML from the dashboard on
// savvysignatureindia.com so it stays sharp at every size and the tabs work.

const KPIS = [
  { label: 'Monthly Visitors', value: '48.2K', delta: '+12.4%', note: 'vs previous period', tone: 'blue' },
  { label: 'Conversion Rate', value: '3.8%', delta: '+0.6 pts', note: 'healthy momentum', tone: 'orange' },
  { label: 'Qualified Actions', value: '1,248', delta: '+18.1%', note: 'strong response', tone: 'green' },
  { label: 'Avg. Engagement', value: '6m 12s', delta: 'Stable', note: 'consistent attention', tone: 'teal' },
];

const BARS = [38, 52, 58, 64, 70, 82];        // volume, P1..P6 (percent of chart height)
const TREND = [22, 30, 36, 44, 52, 60];       // conversion trend line

const FUNNEL = [
  { value: '48K', label: 'Visitors', tone: 'blue' },
  { value: '6.1K', label: 'Engaged', tone: 'orange' },
  { value: '1.2K', label: 'Qualified', tone: 'teal' },
  { value: '462', label: 'Completed', tone: 'green' },
];

const HIGHLIGHTS = [
  { title: 'Growth View', body: 'Traffic, conversions, and engagement all move upward in a simple, polished visual story.' },
  { title: 'Channel Mix', body: 'Performance can be split across paid, organic, referral, email, social, or any other source group.' },
  { title: 'Flexible Use', body: 'Suitable for SaaS, agencies, ecommerce, service businesses, internal tools, or product demos.' },
];

const TABS = ['Overview', 'Performance', 'Audience', 'Content'];

function chart() {
  const w = 300, h = 140, pad = 18, step = (w - pad * 2) / BARS.length;
  const bars = BARS.map((v, i) => {
    const bh = (v / 100) * (h - 30);
    const x = pad + i * step + step * 0.22;
    return `<rect x="${x.toFixed(1)}" y="${(h - 18 - bh).toFixed(1)}" width="${(step * 0.56).toFixed(1)}" height="${bh.toFixed(1)}" rx="3" class="sd-bar" style="--i:${i}"/>`;
  }).join('');
  const pts = TREND.map((v, i) => [pad + i * step + step / 2, h - 18 - (v / 100) * (h - 30)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const dots = pts.map((p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" class="sd-dot"/>`).join('');
  const labels = BARS.map((_, i) => `<text x="${(pad + i * step + step / 2).toFixed(1)}" y="${h - 4}" class="sd-axis">P${i + 1}</text>`).join('');
  const grid = [0.25, 0.5, 0.75].map((f) => `<line x1="${pad}" x2="${w - pad}" y1="${(h - 18 - f * (h - 30)).toFixed(1)}" y2="${(h - 18 - f * (h - 30)).toFixed(1)}" class="sd-grid"/>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="sd-chart" role="img" aria-label="Volume bars rising across six periods with a rising conversion trend line">${grid}${bars}<path d="${line}" class="sd-line"/>${dots}${labels}</svg>`;
}

export function renderDashboard(el) {
  el.classList.add('sd');
  el.innerHTML = `
    <aside class="sd-side">
      <p class="sd-side__title">Visual Dashboard</p>
      <p class="sd-side__label">Sections</p>
      <div class="sd-tabs" role="tablist" aria-label="Dashboard sections">
        ${TABS.map((t, i) => `<button role="tab" aria-selected="${i === 0}" data-tab="${t}">${t}</button>`).join('')}
      </div>
    </aside>
    <div class="sd-main">
      <header class="sd-head">
        <p class="sd-head__title">Interactive Visual Dashboard <span class="sd-head__tab" data-tab-label>· Overview</span></p>
        <p class="sd-head__sub">A clean showcase sample for websites, demos, and embedded previews.</p>
      </header>
      <div class="sd-kpis">
        ${KPIS.map((k) => `<div class="sd-kpi sd-tone-${k.tone}"><p class="sd-kpi__label">${k.label}</p><p class="sd-kpi__value">${k.value}</p><p class="sd-kpi__meta"><span class="sd-kpi__delta">${k.delta}</span><span>${k.note}</span></p></div>`).join('')}
      </div>
      <div class="sd-row">
        <div class="sd-card">
          <div class="sd-card__head"><div><p class="sd-card__title">Trend Snapshot</p><p class="sd-card__sub">Illustrative traffic and interaction movement over six periods.</p></div><span class="sd-pill">Overview</span></div>
          ${chart()}
          <p class="sd-legend"><span class="sd-legend__vol">Volume</span><span class="sd-legend__trend">Conversion trend</span></p>
        </div>
        <div class="sd-card">
          <div class="sd-card__head"><div><p class="sd-card__title">Journey Funnel</p><p class="sd-card__sub">Simple preview of how a multi-step dashboard can visualize progression.</p></div><span class="sd-pill">Interactive view</span></div>
          <ol class="sd-funnel">${FUNNEL.map((f) => `<li class="sd-tone-${f.tone}"><strong>${f.value}</strong><span>${f.label}</span></li>`).join('')}</ol>
          <p class="sd-note">This sample intentionally uses neutral labels like visitors, engaged users, qualified actions, and completed outcomes so it can represent many industries without implying a specific client, campaign, or workflow.</p>
        </div>
      </div>
      <div class="sd-card sd-card--wide">
        <div class="sd-card__head"><div><p class="sd-card__title">Key Highlights</p><p class="sd-card__sub">Quick summary cards commonly used in landing-page dashboard previews.</p></div><span class="sd-pill">Summary</span></div>
        <div class="sd-highlights">${HIGHLIGHTS.map((h) => `<div><p class="sd-hl__title">${h.title}</p><p class="sd-hl__body">${h.body}</p></div>`).join('')}</div>
      </div>
    </div>`;

  const tabs = el.querySelectorAll('[role="tab"]');
  const label = el.querySelector('[data-tab-label]');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
    });
  });
  function select(i, focus) {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    label.textContent = `· ${TABS[i]}`;
    el.querySelector('.sd-main').classList.remove('sd-swap'); void el.offsetWidth; el.querySelector('.sd-main').classList.add('sd-swap');
    if (focus) tabs[i].focus();
  }
  select(0);
}

// 16px line icons (same drawings as the Figma A/Icon and B/Icon components)
export const ICONS = {
  revenue: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 12 L6 8 L9 10.5 L14 5"/><path d="M10.5 5 H14 V8.5"/><path d="M2 14.25 H14"/></svg>',
  whatsapp: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.25 C4.8 2.25 2.25 4.6 2.25 7.5 C2.25 8.6 2.6 9.6 3.2 10.4 L2.5 13.5 L5.6 12.6 C6.3 12.9 7.1 13 8 13 C11.2 13 13.75 10.5 13.75 7.6 C13.75 4.6 11.2 2.25 8 2.25 Z"/><path d="M8.6 4.8 L6.6 7.9 H9.4 L7.4 10.4"/></svg>',
  pipeline: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2.5" width="3.25" height="11" rx="0.75"/><rect x="6.4" y="2.5" width="3.25" height="7.5" rx="0.75"/><rect x="10.75" y="2.5" width="3.25" height="4" rx="0.75"/></svg>',
  channels: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1.25"/><path d="M2 6.25 H14"/><path d="M5.25 1.75 V4"/><path d="M10.75 1.75 V4"/><path d="M5 12 V10"/><path d="M8 12 V8.5"/><path d="M11 12 V9.5"/></svg>',
};
