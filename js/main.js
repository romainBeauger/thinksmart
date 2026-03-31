/* ===== HIGHLIGHT.JS INIT ===== */
// Le script est en bas de <body> donc le DOM est déjà prêt
document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

/* ===== COPY BUTTONS ===== */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.closest('.code-block').querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '&#10003; Copié';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '&#128203; Copier';
      }, 2000);
    });
  });
});

/* ===== SEARCH ===== */
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const noResults = document.getElementById('noResults');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.card');
  const sections = document.querySelectorAll('.section');
  let visibleCount = 0;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (!query || text.includes(query)) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Hide sections where all cards are hidden
  sections.forEach(section => {
    const visibleCards = section.querySelectorAll('.card:not(.hidden)');
    section.classList.toggle('all-hidden', visibleCards.length === 0);
  });

  if (searchCount) {
    searchCount.textContent = query ? `${visibleCount} résultat${visibleCount !== 1 ? 's' : ''}` : '';
  }
  if (noResults) {
    noResults.style.display = visibleCount === 0 && query ? 'block' : 'none';
  }
});

/* ===== ACTIVE SIDEBAR LINK ON SCROLL ===== */
const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
const sectionEls = document.querySelectorAll('.section[id]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

sectionEls.forEach(el => observer.observe(el));

/* ===== SMOOTH SCROLL FOR SIDEBAR LINKS ===== */
sidebarLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== SIDEBAR TOGGLE (DESKTOP) ===== */
const sidebarToggleBtn = document.createElement('button');
sidebarToggleBtn.className = 'sidebar-toggle-btn';
sidebarToggleBtn.setAttribute('aria-label', 'Replier/déplier la sidebar');
sidebarToggleBtn.innerHTML = '◀';

const topNav = document.querySelector('.top-nav');
if (topNav) {
  const logo = topNav.querySelector('.logo');
  topNav.insertBefore(sidebarToggleBtn, logo ? logo.nextSibling : topNav.firstChild);
}

// Restore saved state
if (localStorage.getItem('sidebar-collapsed') === '1') {
  document.body.classList.add('sidebar-collapsed');
  sidebarToggleBtn.innerHTML = '▶';
}

sidebarToggleBtn.addEventListener('click', () => {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  sidebarToggleBtn.innerHTML = collapsed ? '▶' : '◀';
  localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
});

/* ===== NAV DROPDOWN ACTIVE STATE ===== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-dropdown a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.closest('li').classList.add('active');
    link.closest('.nav-group').querySelector('.nav-group-btn').classList.add('active');
  }
});

/* ===== MOBILE DRAWER ===== */
const LANGUAGES = [
  { name: 'HTML',                href: 'html.html',      badge: 'html' },
  { name: 'CSS',                 href: 'css.html',       badge: 'css' },
  { name: 'JavaScript',         href: 'js.html',        badge: 'js' },
  { name: 'Bootstrap',          href: 'bootstrap.html', badge: 'bs' },
  { name: 'Tailwind',           href: 'tailwind.html',  badge: 'tw' },
  { name: 'React',              href: 'react.html',     badge: 'react' },
  { name: 'Angular',            href: 'angular.html',   badge: 'angular' },
  { name: 'Git',                href: 'git.html',       badge: 'git' },
  { name: 'SQL',                href: 'sql.html',       badge: 'sql' },
  { name: 'PHP/Symfony',        href: 'php.html',       badge: 'php' },
  { name: 'Node/Express/Mongo', href: 'node.html',      badge: 'node' },
  { name: 'Modélisation BDD',  href: 'merise.html',    badge: 'merise' },
  { name: 'Docker',            href: 'docker.html',    badge: 'docker' },
];

const hamburger = document.getElementById('hamburger');

// Drawer
const drawer = document.createElement('div');
drawer.className = 'mobile-drawer';
drawer.innerHTML = `
  <div class="mobile-drawer-header">
    <span>Navigation</span>
    <button class="drawer-close" aria-label="Fermer">✕</button>
  </div>
  <div class="mobile-drawer-body"></div>
`;
document.body.appendChild(drawer);

// Overlay
const mobileOverlay = document.createElement('div');
mobileOverlay.className = 'mobile-overlay';
document.body.appendChild(mobileOverlay);

function openDrawer() {
  drawer.classList.add('open');
  if (hamburger) hamburger.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  drawer.classList.remove('open');
  if (hamburger) hamburger.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.classList.remove('drawer-open');
}

// Populate accordion
const drawerBody = drawer.querySelector('.mobile-drawer-body');

LANGUAGES.forEach(lang => {
  const isCurrent = currentPage === lang.href;
  const item = document.createElement('div');
  item.className = 'drawer-item';

  const header = document.createElement('button');
  header.className = 'drawer-item-header' + (isCurrent ? ' current open' : '');
  header.innerHTML = `
    <span class="lang-badge ${lang.badge}"></span>
    ${lang.name}
    <span class="drawer-item-arrow">›</span>
  `;

  const body = document.createElement('div');
  body.className = 'drawer-item-body' + (isCurrent ? ' open' : '');

  if (isCurrent) {
    // Liens de section clonés depuis la sidebar desktop
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.innerHTML = link.innerHTML;
      if (link.classList.contains('active')) a.classList.add('active');
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeDrawer();
      });
      body.appendChild(a);
    });

    // Garder le lien actif en sync avec le scroll
    window.addEventListener('scroll', () => {
      const active = document.querySelector('.sidebar-nav a.active');
      if (!active) return;
      const href = active.getAttribute('href');
      body.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
    }, { passive: true });

  } else {
    // Chapitres chargés à la demande via fetch
    body.dataset.loaded = 'false';
  }

  header.addEventListener('click', () => {
    const willOpen = !body.classList.contains('open');

    // Fermer tous les autres accordéons
    drawerBody.querySelectorAll('.drawer-item-body.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.drawer-item').querySelector('.drawer-item-header').classList.remove('open');
    });

    if (willOpen) {
      header.classList.add('open');
      body.classList.add('open');

      // Charger les chapitres de la page si pas encore fait
      if (!isCurrent && body.dataset.loaded === 'false') {
        body.innerHTML = '<span style="padding:8px 16px;display:block;opacity:.6">Chargement…</span>';
        fetch(lang.href)
          .then(r => r.text())
          .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('.sidebar-nav a');
            body.innerHTML = '';
            links.forEach(link => {
              const a = document.createElement('a');
              a.href = lang.href + link.getAttribute('href');
              a.innerHTML = link.innerHTML;
              a.addEventListener('click', closeDrawer);
              body.appendChild(a);
            });
            body.dataset.loaded = 'true';
          })
          .catch(() => {
            body.innerHTML = '';
            const a = document.createElement('a');
            a.href = lang.href;
            a.textContent = `Ouvrir ${lang.name}`;
            body.appendChild(a);
            body.dataset.loaded = 'true';
          });
      }
    }
  });

  item.appendChild(header);
  item.appendChild(body);
  drawerBody.appendChild(item);
});

// Controls
if (hamburger) {
  hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
}
mobileOverlay.addEventListener('click', closeDrawer);
drawer.querySelector('.drawer-close').addEventListener('click', closeDrawer);

