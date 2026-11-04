// Petrus Atelier is the main site. Keystone, PS Gallery and [AT]last are separate websites.
// Change an address here if a site moves, for example to a custom domain.
const SITES = {
  keystone:  'keystone/',
  psgallery: '/psgallery',
  atlast:    'https://atlast-nu.vercel.app',
};

// Any element with data-site="keystone|psgallery|atlast" links to that site.
document.querySelectorAll('[data-site]').forEach(a => { a.href = SITES[a.dataset.site]; });

const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Fade content in as it scrolls into view.
const reveal = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('v'); reveal.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.fi').forEach(el => reveal.observe(el));

// Caption and counter follow the panel on screen.
const panels = [...document.querySelectorAll('.panel')];
const cap = document.getElementById('cap');
const count = document.getElementById('count');
if (cap && count && panels.length) {
  const current = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    cap.textContent = e.target.dataset.caption;
    count.textContent = `(${panels.indexOf(e.target) + 1}/${panels.length})`;
  }), { threshold: 0.55 });
  panels.forEach(p => current.observe(p));
  count.textContent = `(1/${panels.length})`;
}

// Dot cursor (mouse devices only)
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-dot');
  let x = 0, y = 0, raf = 0;
  const draw = () => { dot.style.transform = `translate(${x}px, ${y}px)`; raf = 0; };
  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY; dot.classList.add('on');
    if (!raf) raf = requestAnimationFrame(draw);
    dot.classList.toggle('big', !!e.target.closest('a, button, summary, input, textarea, select, label'));
  }, { passive: true });
  document.addEventListener('mouseleave', () => dot.classList.remove('on'));
}

// Menu: three lines open a full black page.
(() => {
  const btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  if (!btn || !menu) return;
  const set = open => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.toggleAttribute('inert', !open);
  };
  btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();

// Photo stage: the photographs change by themselves, with their name and a link to the photo.
(() => {
  const st = document.querySelector('[data-stage]');
  if (!st) return;
  const imgs = [...st.querySelectorAll('[data-imgs] img')];
  const text = st.querySelector('[data-text]'), meta = st.querySelector('[data-meta]'), title = st.querySelector('[data-title]');
  const link = st.querySelector('[data-link]'), count = st.querySelector('[data-count]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, timer = 0, touchX = null;
  const pad = n => String(n).padStart(2, '0');
  const show = k => {
    k = (k + imgs.length) % imgs.length;
    if (k === cur) return;
    const prev = imgs[cur];
    prev.classList.remove('on'); prev.classList.add('off');
    setTimeout(() => prev.classList.remove('off'), 1700);
    imgs[k].classList.add('on');
    cur = k;
    text.classList.add('swap');
    setTimeout(() => {
      const im = imgs[k];
      meta.textContent = im.dataset.meta; title.textContent = im.dataset.title; link.href = im.dataset.href;
      count.textContent = `${pad(k + 1)} / ${pad(imgs.length)}`;
      text.classList.remove('swap');
    }, 350);
  };
  const start = () => { if (!still) timer = setInterval(() => show(cur + 1), 5000); };
  const stop = () => clearInterval(timer);
  const go = d => { stop(); show(cur + d); start(); };
  imgs[0].classList.add('on');
  imgs.forEach(im => im.addEventListener('click', () => go(1)));
  st.addEventListener('mouseenter', stop); st.addEventListener('mouseleave', start);
  addEventListener('keydown', e => {
    if (document.body.classList.contains('menu-open')) return;
    if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1);
  });
  st.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  st.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX = null;
  });
  start();
})();
