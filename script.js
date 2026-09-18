// ============================================================
// Saiteja Gajula — Portfolio interactions
// ============================================================
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile nav ----------
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  // ---------- Nav background on scroll ----------
  const nav = document.querySelector('.nav');
  const backTop = document.getElementById('back-top');

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 10);
    backTop.hidden = y < 400;
    backTop.classList.toggle('show', y >= 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  );

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- Active section highlighting ----------
  const sections = document.querySelectorAll('main section[id]');
  const linkMap = new Map();
  navLinks.querySelectorAll('a').forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    linkMap.set(id, a);
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            linkMap.forEach((a) => a.classList.remove('active'));
            const link = linkMap.get(entry.target.id);
            if (link) link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  // ---------- Hero role rotator ----------
  const rotator = document.getElementById('rotator');
  const roles = ['Front-End Developer', 'UI Enthusiast', 'CS Undergrad'];
  let roleIndex = 0;

  if (rotator && !reduceMotion) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      rotator.style.opacity = '0';
      setTimeout(() => {
        rotator.textContent = roles[roleIndex];
        rotator.style.opacity = '1';
      }, 250);
    }, 3000);
    rotator.style.transition = 'opacity 0.25s ease';
  }

  // ---------- Contact form (mailto compose) ----------
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const invalid = [
      [form.name, !name],
      [form.email, !emailOk],
      [form.message, !message],
    ];
    invalid.forEach(([field, bad]) => field.classList.toggle('invalid', bad));

    if (!name || !emailOk || !message) {
      note.textContent = 'Please fill in all fields with a valid email.';
      note.classList.add('error');
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:saitejag562@gmail.com?subject=${subject}&body=${body}`;

    note.textContent = 'Opening your email app…';
    note.classList.remove('error');
    form.reset();
  });

  // ---------- Footer year ----------
  document.getElementById('year').textContent = new Date().getFullYear();
})();
