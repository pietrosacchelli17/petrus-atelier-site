// Petrus Atelier is the main site. Keystone, PS Gallery and [AT]last are separate websites.
// Change an address here if a site moves, for example to a custom domain.
const SITES = {
  keystone:  'keystone/',
  psgallery: '/psgallery/',
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
