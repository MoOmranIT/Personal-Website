(function () {
  const OFFSET = 90;
  const html = document.documentElement;
  const lang = html.getAttribute('lang') || 'en';
  const isRTL = html.getAttribute('dir') === 'rtl';

  function scrollToHash(hash: string): boolean {
    if (!hash || hash.length <= 1) return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - OFFSET,
      behavior: 'smooth'
    });
    return true;
  }

  document.addEventListener('click', function (e) {
    const target = e.target as Element | null;
    const anchor = target?.closest ? target.closest('a[href^="#"]') : null;
    if (!anchor) return;
    if (scrollToHash(anchor.getAttribute('href') || '')) {
      e.preventDefault();
      closeMenu();
    }
  });

  // Modal focus trap (applied on open)
  function trapFocus(modal: HTMLElement) {
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    modal.addEventListener('keydown', handleTab);
    // Return cleanup
    return () => modal.removeEventListener('keydown', handleTab);
  }

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale')
    .forEach((el) => revealObserver.observe(el));

  // Counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.target || '0', 10);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString(lang === 'ar' ? 'ar-AR' : undefined);
        }, 25);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter-num').forEach((el) => counterObserver.observe(el));

  // Header state + scroll progress + back to top
  const header = document.getElementById('site-header');
  const progressBar = document.querySelector('.scroll-progress') as HTMLElement | null;
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform =
        'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    }

    if (backToTop) {
      const visible = window.scrollY > 700;
      backToTop.classList.toggle('opacity-100', visible);
      backToTop.classList.toggle('translate-y-0', visible);
      backToTop.classList.toggle('opacity-0', !visible);
      backToTop.classList.toggle('translate-y-4', !visible);
      backToTop.classList.toggle('pointer-events-none', !visible);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll spy
  const sectionIds = ['home', 'services', 'about', 'books', 'success', 'contact'];
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);

  const scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const targetId = href.includes('#') ? href.split('#')[1] : href;
        link.setAttribute('data-active', targetId === visible.target.id);
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
  );

  sections.forEach((section) => scrollSpyObserver.observe(section));

  // Mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  function applyMenuState() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.toggle('max-h-80', menuOpen);
    mobileMenu.classList.toggle('opacity-100', menuOpen);
    mobileMenu.classList.toggle('max-h-0', !menuOpen);
    mobileMenu.classList.toggle('opacity-0', !menuOpen);
    menuToggle.setAttribute('aria-expanded', String(menuOpen));

    const bars = menuToggle.querySelectorAll('span');
    if (bars.length === 3) {
      bars[0].classList.toggle('translate-y-2', menuOpen);
      bars[0].classList.toggle('rotate-45', menuOpen);
      bars[1].classList.toggle('opacity-0', menuOpen);
      bars[2].classList.toggle('-translate-y-2', menuOpen);
      bars[2].classList.toggle('-rotate-45', menuOpen);
    }
  }

  function closeMenu() {
    menuOpen = false;
    applyMenuState();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      applyMenuState();
    });
  }

  // Flip cards
  document.querySelectorAll('.flip-card').forEach((el) => {
    const card = el as HTMLElement;
    function flip() {
      const isFlipped = card.getAttribute('data-flipped') === 'true';
      document.querySelectorAll('.flip-card').forEach((c) => {
        c.setAttribute('data-flipped', 'false');
      });
      card.setAttribute('data-flipped', isFlipped ? 'false' : 'true');
    }

    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });
})();
