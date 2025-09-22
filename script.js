console.info('[site] js loaded');
console.log('=== MAIN SCRIPT STARTED ===');

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    // Update button icon
    const updateIcon = () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      themeToggle.innerHTML = isDark ?
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' :
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    };

    updateIcon();

    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon();
    });
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state
}

// Show more functionality removed - all tests shown by default

// Accordion functionality for test descriptions
function initAccordion() {
  console.log('=== INITIALIZING ACCORDION ===');
  var buttons = document.querySelectorAll('.test-item[data-test]');
  console.log('Found', buttons.length, 'test buttons');

  buttons.forEach(function(button) {
    button.onclick = function() {
      console.log('=== BUTTON CLICKED ===', this.textContent);

      // Get the description for this button
      var description = this.nextElementSibling;
      console.log('Next sibling element:', description);

      if (description && description.classList.contains('test-description')) {
        // Check if this description is already open
        var isCurrentlyOpen = description.classList.contains('show');

        // Close all descriptions first
        var allDescriptions = document.querySelectorAll('.test-description');
        var allButtons = document.querySelectorAll('.test-item');

        allDescriptions.forEach(function(desc) {
          desc.classList.remove('show');
        });

        allButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });

        // If this description wasn't open, open it
        if (!isCurrentlyOpen) {
          description.classList.add('show');
          this.classList.add('active');
          console.log('=== DESCRIPTION OPENED SUCCESSFULLY ===');
        } else {
          console.log('=== DESCRIPTION CLOSED (was already open) ===');
        }
      } else {
        console.log('=== NO VALID DESCRIPTION FOUND ===');
      }
    };
  });

  console.log('=== ACCORDION INITIALIZED ===');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== DOM CONTENT LOADED ===');
  initThemeToggle();
  initHeaderScroll();
  initAccordion();
  initFAQAccordion();
  protectCertificates();

  // Navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking links
    navMenu.addEventListener('click', function(e) {
      const target = e.target;
      if (target && target.tagName && target.tagName.toLowerCase() === 'a') {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Contact form
const form = document.getElementById('contactForm');
if (form) {
    form.setAttribute('action', '');
  const statusEl = document.getElementById('formStatus');

    form.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();

      try {
        form.setAttribute('action', '');
      } catch (error) {
        console.error('Form submission error:', error);
    }
  });
}

  // Back to top button
const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function() {
      toTop.classList.toggle('show', window.scrollY > 400);
    });

    toTop.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }
});

// FAQ Accordion functionality
function initFAQAccordion() {
  console.log('=== INITIALIZING FAQ ACCORDION ===');
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const item = this.parentElement;
      const panel = this.nextElementSibling;
      const isExpanded = item.classList.contains('expanded');

      // Close all FAQ items first
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('expanded');
        const otherPanel = otherItem.querySelector('.accordion-panel');
        if (otherPanel) {
          otherPanel.style.height = '0';
        }
        const otherTrigger = otherItem.querySelector('.accordion-trigger');
        if (otherTrigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // If this item wasn't expanded, expand it
      if (!isExpanded) {
        item.classList.add('expanded');
        this.setAttribute('aria-expanded', 'true');

        // Set height for smooth animation
        if (panel) {
          panel.style.height = panel.scrollHeight + 'px';
        }
      } else {
        // If it was expanded, it will be closed by the code above
        this.setAttribute('aria-expanded', 'false');
      }
    });
  });

  console.log('=== FAQ ACCORDION INITIALIZED ===');
}

// Testimonials functionality removed - using simple static display

// Certificate modal functionality
function openCertificateModal(imageSrc) {
  const modal = document.getElementById('certificateModal');
  const modalImg = document.getElementById('certificateModalImage');

  modal.style.display = 'block';
  modalImg.src = imageSrc;

  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

function closeCertificateModal() {
  const modal = document.getElementById('certificateModal');

  modal.style.display = 'none';

  // Restore body scrolling
  document.body.style.overflow = 'auto';
}

// Protect certificates from copying
function protectCertificates() {
  // Disable right-click on certificate images
  document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.certifications-grid') || e.target.closest('.certificate-modal')) {
      e.preventDefault();
      return false;
    }
  });

  // Disable common copy shortcuts on certificate images
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 's' || e.key === 'S' || e.key === 'a' || e.key === 'A')) {
      if (document.activeElement.closest('.certifications-grid') || document.activeElement.closest('.certificate-modal')) {
        e.preventDefault();
        return false;
      }
    }

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  });

  // Close modal when clicking outside
  document.getElementById('certificateModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeCertificateModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('certificateModal').style.display === 'block') {
      closeCertificateModal();
    }
  });
}

// End of script.js
console.log('Script loaded successfully');