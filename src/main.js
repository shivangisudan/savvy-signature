import '@fontsource/schibsted-grotesk/latin-500.css';
import '@fontsource/schibsted-grotesk/latin-600.css';
import '@fontsource/hanken-grotesk/latin-400.css';
import '@fontsource/hanken-grotesk/latin-500.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/newsreader/latin-400.css';
import '@fontsource/newsreader/latin-500-italic.css';
import '@fontsource/geist-sans/latin-400.css';
import '@fontsource/geist-sans/latin-500.css';
import '@fontsource/geist-sans/latin-600.css';
import '@fontsource/geist-mono/latin-400.css';
import '@fontsource/geist-mono/latin-500.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/variant-a.css';
import './styles/variant-b.css';
import './styles/dashboard.css';

import { renderDashboard, ICONS } from './components/dashboard.js';
import { renderIsoIllustration } from './components/iso-illustration.js';

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Variant switch ---------------- */
const switchBtns = document.querySelectorAll('[data-set-variant]');
function setVariant(v, { push = true } = {}) {
  root.setAttribute('data-variant', v);
  try { localStorage.setItem('savvy-variant', v); } catch (e) { /* storage unavailable */ }
  switchBtns.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.setVariant === v)));
  document.querySelectorAll('.variant').forEach((el) => { el.inert = el.dataset.for !== v; });
  if (push) {
    const url = new URL(location.href); url.searchParams.set('v', v); history.replaceState(null, '', url);
  }
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  requestAnimationFrame(revealVisible);
}
switchBtns.forEach((b) => b.addEventListener('click', () => setVariant(b.dataset.setVariant)));
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if ((e.key === 'a' || e.key === 'b') && e.altKey) setVariant(e.key);
});

/* ---------------- Components ---------------- */
document.querySelectorAll('[data-dashboard]').forEach(renderDashboard);
document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
const iso = document.getElementById('a-iso');
if (iso) renderIsoIllustration(iso);

// B rings
const rings = document.querySelector('.b-rings');
if (rings) {
  let c = '';
  for (let r = 40; r <= 300; r += 20) c += `<circle cx="300" cy="300" r="${r}"/>`;
  rings.innerHTML = c;
}

// Logo fallbacks: missing file -> clean text label
document.querySelectorAll('.logo-grid img').forEach((img) => {
  const fail = () => {
    const span = document.createElement('span');
    span.className = 'logo-fallback';
    span.textContent = img.alt;
    img.replaceWith(span);
  };
  if (img.complete && img.naturalWidth === 0) fail(); else img.addEventListener('error', fail, { once: true });
});
document.querySelectorAll('img.brand-mark').forEach((img) => img.addEventListener('error', () => img.classList.add('brand-mark--fallback'), { once: true }));

/* ---------------- Sticky nav state ---------------- */
const onScroll = () => document.querySelectorAll('[data-sticky]').forEach((n) => n.classList.toggle('is-stuck', window.scrollY > 24));
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- Menu sheet ---------------- */
const sheet = document.getElementById('menu-sheet');
let lastToggle = null;
function openMenu(btn) {
  lastToggle = btn; sheet.hidden = false; document.body.classList.add('no-scroll');
  document.querySelectorAll('.menu-toggle').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  requestAnimationFrame(() => sheet.classList.add('is-open'));
  sheet.querySelector('.menu-sheet__close').focus();
}
function closeMenu() {
  if (sheet.hidden) return;
  sheet.classList.remove('is-open'); document.body.classList.remove('no-scroll');
  document.querySelectorAll('.menu-toggle').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  setTimeout(() => { sheet.hidden = true; }, reduceMotion ? 0 : 240);
  lastToggle?.focus();
}
document.querySelectorAll('.menu-toggle').forEach((b) => b.addEventListener('click', () => openMenu(b)));
sheet.querySelector('.menu-sheet__close').addEventListener('click', closeMenu);
sheet.addEventListener('click', (e) => { if (e.target === sheet || e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenu(); closeDropdowns(); } });

/* ---------------- A: Digital dropdown ---------------- */
function closeDropdowns() {
  document.querySelectorAll('.nav-dropdown').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    document.getElementById(b.getAttribute('aria-controls')).hidden = true;
  });
}
document.querySelectorAll('.nav-dropdown').forEach((btn) => {
  const menu = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') === 'true';
    closeDropdowns();
    btn.setAttribute('aria-expanded', String(!open)); menu.hidden = open;
  });
});
document.addEventListener('click', (e) => { if (!e.target.closest('.a-dropdown')) closeDropdowns(); });

/* ---------------- A: With / Without Savvy toggle ---------------- */
const stage = document.querySelector('.a-stage');
document.querySelectorAll('.a-toggle [role="tab"]').forEach((tab, i, all) => {
  tab.addEventListener('click', () => {
    all.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    stage.dataset.state = tab.dataset.mode;
  });
  tab.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = all[(i + 1) % all.length]; n.focus(); n.click(); }
  });
});

/* ---------------- Reveal on scroll + count-up ---------------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    en.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;

function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = '1';
  const end = Number(el.dataset.count), suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = end + suffix; return; }
  const t0 = performance.now(), dur = 900;
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(end * e) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function revealVisible() {
  document.querySelectorAll('[data-reveal]:not(.is-in), .b-stats:not(.is-in), .a-stats:not(.is-in)').forEach((el) => io ? io.observe(el) : el.classList.add('is-in'));
}
document.querySelectorAll('.a-trust__proof').forEach((el) => el.setAttribute('data-reveal', ''));
revealVisible();

/* ---------------- B: optional hero video ----------------
   Drop the Magnific loop at public/media/hero-rays.mp4 (and .webm) and it plays
   automatically. Until then the CSS light-ray background is used. */
const bBg = document.querySelector('.b-hero__bg');
if (bBg && !reduceMotion) {
  fetch('/media/hero-rays.mp4', { method: 'HEAD' }).then((r) => {
    if (!r.ok || !(r.headers.get('content-type') || '').includes('video')) return;
    const v = document.createElement('video');
    Object.assign(v, { autoplay: true, muted: true, loop: true, playsInline: true });
    v.className = 'b-hero__video';
    v.setAttribute('aria-hidden', 'true');
    v.innerHTML = '<source src="/media/hero-rays.webm" type="video/webm"><source src="/media/hero-rays.mp4" type="video/mp4">';
    bBg.prepend(v); bBg.classList.add('has-video');
    new IntersectionObserver(([e]) => (e.isIntersecting ? v.play() : v.pause()).catch?.(() => {})).observe(bBg);
  }).catch(() => {});
}

setVariant(root.getAttribute('data-variant'), { push: false });
document.documentElement.classList.add('is-ready');
