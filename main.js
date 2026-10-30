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

// Photograph pile: each new photo lands on top at its own spot, same size and sharp; the earlier ones stay behind it.
(() => {
  const box = document.querySelector('[data-stack]');
  if (!box) return;
  const imgs = [...box.querySelectorAll('img')];
  const capEl = document.querySelector('[data-stack-cap]');
  const cntEl = document.querySelector('[data-stack-count]');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spots = [[0, 4], [24, 0], [8, 20], [26, 15]];   // left %, top % for each arrival
  const keep = 3;                                       // how many photos stay in the pile
  let pile = [], z = 0, cur = -1, timer = 0, count = 0;
  const show = k => {
    const im = imgs[k];
    const [x, y] = spots[count++ % spots.length];
    im.className = 'is-enter';
    im.style.left = x + '%'; im.style.top = y + '%'; im.style.zIndex = ++z;
    void im.offsetWidth;                                // register the start state
    im.className = 'is-in';
    pile = pile.filter(p => p !== k); pile.push(k);
    while (pile.length > keep) imgs[pile.shift()].className = 'is-out';
    cur = k;
    if (capEl) capEl.textContent = im.dataset.cap || '';
    if (cntEl) cntEl.textContent = `(${k + 1}/${imgs.length})`;
  };
  const step = () => show((cur + 1) % imgs.length);
  const start = () => { if (!still) timer = setInterval(step, 3400); };
  const stop = () => clearInterval(timer);
  show(0);
  box.addEventListener('click', () => { stop(); step(); start(); });
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', start);
  start();
})();
