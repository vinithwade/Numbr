(() => {
  'use strict';

  // --- Intersection Observer for scroll animations ---
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate], .problem-card, .feature-card, .feature-item, .impact-card, .impact-hero, .testimonial-card, .solution-flow, .pipeline');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay || 0;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el, i) => {
      const parent = el.closest('.problems-grid, .features-grid, .features-clean, .impact-grid, .testimonials-grid');
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(el);
        el.dataset.delay = index * 100;
      }
      observer.observe(el);
    });
  };

  // --- Video player ---
  const setupVideoPlayer = () => {
    const poster = document.getElementById('videoPoster');
    const video = document.getElementById('demoVideo');
    const playBtn = document.getElementById('playBtn');
    if (!poster || !video || !playBtn) return;

    const play = () => {
      poster.classList.add('hidden');
      video.play();
      video.controls = true;
    };

    playBtn.addEventListener('click', play);
    poster.addEventListener('click', play);

    video.addEventListener('ended', () => {
      poster.classList.remove('hidden');
      video.controls = false;
      video.currentTime = 0;
    });
  };

  // --- Counter animation for impact section ---
  const animateCounters = () => {
    const counters = document.querySelectorAll('.impact-value[data-count], .impact-hero-value[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const target = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals ?? '1', 10);
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = eased * target;

          el.textContent = prefix + value.toFixed(decimals) + suffix;

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });

    counters.forEach((c) => observer.observe(c));
  };

  // --- Smooth scroll for anchor links ---
  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  // --- Waitlist form → Google Sheets ---
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbx6NfaXeYGKYKAi4ILnGAB-Aikdzp_pgMDmEa9wNZeYi6iCF1vVvUyvy7R8GRSS6geZ/exec';

  const setupForm = () => {
    const form = document.getElementById('waitlistForm');
    const success = document.getElementById('waitlistSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.textContent = 'Joining...';
      btn.disabled = true;

      const data = {
        name: form.querySelector('#name').value,
        business: form.querySelector('#business').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
      };

      if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        setTimeout(() => showSuccess(), 800);
        return;
      }

      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      .then(() => showSuccess())
      .catch(() => showSuccess());

      function showSuccess() {
        form.hidden = true;
        success.hidden = false;
        success.style.animation = 'fadeInUp 0.5s ease forwards';
      }
    });
  };

  // --- Navbar scroll → compact pill ---
  const setupNavbar = () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  };

  // --- Banner slide-in + close ---
  const setupBanner = () => {
    const banner = document.getElementById('topBanner');
    const closeBtn = document.getElementById('bannerClose');
    if (!banner) return;

    setTimeout(() => banner.classList.add('show'), 800);

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.classList.remove('show');
        setTimeout(() => banner.style.display = 'none', 600);
      });
    }
  };

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    setupVideoPlayer();
    animateCounters();
    setupSmoothScroll();
    setupForm();
    setupNavbar();
    setupBanner();
  });
})();
