console.info('[site] js loaded v16');
console.info('[site] js loaded v155');
alert('SCRIPT.JS LOADED! Modal functionality should work now.');
console.log('=== MAIN SCRIPT STARTED ===');

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Initial check
}

document.addEventListener('DOMContentLoaded', function(){
// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navToggleCheckbox = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', (ev) => {
    ev && ev.preventDefault && ev.preventDefault();
    const next = !(navToggleCheckbox && navToggleCheckbox.checked);
    if (navToggleCheckbox) navToggleCheckbox.checked = next;
    navToggle.setAttribute('aria-expanded', String(next));
    document.body.classList.toggle('nav-open', next);
    if (navMenu) { navMenu.style.transform = next ? 'translateY(0)' : ''; }
  });

  navMenu.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.tagName.toLowerCase() === 'a') {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (navToggleCheckbox) navToggleCheckbox.checked = false;
      if (navMenu) navMenu.style.transform = '';
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

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}




// AJAX submit to contact.php
const form = document.getElementById('contactForm');
if (form) {
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const messageEl = document.getElementById('message');
  const consentEl = document.getElementById('consent');
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById('formStatus');

  function setError(key, msg) {
    const el = document.querySelector(`small.error[data-for="${key}"]`);
    if (el) el.textContent = msg || '';
  }

  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { form.setAttribute('action',''); } catch(e) {}
    
    console.info('submit: sending');
    e.stopPropagation();
    if (form.hasAttribute('action')) form.setAttribute('action','');

    setError('name',''); setError('email',''); setError('phone',''); setError('message',''); setError('consent','');
    if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-status'; }

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const message = messageEl.value.trim();
    const consent = !!(consentEl && consentEl.checked);

    if (!name && !email && !phone) {
      setError('email','Вкажіть хоча б email або телефон');
      setError('phone','Вкажіть хоча б телефон або email');
      if (statusEl) { statusEl.textContent = 'Заповніть мінімальні контакти.'; statusEl.className = 'form-status error'; }
      return;
    }

    try {
      console.log('Starting form submission...');
      console.log('Form data:', { name, email, phone, message, consent });
      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) { statusEl.textContent = 'Надсилаємо...'; statusEl.className = 'form-status'; }
      const resp = await fetch('./contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ name, email, phone, message, consent: String(consent), ajax: '1' }).toString()
      });
      console.log('Response status:', resp.status, 'OK:', resp.ok);
      let data={}; try{ data=await resp.json(); console.log('Response data:', data); }catch(e){ console.error('JSON parse error:', e); data={ ok: resp.ok }; }
      if (resp.ok && data.ok) {
        if (statusEl) { statusEl.textContent = 'Повідомлення відправлено. Дякуємо!'; statusEl.className = 'form-status success'; statusEl.style.display='block'; statusEl.style.display='block'; if (statusEl){ statusEl.style.display='block'; statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
        form.reset();
      } else {
        if (statusEl) { statusEl.textContent = 'Не вдалося надіслати. Спробуйте пізніше.'; statusEl.className = 'form-status error'; statusEl.style.display='block'; statusEl.scrollIntoView({behavior:'smooth',block:'center'}); }
      }
    } catch (err) {
      if (statusEl) { statusEl.textContent = 'Помилка мережі. Спробуйте ще раз.'; statusEl.className = 'form-status error'; }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}


// Scroll to top button
const toTop = document.getElementById('toTop');
function onScrollTopBtn(){ if(!toTop) return; toTop.classList.toggle('show', window.scrollY > 400); }
window.addEventListener('scroll', onScrollTopBtn, { passive: true });
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Prevent background scroll when nav open on iOS
document.addEventListener('touchmove', (ev)=>{ if(document.body.classList.contains('nav-open')) ev.preventDefault(); }, {passive:false});

// Scrolling testimonials functionality
function initScrollingTestimonials() {
  const testimonials = document.querySelector('.scrolling-content');
  if (!testimonials) return;

  // Pause on touch devices when scrolling
  let isScrolling = false;
  testimonials.addEventListener('touchstart', () => {
    isScrolling = true;
    testimonials.style.animationPlayState = 'paused';
  });

  testimonials.addEventListener('touchend', () => {
    isScrolling = false;
    setTimeout(() => {
      if (!isScrolling) {
        testimonials.style.animationPlayState = 'running';
      }
    }, 3000);
  });

  // Handle visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      testimonials.style.animationPlayState = 'paused';
    } else {
      testimonials.style.animationPlayState = 'running';
    }
  });
}

// Initialize scrolling testimonials
initScrollingTestimonials();

// Initialize theme toggle and header effects
initThemeToggle();
initHeaderScroll();

console.log('=== BASIC FUNCTIONS INITIALIZED ===');

// Test if JavaScript works at all
document.addEventListener('click', function(e) {
  if (e.target.id === 'theme-toggle') return; // Skip theme toggle
  console.log('=== PAGE CLICK DETECTED ===', e.target.tagName, e.target.className);
}, true);

