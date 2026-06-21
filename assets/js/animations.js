/* the switch. — animations.js v4 — native scroll, no loader */
(function () {
  'use strict';

  /* ── Reveal on scroll ────────────────────────────────── */
  function initReveals() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim, .anim-fade, .anim-scale, .anim-left').forEach(el => obs.observe(el));

    const staggerObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        [...e.target.children].forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 60);
        });
        staggerObs.unobserve(e.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-stagger]').forEach(el => {
      [...el.children].forEach(child => child.classList.add('anim'));
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
        btn.style.transition = 'transform .15s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      });
    });
  }

  /* ── Card tilt ───────────────────────────────────────── */
  function initTilt() {
    if (!matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - .5) * 5;
        const y = ((e.clientY - r.top)  / r.height - .5) * -5;
        card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg)`;
        card.style.transition = 'transform .12s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
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
    initReveals();
    initNav();
    initMagnetic();
    initTilt();
    initImages();
    setTimeout(() => { initReveals(); initMagnetic(); initTilt(); }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
