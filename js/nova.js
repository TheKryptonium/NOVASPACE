/* =============================================================
   NOVA SPACE — nova.js
   JS global — Refonte v1.0 · Novembre 2026
   Toutes les pages FR et EN chargent ce script.
   ============================================================= */

/* ─────────────────────────────────────────
   0. GSAP + ScrollTrigger via CDN
   (chargés dans le <head> des pages HTML)
   On attend leur disponibilité.
   ───────────────────────────────────────── */

(function () {
  'use strict';

  /* ───────────────────────────────────────
     1. DÉTECTION prefers-reduced-motion
     ─────────────────────────────────────── */
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ───────────────────────────────────────
     2. REDIRECTION RACINE (index.html)
     Utilisé dans website/index.html
     Mais aussi disponible si appelé depuis la racine.
     ─────────────────────────────────────── */
  function handleRootRedirect() {
    // Si on est sur la page racine index.html
    const path = window.location.pathname;
    const isRoot =
      path === '/' ||
      path.endsWith('/index.html') &&
      !path.includes('/fr/') &&
      !path.includes('/en/');

    if (!isRoot) return;

    const lang = navigator.language || navigator.userLanguage || 'fr';
    const isEn = lang.toLowerCase().startsWith('en');
    const base = window.location.href.replace(/\/index\.html$/, '').replace(/\/$/, '');
    window.location.replace(isEn ? base + '/en/' : base + '/fr/');
  }

  /* ───────────────────────────────────────
     3. NAVIGATION — Scroll behaviour
     Ajoute la classe .scrolled au header.
     ─────────────────────────────────────── */
  function initNavScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // état initial
  }

  /* ───────────────────────────────────────
     4. HAMBURGER — menu mobile
     ─────────────────────────────────────── */
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navlinks  = document.getElementById('navlinks');
    if (!hamburger || !navlinks) return;

    // Overlay pour fermer en cliquant en dehors
    let overlay = null;

    function openMenu() {
      hamburger.classList.add('open');
      navlinks.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Crée l'overlay
      overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:104',
        'background:rgba(7,9,13,0.6)',
        'backdrop-filter:blur(2px)',
        '-webkit-backdrop-filter:blur(2px)',
      ].join(';');
      overlay.addEventListener('click', closeMenu);
      document.body.appendChild(overlay);
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      navlinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (overlay) { overlay.remove(); overlay = null; }
    }

    function toggleMenu() {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    }

    hamburger.addEventListener('click', toggleMenu);

    // Fermer avec Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Fermer quand on clique un lien nav (mobile)
    navlinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fermer quand la fenêtre repasse en desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ───────────────────────────────────────
     5. LIEN NAV ACTIF (highlight courant)
     Marque le lien correspondant à la page actuelle.
     ─────────────────────────────────────── */
  function initActiveNavLink() {
    const links = document.querySelectorAll('.nav-link');
    if (!links.length) return;

    const current = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop();
      if (linkPage === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ───────────────────────────────────────
     6. SMOOTH SCROLL
     Pour les ancres internes (#section).
     ─────────────────────────────────────── */
  function initSmoothScroll() {
    if (prefersReduced) return;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ───────────────────────────────────────
     7. INTERSECTION OBSERVER — animations
     Ajoute la classe .visible aux éléments
     avec .fade-up, .fade-in, .slide-left, .slide-right
     ─────────────────────────────────────── */
  function initScrollAnimations() {
    const animatedEls = document.querySelectorAll(
      '.fade-up, .fade-in, .slide-left, .slide-right'
    );
    if (!animatedEls.length) return;

    if (prefersReduced) {
      // Rendre tout visible immédiatement
      animatedEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    animatedEls.forEach(function (el) { observer.observe(el); });
  }

  /* ───────────────────────────────────────
     8. BARRES DE PROGRESSION
     Anime .progress-fill au scroll.
     ─────────────────────────────────────── */
  function initProgressBars() {
    const fills = document.querySelectorAll('.progress-fill');
    if (!fills.length) return;

    if (prefersReduced) {
      fills.forEach(function (fill) { fill.classList.add('animated'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    fills.forEach(function (fill) { observer.observe(fill); });
  }

  /* ───────────────────────────────────────
     9. COMPTEURS ANIMÉS
     Utilise data-counter="valeur" data-suffix="%"
     Exemples : 75%, ~1km, 25.04.2025
     ─────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (prefersReduced) {
      // Affiche directement la valeur finale
      counters.forEach(function (el) {
        el.textContent = el.dataset.counter + (el.dataset.suffix || '');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animateCounter(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    const rawTarget = el.dataset.counter;
    const suffix    = el.dataset.suffix || '';
    const prefix    = el.dataset.prefix || '';
    const duration  = parseInt(el.dataset.duration, 10) || 1800;

    // Cas texte non numérique (ex: date "25.04.2025")
    const numericTarget = parseFloat(rawTarget.replace(/[^0-9.]/g, ''));
    if (isNaN(numericTarget)) {
      // Affichage direct pour les valeurs textuelles pures
      el.textContent = prefix + rawTarget + suffix;
      return;
    }

    const decimals = (rawTarget.split('.')[1] || '').length;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = numericTarget * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ───────────────────────────────────────
     10. GSAP — ScrollTrigger animations
     Utilisé pour les effets parallax / pinning
     complexes sur les pages qui en ont besoin.
     Vérifie la disponibilité de GSAP avant usage.
     ─────────────────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || prefersReduced) return;

    // Enregistrer ScrollTrigger si disponible
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Parallax léger sur les anneaux d'orbite
    const orbitRings = document.querySelectorAll('.orbit-rings svg');
    if (orbitRings.length && typeof ScrollTrigger !== 'undefined') {
      orbitRings.forEach(function (ring) {
        gsap.to(ring, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: ring.closest('.orbit-rings').parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }

    // Animation héro — reveal du h1 lettre par lettre
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1 && !prefersReduced) {
      gsap.from(heroH1, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    // Réveal du hero-lead
    const heroLead = document.querySelector('.hero-lead');
    if (heroLead) {
      gsap.from(heroLead, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.6,
      });
    }

    // Réveal des CTA
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      gsap.from(heroCta, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.9,
      });
    }
  }

  /* ───────────────────────────────────────
     11. MENU SCROLL ACTIF (section spy)
     Met à jour le lien actif lors du scroll
     si des ancres #section sont dans la page.
     ─────────────────────────────────────── */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link[href*="#"]');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          links.forEach(function (link) {
            const href = link.getAttribute('href');
            const isMatch = href && href.endsWith('#' + id);
            link.classList.toggle('active', isMatch);
          });
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-20% 0px -60% 0px',
      }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ───────────────────────────────────────
     12. INIT — Lancement de tous les modules
     ─────────────────────────────────────── */
  function init() {
    handleRootRedirect();
    initNavScroll();
    initHamburger();
    initActiveNavLink();
    initSmoothScroll();
    initScrollAnimations();
    initProgressBars();
    initCounters();
    initScrollSpy();

    // GSAP après chargement complet (CDN async)
    if (typeof gsap !== 'undefined') {
      initGSAP();
    } else {
      window.addEventListener('load', function () {
        if (typeof gsap !== 'undefined') initGSAP();
      });
    }
  }

  // Lancement au DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
