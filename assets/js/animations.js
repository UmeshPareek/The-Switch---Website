/* ============================================================
   the switch. — animations.js  v1
   Premium scroll, micro-interaction & transition system
   ============================================================ */
(function () {
  'use strict';

  /* ── Scroll progress bar ──────────────────────────────── */
  const prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    prog.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* ── Page loader ──────────────────────────────────────── */
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-inner">
      <span class="loader-brand">the switch<span class="loader-dot">.</span></span>
    </div>
    <div class="loader-bar"></div>`;
  document.body.prepend(loader);
  const hideLoader = () => setTimeout(() => loader.classList.add('loader-out'), 400);
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);

  /* ── Custom cursor (desktop only) ────────────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot  = Object.assign(document.createElement('div'), { className: 'cur-dot' });
    const ring = Object.assign(document.createElement('div'), { className: 'cur-ring' });
    document.body.append(dot, ring);
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function tick() {
      dot.style.cssText  = `left:${mx}px;top:${my}px`;
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      ring.style.cssText = `left:${rx}px;top:${ry}px`;
      requestAnimationFrame(tick);
    })();

    const hoverEls = () => document.querySelectorAll('a,button,[role="button"],.photo-card,.prop-item,.ft-card,.property-card,.gallery-tab,.filter-pill');
    function bindCursor() {
      hoverEls().forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('cur-big'); ring.classList.add('cur-big'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('cur-big'); ring.classList.remove('cur-big'); });
      });
    }
    bindCursor();
    // Re-bind after dynamic content renders
    setTimeout(bindCursor, 1500);
  }

  /* ── Nav — hide on scroll down, show on scroll up ──────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 20) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
      if (y > lastY + 5 && y > 80) nav.classList.add('nav-tucked');
      else if (y < lastY - 5) nav.classList.remove('nav-tucked');
      lastY = y;
    }, { passive: true });
  }

  /* ── Scroll-triggered animations ─────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Combined observer for [data-anim] AND legacy .fade-up
  const scrollObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      scrollObs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  // Observe data-anim elements
  document.querySelectorAll('[data-anim]').forEach(el => {
    if (!reduced) scrollObs.observe(el);
    else el.classList.add('is-visible');
  });

  // Auto-stagger children inside [data-stagger]
  document.querySelectorAll('[data-stagger] > *').forEach((el, i) => {
    if (el.hasAttribute('data-anim')) {
      el.style.transitionDelay = (i * 0.08) + 's';
      el.style.animationDelay  = (i * 0.08) + 's';
    }
  });

  /* ── Auto-animate common patterns ───────────────────────
     Adds data-anim to elements that don't already have it
     so pages don't need manual markup on every element.    */
  if (!reduced) {
    const autoTargets = [
      ['h2:not(.hero-h1):not([data-anim])',               'up'],
      ['h3:not([data-anim])',                              'up'],
      ['.eyebrow:not([data-anim])',                        'fade'],
      ['.prop-item:not([data-anim])',                      'up'],
      ['.property-card:not([data-anim])',                  'up'],
      ['.photo-card:not([data-anim])',                     'up'],
      ['.ft-card:not([data-anim])',                        'scale'],
      ['.detail-section:not([data-anim])',                 'up'],
      ['.amenity-item:not([data-anim])',                   'up'],
      ['.map-prop-item:not([data-anim])',                  'fade'],
    ];
    autoTargets.forEach(([sel, anim]) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.setAttribute('data-anim', anim);
        if (!el.style.animationDelay) el.style.animationDelay = (i * 0.07) + 's';
        scrollObs.observe(el);
      });
    });
  }

  /* ── Parallax ─────────────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.3;
          el.style.transform = `translateY(${y * speed}px) scale(1.1)`;
        });
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  /* ── Hero headline stagger ───────────────────────────── */
  const heroH = document.querySelector('.hero-h1, .prop-name[id]');
  if (heroH && !reduced) {
    heroH.style.opacity = '0';
    heroH.style.transform = 'translateY(32px)';
    heroH.style.transition = 'opacity 1s cubic-bezier(.25,.46,.45,.94), transform 1s cubic-bezier(.25,.46,.45,.94)';
    setTimeout(() => {
      heroH.style.opacity = '1';
      heroH.style.transform = 'translateY(0)';
    }, 700);
  }

  /* ── Image lazy-load fade ────────────────────────────── */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity .5s ease';
    const reveal = () => { img.style.opacity = '1'; };
    if (img.complete) reveal();
    else img.addEventListener('load', reveal);
  });

  /* ── Magnetic buttons ───────────────────────────────── */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.22;
        const dy = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.transform = `translate(${dx}px,${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── 3D card tilt ───────────────────────────────────── */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.photo-card, .enquiry-card, .ft-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
        card.style.transition = 'transform 0.05s';
        card.style.transform  = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateZ(4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94)';
        card.style.transform  = '';
      });
    });
  }

  /* ── Number counter ─────────────────────────────────── */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseInt(el.dataset.count);
      const dur = 1800;
      let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + 1, end);
        el.textContent = cur;
        if (cur >= end) clearInterval(t);
      }, dur / end);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  /* ── Hover arrow shift on text buttons ──────────────── */
  document.querySelectorAll('.btn-text, .hero-btn-light, .hero-btn-outline').forEach(btn => {
    const arrow = btn.textContent.match(/[→»›]/);
    if (arrow) {
      btn.innerHTML = btn.innerHTML.replace(/\s*[→»›]\s*$/, '') + ' <span class="btn-arrow">→</span>';
    }
  });

})();
