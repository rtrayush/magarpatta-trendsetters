// ===== Scroll reveal =====
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

// ===== Wheel of Service: rotates gently with scroll + mouse =====
function initWheel() {
  const wheel = document.getElementById('wheelOfService');
  if (!wheel) return;
  let scrollRot = 0;
  let mouseRot = 0;

  window.addEventListener('scroll', () => {
    scrollRot = window.scrollY * 0.05;
    applyWheelTransform();
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    const dx = (e.clientX / window.innerWidth) - 0.5;
    mouseRot = dx * 12;
    applyWheelTransform();
  });

  function applyWheelTransform() {
    wheel.style.transform = `rotate(${scrollRot + mouseRot}deg)`;
  }
}

// ===== Ledger counters: count up when visible =====
function initCounters() {
  const counters = document.querySelectorAll('.ledger-num[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => io.observe(el));
}

document.addEventListener('partialsLoaded', () => {
  initReveal();
  initWheel();
  initCounters();
});

// In case a page has no includes/partials but still needs reveal+counters
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-include]')) {
    initReveal();
    initWheel();
    initCounters();
  }
});
