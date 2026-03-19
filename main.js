import './style.css'

// Cascade Systems - Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initBackToTop();
  initCustomCursor();
  initTypewriter();
  initHeader();
  initCounters();
  initScrollReveal();
  initFAQ();
  initModal();
  initTimeline();
  initMobileCTA();
  initFooterNav();
  initScrollTo();
});

// Scroll to Section
function initScrollTo() {
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');
  scrollButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll-to');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Scroll Progress Line
function initScrollProgress() {
  const line = document.getElementById('scroll-progress-line');
  if (!line) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    line.style.height = scrolled + "%";
  }, { passive: true });
}

// Back to Top
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 1000) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

// Custom Cursor
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const interactiveElements = document.querySelectorAll('button, a, .faq-question-header, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.backgroundColor = 'rgba(245, 166, 35, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}

// Typewriter Animation
function initTypewriter() {
  const lines = [
    '> INITIALIZING WORKFLOW...',
    '> CONNECTING: CRM → AI_AGENT → EMAIL → DONE',
    '> TASKS ELIMINATED: 847 this week',
    '> STATUS: RUNNING ✓'
  ];

  const terminal = document.getElementById('terminal');
  if (!terminal) return;
  
  terminal.innerHTML = '';
  let lineIndex = 0;
  let charIndex = 0;

  function addNewLine() {
    const line = document.createElement('div');
    line.className = 'terminal-line active-line';
    terminal.appendChild(line);
    return line;
  }

  function type() {
    if (lineIndex >= lines.length) {
      document.querySelectorAll('.active-line').forEach(l => l.classList.remove('active-line'));
      return;
    }

    let activeLine = terminal.querySelector('.active-line');
    if (!activeLine) activeLine = addNewLine();

    const currentLineText = lines[lineIndex];

    if (charIndex < currentLineText.length) {
      activeLine.textContent = currentLineText.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, 30);
    } else {
      activeLine.classList.remove('active-line');
      lineIndex++;
      charIndex = 0;
      setTimeout(type, 600);
    }
  }

  type();
}

// Header & Navigation
function initHeader() {
  const header = document.getElementById('mainHeader');
  const heroSection = document.getElementById('heroSection');
  if (!header || !heroSection) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('visible');
    } else {
      header.classList.remove('visible');
    }
  }, { passive: true });
}

// Counters
function initCounters() {
  const animateCounter = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = !Number.isInteger(target);
    const suffix = element.getAttribute('data-suffix') || '';
    
    // Set initial 0 value with suffix from the start
    element.textContent = `0${suffix}`;
    
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
        clearInterval(timer);
      } else {
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      }
    }, interval);
  };

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        entry.target.setAttribute('data-animated', 'true');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stat-counter').forEach(stat => {
    // Initialize with 0 + suffix
    const suffix = stat.getAttribute('data-suffix') || '';
    stat.textContent = `0${suffix}`;
    statsObserver.observe(stat);
  });
}

// Scroll Entrance Animations
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add reveal class to elements for scroll entrance
  const elementsToReveal = document.querySelectorAll(
    '.service-card, .timeline-step, .pricing-tier, .who-list-container, .faq-item-container, .stat-item'
  );
  
  elementsToReveal.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

// FAQ Accordion
function initFAQ() {
  const faqHeaders = document.querySelectorAll('.faq-question-header');
  
  faqHeaders.forEach(header => {
    // Add accessibility attributes
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const answer = header.nextElementSibling;
      const icon = header.querySelector('.faq-toggle-icon');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-question-header').forEach(h => {
        if (h !== header) {
          h.setAttribute('aria-expanded', 'false');
          h.nextElementSibling.style.maxHeight = null;
          h.nextElementSibling.classList.remove('active');
          h.querySelector('.faq-toggle-icon').textContent = '+';
        }
      });

      // Toggle current
      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.textContent = '−';
      } else {
        answer.classList.remove('active');
        answer.style.maxHeight = null;
        icon.textContent = '+';
      }
    });
  });
}

// Modal Logic
function initModal() {
  const modal = document.getElementById('bookAuditModal');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButton = document.querySelector('.modal-close');
  const form = document.getElementById('auditForm');
  const formMessage = document.getElementById('formMessage');
  
  const step1 = document.getElementById('modal-step-1');
  const step2 = document.getElementById('modal-step-2');
  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const nextBtn = document.getElementById('next-step');
  const prevBtn = document.getElementById('prev-step');

  const openModal = () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetModal();
  };

  const closeModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  const resetModal = () => {
    step1.classList.add('active');
    step2.classList.remove('active');
    dot1.classList.add('active');
    dot2.classList.remove('active');
    form.style.display = 'block';
    formMessage.style.display = 'none';
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      if (name && email) {
        step1.classList.remove('active');
        step2.classList.add('active');
        dot1.classList.remove('active');
        dot2.classList.add('active');
      } else {
        form.querySelector('[name="name"]').reportValidity();
        form.querySelector('[name="email"]').reportValidity();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      step1.classList.add('active');
      step2.classList.remove('active');
      dot1.classList.add('active');
      dot2.classList.remove('active');
    });
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';

      // Fake timeout
      setTimeout(() => {
        form.style.display = 'none';
        formMessage.style.display = 'block';
        formMessage.innerHTML = `
          <h3 style="color: var(--amber); margin-bottom: 12px;">SYSTEMS AUDIT REQUESTED</h3>
          <p>We'll send you a Calendly link within 2 hours to finalize your time.</p>
        `;
        
        // Reset after 5s
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            form.style.display = 'block';
            formMessage.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            form.reset();
          }, 500);
        }, 5000);
      }, 1500);
    });
  }
}

// Timeline Animation
function initTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('visible');
      }
    });
  }, observerOptions);

  observer.observe(timeline);
}

// Mobile Sticky CTA
function initMobileCTA() {
  const stickyCta = document.getElementById('mobile-sticky-cta');
  if (!stickyCta) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 800) {
      stickyCta.classList.add('visible');
    } else {
      stickyCta.classList.remove('visible');
    }
  }, { passive: true });
}

// Footer Nav Active State
function initFooterNav() {
  const navLinks = document.querySelectorAll('.footer-nav a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
