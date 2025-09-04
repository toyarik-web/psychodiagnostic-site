// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', String(!expanded));
    document.body.classList.toggle('nav-open');
  });

  navMenu.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.tagName.toLowerCase() === 'a') {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


// Smooth scroll with header offset and active nav highlighting
const headerEl = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-menu a');

function getHeaderOffset() {
  return headerEl ? headerEl.getBoundingClientRect().height : 0;
}

function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;
  const headerOffset = getHeaderOffset();
  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerOffset - 8;
  window.scrollTo({ top: Math.max(offsetPosition, 0), behavior: 'smooth' });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
    }
  });
});

const sections = Array.from(document.querySelectorAll('main section[id]'));
const linkById = new Map(
  Array.from(navLinks).map((l) => [l.getAttribute('href'), l])
);

function setActiveNav() {
  const headerOffset = getHeaderOffset() + 12;
  let activeId = '#hero';
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const top = rect.top - headerOffset;
    if (top <= 0) activeId = `#${section.id}`;
  }
  navLinks.forEach((l) => l.classList.remove('active'));
  const activeLink = linkById.get(activeId);
  if (activeLink) activeLink.classList.add('active');
}

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('resize', setActiveNav);
window.addEventListener('load', setActiveNav);

// FAQ accordion
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach((item) => {
  const trigger = item.querySelector('.accordion-trigger');
  const panel = item.querySelector('.accordion-panel');
  if (!trigger || !panel) return;

  const closePanel = () => {
    item.classList.remove('expanded');
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.height = '0px';
  };

  const openPanel = () => {
    item.classList.add('expanded');
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.height = panel.scrollHeight + 'px';
  };

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('expanded');
    // Close others (accordion behavior)
    accordionItems.forEach((other) => {
      if (other !== item) {
        const otherPanel = other.querySelector('.accordion-panel');
        const otherTrigger = other.querySelector('.accordion-trigger');
        if (otherPanel && otherTrigger) {
          other.classList.remove('expanded');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.style.height = '0px';
        }
      }
    });

    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });
});

// Contact form validation (client-only demo)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');

    const errors = {
      name: '',
      email: '',
      message: '',
      consent: ''
    };

    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

    if (!nameInput.value.trim()) {
      errors.name = 'Будь ласка, вкажіть ім\'я';
    }
    if (!emailRegex.test(emailInput.value)) {
      errors.email = 'Введіть коректний email';
    }
    if (!messageInput.value.trim()) {
      errors.message = 'Коротко опишіть ваш запит';
    }
    if (!consentInput.checked) {
      errors.consent = 'Потрібна згода на обробку даних';
    }

    // Show errors
    Object.entries(errors).forEach(([key, msg]) => {
      const el = document.querySelector(`small.error[data-for="${key}"]`);
      if (el) el.textContent = msg;
    });

    const hasError = Object.values(errors).some(Boolean);
    if (!hasError) {
      alert('Дякуємо! Ваше повідомлення надіслано (демо).');
      form.reset();
    }
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}


// Reveal on scroll animations
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));
