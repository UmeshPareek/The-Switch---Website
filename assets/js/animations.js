/* the switch. — animations.js v3
   Lenis smooth scroll + CSS intersection reveals. Clean and reliable. */
(function () {
  'use strict';

  /* ── Loader ─────────────────────────────────────────── */
  function buildLoader() {
    if (document.getElementById('sw-loader')) return;
    const el = document.createElement('div');
    el.id = 'sw-loader';
    el.innerHTML = '<div class="sw-loader-brand">the switch<span class="sw-loader-dot">.</span></div>';
    document.body.prepend(el);
    setTimeout(() => el.remove(), 1200);
  }

  /* ── Progress bar ────────────────────────────────────── */
  function buildProgress() {
    const bar = document.createElement('div');
    bar.id = 'sw-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ── Lenis smooth scroll ─────────────────────────────── */
  function initLenis() {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js';
    s.onload = () => {
      const lenis = new Lenis({
        duration: 1.0,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  }

  /* ── Reveal on scroll ────────────────────────────────── */
  function initReveals() {
    // Individual elements
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim, .anim-fade, .anim-scale, .anim-left').forEach(el => obs.observe(el));

    // Stagger groups
    const staggerObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        [...e.target.children].forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 80);
        });
        staggerObs.unobserve(e.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-stagger]').forEach(el => {
      [...el.children].forEach(child => {
        child.classList.add('anim');
      });
      staggerObs.observe(el);
    });
  }

  /* ── Nav hide/show ───────────────────────────────────── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('nav-scrolled', y > 40);
      if (y > last + 8 && y > 100) nav.classList.add('nav-tucked');
      else if (y < last - 8)       nav.classList.remove('nav-tucked');
      last = y;
    }, { passive: true });
  }

  /* ── Magnetic buttons ────────────────────────────────── */
  function initMagnetic() {
    if (!matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.btn-mag').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.28;
        const y = (e.clientY - r.top  - r.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px,${y}px)`;
        btn.style.transition = 'transform .2s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform .7s cubic-bezier(.34,1.56,.64,1)';
      });
    });
  }

  /* ── Subtle card tilt ────────────────────────────────── */
  function initTilt() {
    if (!matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - .5) * 5;
        const y = ((e.clientY - r.top)  / r.height - .5) * -5;
        card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg)`;
        card.style.transition = 'transform .15s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
      });
    });
  }

  /* ── Image lazy fade ─────────────────────────────────── */
  function initImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.classList.add('img-fade');
      const show = () => img.classList.add('visible');
      if (img.complete && img.naturalWidth) show();
      else img.addEventListener('load', show);
    });
  }

  /* ── Run ─────────────────────────────────────────────── */
  function run() {
    buildLoader();
    buildProgress();
    initLenis();
    initReveals();
    initNav();
    initMagnetic();
    initTilt();
    initImages();
    // re-bind after async property cards load
    setTimeout(() => { initReveals(); initMagnetic(); initTilt(); }, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
