/* ===== COPY BUTTONS ===== */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.closest('.code-block').querySelector('code').innerText;
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
    const text = card.innerText.toLowerCase();
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
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close sidebar on mobile
    document.querySelector('.sidebar')?.classList.remove('open');
  });
});

/* ===== MOBILE HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');
if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
}

/* ===== HIGHLIGHT.JS INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
});
