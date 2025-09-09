console.info('[site] js loaded v16');
console.info('[site] js loaded v155');
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
      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) { statusEl.textContent = 'Надсилаємо...'; statusEl.className = 'form-status'; }
      const resp = await fetch('./contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ name, email, phone, message, consent: String(consent), ajax: '1' }).toString()
      });
      let data={}; try{ data=await resp.json(); }catch(e){ data={ ok: resp.ok }; }
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

});
