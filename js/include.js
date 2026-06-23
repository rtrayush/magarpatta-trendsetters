// Loads shared header/footer partials so nav & branding live in one place.
async function includePartials() {
  const slots = document.querySelectorAll('[data-include]');
  await Promise.all([...slots].map(async (el) => {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(file);
      el.innerHTML = await res.text();
    } catch (e) {
      console.error('Could not load partial:', file, e);
    }
  }));

  // Mark active nav link based on current filename
  const current = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  document.querySelectorAll('nav.primary-nav a[data-page]').forEach(a => {
    if (a.dataset.page === current) a.classList.add('active');
  });

  // Footer year
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (must bind after header is injected)
  const navToggleBtn = document.getElementById('navToggleBtn');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggleBtn && primaryNav) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggleBtn.setAttribute('aria-expanded', isOpen);
    });
    primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggleBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Theme toggle (must bind after header is injected)
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf19';
  }

  document.dispatchEvent(new CustomEvent('partialsLoaded'));
}

function applyStoredTheme() {
  const stored = localStorage.getItem('rct-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('rct-theme', next);
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.textContent = next === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf19';
}

applyStoredTheme();
document.addEventListener('DOMContentLoaded', includePartials);
