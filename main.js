// Petrus Atelier is the main site. Keystone, PS Gallery and [AT]last are separate websites.
// Change an address here if a site moves, for example to a custom domain.
const SITES = {
  keystone:  { label: 'Keystone',   url: 'https://keystone-website-two.vercel.app' },
  psgallery: { label: 'PS Gallery', url: 'https://psgallery-gamma.vercel.app' },
  atlast:    { label: 'ATLAST',     url: 'https://atlast-nu.vercel.app' },
};
const INSTAGRAM = 'https://www.instagram.com/psgallery.jpg';

const page = location.pathname.split('/').pop() || 'index.html';
const links = [
  ['petrus-atelier.html', 'Petrus Atelier'],
  [SITES.keystone.url, SITES.keystone.label],
  [SITES.psgallery.url, SITES.psgallery.label],
  [SITES.atlast.url, SITES.atlast.label],
  ['index.html#about', 'About'],
  ['index.html#contact', 'Contact'],
];
const navHtml = links.map(([href, label]) =>
  `<li><a href="${href}"${href === page ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');

document.body.insertAdjacentHTML('afterbegin', `
  <header class="site-header">
    <a class="logo" href="index.html">Petrus <span>Atelier</span></a>
    <nav><ul class="nav">${navHtml}</ul></nav>
  </header>`);

document.body.insertAdjacentHTML('beforeend', `
  <footer class="site-footer">
    <div>© ${new Date().getFullYear()} Pietro Sacchelli · London</div>
    <div>
      <a href="petrus-atelier.html">Petrus Atelier</a>
      ${Object.values(SITES).map(s => `<a href="${s.url}">${s.label}</a>`).join('')}
      <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram</a>
    </div>
  </footer>`);

// Any element with data-site="keystone|psgallery|atlast" links to that site.
document.querySelectorAll('[data-site]').forEach(a => { a.href = SITES[a.dataset.site].url; });

const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.fi').forEach(el => io.observe(el));
