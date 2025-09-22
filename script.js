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

// Testimonials Carousel
function initTestimonialsCarousel() {
  console.log('=== INITIALIZING TESTIMONIALS CAROUSEL ===');

  const track = document.querySelector('.testimonials-track');
  const items = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const dotsContainer = document.querySelector('.testimonial-dots');

  console.log('Track found:', !!track);
  console.log('Items found:', items.length);
  console.log('Prev button found:', !!prevBtn);
  console.log('Next button found:', !!nextBtn);
  console.log('Dots container found:', !!dotsContainer);

  if (!track || !items.length) {
    console.log('=== TESTIMONIALS CAROUSEL ELEMENTS NOT FOUND ===');
    return;
  }

  let currentIndex = 0;
  const totalItems = items.length;

  // Set track width for proper sliding
  track.style.width = `${totalItems * 100}%`;
  items.forEach(item => {
    item.style.width = `${100 / totalItems}%`;
  });

  // Create dots
  console.log('Creating dots for', totalItems, 'items');
  items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
    console.log('Dot', index, 'created');
  });

  const dots = document.querySelectorAll('.testimonial-dot');
  console.log('Dots created:', dots.length);

  function updateCarousel() {
    const translateX = -currentIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-play (optional)
  let autoplayInterval = setInterval(nextSlide, 5000);

  // Pause on hover
  const container = document.querySelector('.testimonials-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    container.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    });
  }

  console.log(`=== TESTIMONIALS CAROUSEL INITIALIZED: ${totalItems} items ===`);
}

// Initialize testimonials carousel
initTestimonialsCarousel();

// End of script.js
console.log('Script loaded successfully');