// Test modal functionality
function initTestModal() {
  console.log('=== MODAL INIT STARTED ===');

  const modal = document.getElementById('test-modal');
  const modalContent = document.getElementById('test-modal-content');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const testButtons = document.querySelectorAll('.test-item');

  // Test information database
  const testInfo = {
    'mmpi': {
      title: 'MMPI (Міннесотський багатопрофільний тест особистості)',
      description: 'Класичний психодіагностичний інструмент для оцінки особистості та психічного стану.',
      purpose: 'Виявлення психопатології, оцінка особистісних рис, діагностика психічних розладів.',
      duration: '45-90 хвилин',
      application: 'Дорослі від 18 років',
      reliability: 'Висока надійність, підтверджена десятиріччями досліджень'
    },
    'accentuations': {
      title: 'Тест на акцентуації характеру',
      description: 'Методика для визначення типів акцентуації характеру за Леонгардом.',
      purpose: 'Діагностика особливостей характеру, прогнозування поведінки в стресових ситуаціях.',
      duration: '15-20 хвилин',
      application: 'Підлітки та дорослі',
      reliability: 'Добра валідність для діагностики акцентуацій'
    },
    'szondi': {
      title: 'Метод портретних виборів Л. Сонді',
      description: 'Проективна методика для дослідження несвідомих потягів та інстинктів.',
      purpose: 'Аналіз глибинних мотивів, дослідження особистості на несвідомому рівні.',
      duration: '20-30 хвилин',
      application: 'Дорослі',
      reliability: 'Висока валідність для дослідження несвідомого'
    },
    'ctl': {
      title: 'КТЛ (колірний тест Люшера)',
      description: 'Методика для оцінки психоемоційного стану через вибір кольорів.',
      purpose: 'Діагностика стресу, емоційного вигорання, рівня адаптації.',
      duration: '10-15 хвилин',
      application: 'Діти від 3 років, підлітки, дорослі',
      reliability: 'Перевірена методика з хорошою надійністю'
    },
    'dass21': {
      title: 'DASS-21 (Шкала депресії, тривоги та стресу)',
      description: 'Коротка версія опитувальника для оцінки емоційного стану.',
      purpose: 'Вимірювання рівня депресії, тривоги та стресу.',
      duration: '5-10 хвилин',
      application: 'Підлітки та дорослі',
      reliability: 'Висока надійність та валідність'
    },
    'phq9': {
      title: 'PHQ-9 (Шкала пацієнта з питань здоров\'я - депресія)',
      description: 'Стандартизований опитувальник для діагностики депресії.',
      purpose: 'Оцінка тяжкості депресивних симптомів, моніторинг лікування.',
      duration: '5 хвилин',
      application: 'Дорослі',
      reliability: 'Золотистий стандарт для скринінгу депресії'
    },
    'gad7': {
      title: 'GAD-7 (Шкала генералізованої тривоги)',
      description: 'Опитувальник для оцінки генералізованої тривоги.',
      purpose: 'Діагностика тривожних розладів, оцінка тяжкості симптомів.',
      duration: '5 хвилин',
      application: 'Підлітки та дорослі',
      reliability: 'Висока чутливість та специфічність'
    },
    'pcl5': {
      title: 'PCL-5 (Контрольний список симптомів ПТСР)',
      description: 'Сучасна версія діагностики посттравматичного стресового розладу.',
      purpose: 'Діагностика ПТСР, оцінка тяжкості симптомів.',
      duration: '10-15 хвилин',
      application: 'Дорослі',
      reliability: 'Затверджена DSM-5'
    },
    'epds': {
      title: 'EPDS (Шкала Единбурга післяпологової депресії)',
      description: 'Спеціалізований тест для виявлення післяпологової депресії.',
      purpose: 'Скринінг післяпологової депресії у матерів.',
      duration: '5 хвилин',
      application: 'Жінки після пологів',
      reliability: 'Золотистий стандарт для післяпологової депресії'
    },
    'audit': {
      title: 'AUDIT (Тест ідентифікації проблем алкоголю)',
      description: 'Міжнародний стандартизований тест для оцінки алкогольних проблем.',
      purpose: 'Виявлення ризикованого вживання алкоголю та алкогольної залежності.',
      duration: '5 хвилин',
      application: 'Дорослі',
      reliability: 'Рекомендований ВООЗ'
    },
    'asq3': {
      title: 'ASQ-3 (Скринінг розвитку дитини)',
      description: 'Стандартизований інструмент для оцінки розвитку дитини.',
      purpose: 'Виявлення затримок у розвитку, оцінка когнітивних, мовних та моторних навичок.',
      duration: '10-15 хвилин',
      application: 'Діти від 1 місяця до 5.5 років',
      reliability: 'Висока надійність для скринінгу'
    }
  };

  // Show modal with test info
  function showTestModal(testId) {
    const info = testInfo[testId];

    if (!info) {
      modalContent.innerHTML = `
        <h4>Інформація недоступна</h4>
        <p>На жаль, детальна інформація про цей тест ще не додана до системи.</p>
        <p><strong>ID тесту:</strong> ${testId}</p>
      `;
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      return;
    }

    modalContent.innerHTML = `
      <h4>${info.title}</h4>
      <p><strong>Опис:</strong> ${info.description}</p>
      <p><strong>Призначення:</strong> ${info.purpose}</p>
      <p><strong>Тривалість:</strong> ${info.duration}</p>
      <p><strong>Застосування:</strong> ${info.application}</p>
      <p><strong>Надійність:</strong> ${info.reliability}</p>
    `;

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Hide modal
  function hideTestModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event listeners
  testButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('=== TEST BUTTON CLICKED ===', e.target.getAttribute('data-test'));
      e.preventDefault();
      e.stopPropagation();
      const testId = button.getAttribute('data-test');
      showTestModal(testId);
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', hideTestModal);
  });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      hideTestModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      hideTestModal();
    }
  });

  console.log('=== MODAL INIT COMPLETED ===');
}

// Initialize test modal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== DOM CONTENT LOADED ===');
  initTestModal();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // Wait for DOMContentLoaded
} else {
  console.log('=== CALLING MODAL INIT ===');
  initTestModal();
}

// Test if modal elements exist
console.log('=== CHECKING MODAL ELEMENTS ===');
setTimeout(() => {
  const modal = document.getElementById('test-modal');
  const testButtons = document.querySelectorAll('.test-item');
  console.log('Modal element:', modal);
  console.log('Test buttons count:', testButtons.length);
}, 100);
