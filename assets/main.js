/* ══════════════════════════════════════════════
   FRED ELEC — main.js  (shared, all pages)
   ══════════════════════════════════════════════ */

;(function () {
  'use strict';

  /* ── Nav : état au scroll ───────────────── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const updateNav = () => nav.classList.toggle('at-top', window.scrollY < 48);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── Nav : hamburger ─────────────────────── */
  const ham   = document.querySelector('.nav-ham');
  const links = document.querySelector('.nav-links');
  if (ham && links) {
    ham.addEventListener('click', () => {
      const open = ham.getAttribute('aria-expanded') === 'true';
      ham.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('nav-open', !open);
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('nav-open');
        ham.setAttribute('aria-expanded', 'false');
      })
    );
    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        links.classList.remove('nav-open');
        ham.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Nav : lien actif ───────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll reveal ──────────────────────── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('in'));
  }

  /* ── Compteurs animés ───────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur    = 1500;
        let start    = null;
        const step = ts => {
          if (!start) start = ts;
          const p    = Math.min((ts - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ── Accordéon FAQ ──────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn  = item.querySelector('.faq-q');
    const body = item.querySelector('.faq-a');
    if (!btn || !body) return;
    body.style.maxHeight = '0';
    body.style.overflow  = 'hidden';
    body.style.transition = 'max-height .38s cubic-bezier(.4,0,.2,1)';
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 48 + 'px';
      }
    });
  });

  /* ── Ticker : animation fallback ───────── */
  // CSS handles it; JS just ensures animation runs after load
  const track = document.querySelector('.ticker-track');
  if (track) track.style.animationPlayState = 'running';

})();
