(function () {
  const OFFSET = 90;
  const html = document.documentElement;
  const lang = html.getAttribute('lang') || 'en';
  const isRTL = html.getAttribute('dir') === 'rtl';

  const labels = {
    en: {
      sending: 'Sending...',
      submit: 'Send My Request',
      success: '✓ Thank you! Your request has been received — I will get back to you within 24 hours.'
    },
    ar: {
      sending: 'جاري الإرسال...',
      submit: 'إرسال طلبي',
      success: '✓ شكراً لك! تم استلام طلبك — سأتواصل معك خلال 24 ساعة.'
    }
  };

  const t = labels[lang] || labels.en;

  function scrollToHash(hash) {
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
    const anchor = e.target.closest && e.target.closest('a[href^="#"]');
    if (!anchor) return;
    if (scrollToHash(anchor.getAttribute('href'))) {
      e.preventDefault();
      closeMenu();
    }
  });

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
        const el = entry.target;
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
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('[aria-label="Back to top"], [aria-label="تواصل عبر واتساب"]');

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
    .filter(Boolean);

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
  document.querySelectorAll('.flip-card').forEach((card) => {
    function flip() {
      const isFlipped = card.getAttribute('data-flipped') === 'true';
      document.querySelectorAll('.flip-card').forEach((c) => {
        c.setAttribute('data-flipped', 'false');
      });
      card.setAttribute('data-flipped', isFlipped ? 'false' : 'true');
    }

    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });

  // Contact form validation + submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  const apiUrl = (import.meta?.env?.PUBLIC_CONTACT_API_URL || '/api/contact').replace(/\/$/, '');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('cf-name');
      const email = document.getElementById('cf-email');
      const message = document.getElementById('cf-message');
      const errorName = document.getElementById('error-name');
      const errorEmail = document.getElementById('error-email');
      const errorMessage = document.getElementById('error-message');

      let isValid = true;

      if (!name || !name.value.trim()) {
        if (errorName) errorName.classList.remove('hidden');
        isValid = false;
      } else if (errorName) {
        errorName.classList.add('hidden');
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email.value.trim())) {
        if (errorEmail) errorEmail.classList.remove('hidden');
        isValid = false;
      } else if (errorEmail) {
        errorEmail.classList.add('hidden');
      }

      if (!message || !message.value.trim()) {
        if (errorMessage) errorMessage.classList.remove('hidden');
        isValid = false;
      } else if (errorMessage) {
        errorMessage.classList.add('hidden');
      }

      if (!isValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t.sending;
      }

      const payload = {
        name: name?.value.trim(),
        email: email?.value.trim(),
        phone: (document.getElementById('cf-phone') as HTMLInputElement | null)?.value.trim() || '',
        role: (document.getElementById('cf-role') as HTMLSelectElement | null)?.value || '',
        message: message?.value.trim(),
        website: (document.getElementById('cf-website') as HTMLInputElement | null)?.value.trim() || ''
      };

      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (response) => {
          const data = await response.json().catch(() => ({ error: 'Invalid server response.' }));
          if (!response.ok) {
            throw new Error(data.error || `Request failed with status ${response.status}`);
          }
          return data;
        })
        .then(() => {
          showFormSuccess();
          contactForm.reset();
        })
        .catch((err) => {
          showFormError(err.message);
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = t.submit;
          }
        });
    });
  }

  function showFormSuccess() {
    if (formError) {
      formError.classList.add('hidden', 'opacity-0', 'translate-y-2');
      formError.classList.remove('opacity-100', 'translate-y-0');
    }
    if (formStatus) {
      formStatus.textContent = t.success;
      formStatus.classList.remove('hidden', 'opacity-0', 'translate-y-2');
      formStatus.classList.add('opacity-100', 'translate-y-0');
    }
  }

  function showFormError(message: string) {
    if (formStatus) {
      formStatus.classList.add('hidden', 'opacity-0', 'translate-y-2');
      formStatus.classList.remove('opacity-100', 'translate-y-0');
    }
    if (formError) {
      formError.textContent = message;
      formError.classList.remove('hidden', 'opacity-0', 'translate-y-2');
      formError.classList.add('opacity-100', 'translate-y-0');
    }
  }
})();
