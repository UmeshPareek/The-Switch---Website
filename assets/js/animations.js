/* ============================================================
   the switch. — animations.js  v2  (GSAP + Lenis + SplitText)
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Grain canvas (animated film noise on hero) ─────────── */
  function initGrain() {
    const canvas = document.getElementById('grain');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 256;
    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 42) return;
      last = ts;
      const img = ctx.createImageData(256, 256);
      const buf = img.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        buf[i] = buf[i + 1] = buf[i + 2] = v;
        buf[i + 3] = 20;
      }
      ctx.putImageData(img, 0, 0);
    }
    requestAnimationFrame(draw);
  }

  /* ── Page loader ─────────────────────────────────────────── */
  function buildLoader() {
    if (document.getElementById('page-loader')) return;
    const el = document.createElement('div');
    el.id = 'page-loader';
    el.innerHTML = `<div class="loader-inner"><span class="loader-brand">the switch<span class="loader-dot">.</span></span></div><div class="loader-bar"></div>`;
    document.body.prepend(el);
  }

  /* ── Scroll progress bar ─────────────────────────────────── */
  function buildProgress() {
    if (document.getElementById('scroll-progress')) return;
    const el = document.createElement('div');
    el.id = 'scroll-progress';
    document.body.prepend(el);
  }

  /* ── Custom cursor ───────────────────────────────────────── */
  function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (document.querySelector('.cur-dot')) return;

    const dot   = Object.assign(document.createElement('div'), { className: 'cur-dot' });
    const ring  = Object.assign(document.createElement('div'), { className: 'cur-ring' });
    const label = Object.assign(document.createElement('div'), { className: 'cur-label' });
    document.body.append(dot, ring, label);

    let mx = -200, my = -200, rx = -200, ry = -200;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function tick() {
      dot.style.cssText   = `left:${mx}px;top:${my}px`;
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      ring.style.cssText  = `left:${rx}px;top:${ry}px`;
      label.style.cssText = `left:${rx}px;top:${ry}px`;
      requestAnimationFrame(tick);
    })();

    const zones = [
      ['#hScroll', 'DRAG'],
      ['.personas', 'READ'],
      ['.cta-cinematic', 'BOOK'],
      ['.versus', 'COMPARE'],
    ];
    zones.forEach(([sel, txt]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.addEventListener('mouseenter', () => { label.textContent = txt; label.classList.add('active'); ring.classList.add('cur-label-active'); });
      el.addEventListener('mouseleave', () => { label.classList.remove('active'); ring.classList.remove('cur-label-active'); });
    });

    function bind() {
      document.querySelectorAll('a,button,[role="button"],.h-card,.persona,.property-card,.photo-card').forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('cur-big'); ring.classList.add('cur-big'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('cur-big'); ring.classList.remove('cur-big'); });
      });
    }
    bind();
    setTimeout(bind, 2500);
  }

  /* ── Lenis smooth scroll ─────────────────────────────────── */
  function initLenis() {
    if (typeof Lenis === 'undefined') return null;
    const lenis = new Lenis({
      duration: 1.35,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  /* ── Loader exit + hero entrance sequence ────────────────── */
  function initLoaderAndHero() {
    const loader  = document.getElementById('page-loader');
    const title   = document.getElementById('heroTitle');
    const eyebrow = document.getElementById('heroEyebrow');
    const tagline = document.getElementById('heroTagline');
    const actions = document.getElementById('heroActions');

    const master = gsap.timeline();

    if (loader) {
      master.to(loader, { yPercent: -100, duration: 1.05, ease: 'power4.inOut', delay: 0.55 })
            .set(loader, { display: 'none' });
    }

    if (!title) return;

    let animTargets = [title];
    let splitInstance = null;
    if (typeof SplitText !== 'undefined') {
      try {
        splitInstance = new SplitText(title, { type: 'chars,words', charsClass: 'hchar' });
        animTargets = splitInstance.chars;
      } catch (e) { /* fallback */ }
    }

    const offset = loader ? '-=0.15' : 0;
    master
      .from(eyebrow, { opacity: 0, y: 14, duration: 0.7, ease: 'power2.out' }, offset)
      .from(animTargets, {
        opacity: 0, y: 72, rotateX: -80,
        transformOrigin: '0% 50% -50',
        stagger: 0.025, duration: 1, ease: 'power3.out',
      }, '-=0.45')
      .from(tagline,  { opacity: 0, y: 22, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .from(actions ? [...actions.children] : [], {
        opacity: 0, y: 14, stagger: 0.1, duration: 0.6, ease: 'power2.out',
      }, '-=0.5');

    // Hero chars drift out as page scrolls
    if (!reduced && splitInstance) {
      gsap.to([...document.querySelectorAll('.hchar')], {
        y: -60, opacity: 0, stagger: 0.018, ease: 'power1.in',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }
  }

  /* ── Scroll progress (GSAP scrub) ───────────────────────── */
  function initProgress() {
    const prog = document.getElementById('scroll-progress');
    if (!prog) return;
    ScrollTrigger.create({
      start: 'top top', end: 'bottom bottom',
      onUpdate: self => { prog.style.transform = `scaleX(${self.progress})`; }
    });
  }

  /* ── Word-by-word manifesto reveal ──────────────────────── */
  function initWordReveal() {
    const section = document.getElementById('wordReveal');
    const text    = section?.querySelector('.wr-text');
    if (!section || !text) return;
    if (reduced) return;

    if (typeof SplitText !== 'undefined') {
      try {
        const split = new SplitText(text, { type: 'words', wordsClass: 'wrd' });
        gsap.fromTo(split.words,
          { opacity: 0.08 },
          {
            opacity: 1,
            stagger: { each: 0.14 },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
              pin: true,
            }
          }
        );
        return;
      } catch (e) { /* fallback */ }
    }
    gsap.from(text, {
      opacity: 0, y: 40, duration: 1.2,
      scrollTrigger: { trigger: section, start: 'top 70%' }
    });
  }

  /* ── Horizontal scroll — "What's Included" ──────────────── */
  function initHorizontalScroll() {
    const sticky = document.querySelector('.h-scroll-sticky');
    const track  = document.getElementById('hScrollTrack');
    const right  = document.getElementById('hScrollRight');
    if (!sticky || !track || !right) return;

    if (reduced || window.innerWidth < 768) {
      gsap.from(track.querySelectorAll('.h-card'), {
        opacity: 0, y: 36, stagger: 0.1, duration: 0.7,
        scrollTrigger: { trigger: track, start: 'top 80%' }
      });
      return;
    }

    gsap.to(track, {
      x: () => -(track.scrollWidth - right.offsetWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sticky,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - right.offsetWidth),
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
  }

  /* ── Stats count up ─────────────────────────────────────── */
  function initStats() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const end = parseInt(el.dataset.count);
      if (!end || isNaN(end)) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate() { el.textContent = Math.round(obj.val); }
      });
    });
  }

  /* ── Before/After rows draw in ───────────────────────────── */
  function initVersus() {
    document.querySelectorAll('.versus-col.old .versus-row').forEach((row, i) => {
      gsap.from(row, { x: -28, opacity: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.04,
        scrollTrigger: { trigger: row, start: 'top 90%' } });
    });
    document.querySelectorAll('.versus-col.new .versus-row').forEach((row, i) => {
      gsap.from(row, { x: 28, opacity: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.04,
        scrollTrigger: { trigger: row, start: 'top 90%' } });
    });
  }

  /* ── Manifesto image clip-path reveal ────────────────────── */
  function initManifestoReveal() {
    const img  = document.querySelector('.manifesto-img img');
    const copy = document.querySelector('.manifesto-copy');
    if (!img || reduced) return;
    gsap.from(img, {
      clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: img, start: 'top 85%' }
    });
    if (copy) {
      gsap.from(copy, { x: 40, opacity: 0, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: copy, start: 'top 80%' } });
    }
  }

  /* ── CTA iris clip-path expand ───────────────────────────── */
  function initCtaIris() {
    const section = document.querySelector('.cta-cinematic');
    const img     = section?.querySelector('.cta-bg img');
    if (!section || !img || reduced) return;
    gsap.fromTo(img,
      { clipPath: 'circle(5% at 50% 50%)', scale: 1.18 },
      {
        clipPath: 'circle(120% at 50% 50%)', scale: 1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 5%', scrub: 1.5 }
      }
    );
    const inner = section.querySelector('.cta-inner');
    if (inner) {
      gsap.from(inner, { opacity: 0, y: 48, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 50%' } });
    }
  }

  /* ── Nav hide/show ───────────────────────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let lastY = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        nav.classList.toggle('nav-scrolled', y > 30);
        if (y > lastY + 6 && y > 80) nav.classList.add('nav-tucked');
        else if (y < lastY - 6) nav.classList.remove('nav-tucked');
        lastY = y;
      }
    });
  }

  /* ── General scroll animations ───────────────────────────── */
  function initScrollAnims() {
    if (reduced) {
      document.querySelectorAll('[data-anim]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }

    const map = {
      'up':    { y: 36, opacity: 0 },
      'fade':  { opacity: 0 },
      'scale': { scale: 0.93, opacity: 0 },
      'left':  { x: -36, opacity: 0 },
      'right': { x: 36, opacity: 0 },
    };
    Object.entries(map).forEach(([val, from]) => {
      gsap.utils.toArray(`[data-anim="${val}"]`).forEach(el => {
        gsap.from(el, { ...from, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
    });

    // Auto-animate elements with no data-anim
    ['h2:not(.no-anim):not([data-anim])', 'h3:not(.no-anim):not([data-anim])', '.eyebrow:not([data-anim])'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.85, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
    });

    // Stagger containers
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const kids = [...container.children].filter(c => !c.hasAttribute('data-anim'));
      if (!kids.length) return;
      gsap.from(kids, { y: 36, opacity: 0, stagger: 0.09, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 83%' } });
    });

    // Persona numbers
    document.querySelectorAll('.persona-num').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  }

  /* ── Parallax ────────────────────────────────────────────── */
  function initParallax() {
    if (reduced) return;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.25;
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top top', end: 'bottom top',
          scrub: true, invalidateOnRefresh: true,
        }
      });
    });
  }

  /* ── Magnetic buttons ────────────────────────────────────── */
  function initMagnetic() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width  / 2) * 0.28,
          y: (e.clientY - r.top  - r.height / 2) * 0.28,
          duration: 0.4, ease: 'power2.out',
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ── 3D card tilt ────────────────────────────────────────── */
  function initCardTilt() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.h-card,.photo-card,.property-card,.ft-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        gsap.to(card, {
          rotateY: ((e.clientX - r.left) / r.width  - 0.5) * 10,
          rotateX: ((e.clientY - r.top)  / r.height - 0.5) * -10,
          transformPerspective: 800, duration: 0.3, ease: 'power2.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ── Image lazy fade ─────────────────────────────────────── */
  function initImageFade() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.style.opacity = '0';
      const reveal = () => gsap.to(img, { opacity: 1, duration: 0.7, ease: 'power1.out' });
      if (img.complete && img.naturalWidth) reveal();
      else img.addEventListener('load', reveal);
    });
  }

  /* ── Main init ───────────────────────────────────────────── */
  function init() {
    if (typeof gsap === 'undefined') { console.warn('GSAP not loaded'); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

    buildProgress();
    buildLoader();
    initLenis();
    initGrain();

    requestAnimationFrame(() => {
      initLoaderAndHero();
      initProgress();
      initNavScroll();
      initWordReveal();
      initHorizontalScroll();
      initStats();
      initVersus();
      initManifestoReveal();
      initCtaIris();
      initScrollAnims();
      initParallax();
      initMagnetic();
      initCardTilt();
      initImageFade();
      initCursor();
    });

    // Re-bind after async property cards render
    setTimeout(() => {
      initMagnetic();
      initCardTilt();
      ScrollTrigger.refresh();
    }, 2800);
  }

  /* ── Inject external libs then boot ─────────────────────── */
  function load(src, id) {
    return new Promise(res => {
      if (document.getElementById(id)) { res(); return; }
      const s = document.createElement('script');
      s.id = id; s.src = src; s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    });
  }
  function css(href, id) {
    if (document.getElementById(id)) return;
    const l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
  }

  css('/assets/css/animations.css', 'sw-anim-css');

  load('https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js', 'sw-lenis')
    .then(() => load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', 'sw-gsap'))
    .then(() => load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', 'sw-st'))
    .then(() => load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/SplitText.min.js', 'sw-split'))
    .then(() => {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
      else init();
    });

})();
