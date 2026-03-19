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
  initFlowchart();
  initHapticButtons();
  initPipelineTooltips();
  initNavBreadcrumbs();
});

function initFlowchart() {
  const nodes = [
    { node: document.getElementById('flow-node-1'), color: '#F5A623' },
    { node: document.getElementById('flow-node-2'), color: '#00CFFF' },
    { node: document.getElementById('flow-node-3'), color: '#00FF87' },
    { node: document.getElementById('flow-node-4'), color: '#7B61FF' },
  ];

  const pipes = [
    { el: document.getElementById('pipe-1'), color: '#F5A623' },
    { el: document.getElementById('pipe-2'), color: '#00CFFF' },
    { el: document.getElementById('pipe-3'), color: '#00FF87' },
  ];

  let step = 0;

  function clearAll() {
    nodes.forEach(n => {
      n.node.classList.remove('active');
      n.node.style.removeProperty('--node-color');
    });
    pipes.forEach(p => {
      p.el.classList.remove('active');
      p.el.style.removeProperty('--pipe-color');
      const dot = p.el.querySelector('.pipe-dot');
      if (dot) {
        dot.classList.remove('traveling');
        void dot.offsetWidth; // force reflow to restart animation
      }
    });
  }

  function runStep() {
    clearAll();

    // Activate current node
    const currentNode = nodes[step];
    if (currentNode && currentNode.node) {
      currentNode.node.classList.add('active');
      currentNode.node.style.setProperty('--node-color', currentNode.color);
    }

    // Activate pipe leading out of current node (if not last)
    if (step < pipes.length) {
      const currentPipe = pipes[step];
      if (currentPipe && currentPipe.el) {
        currentPipe.el.classList.add('active');
        currentPipe.el.style.setProperty('--pipe-color', currentPipe.color);
        const dot = currentPipe.el.querySelector('.pipe-dot');
        if (dot) {
          dot.style.fill = currentPipe.color;
          dot.classList.add('traveling');
        }
      }
    }

    step = (step + 1) % nodes.length;
  }

  // Start immediately then loop
  runStep();
  setInterval(runStep, 1200);
}

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

  const interactiveElements = document.querySelectorAll('button, a, .faq-question-header, input, textarea, .flow-node-box');
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

// Haptic Pulse on Click
function initHapticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      const pulse = document.createElement('div');
      pulse.className = 'btn-pulse';
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pulse.style.left = `${x}px`;
      pulse.style.top = `${y}px`;
      btn.appendChild(pulse);
      setTimeout(() => pulse.remove(), 600);
    });

    // Button Glitch Effect
    const originalText = btn.textContent;
    btn.addEventListener('mouseenter', () => {
      let iteration = 0;
      const interval = setInterval(() => {
        btn.textContent = btn.textContent.split("")
          .map((char, index) => {
            if(index < iteration) return originalText[index];
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"[Math.floor(Math.random() * 40)];
          })
          .join("");
        
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    });
    btn.addEventListener('mouseleave', () => {
      btn.textContent = originalText;
    });
  });
}

// Pipeline Tooltips
function initPipelineTooltips() {
  const tooltip = document.createElement('div');
  tooltip.className = 'pipe-tooltip';
  document.body.appendChild(tooltip);

  const nodeData = {
    'flow-node-1': 'STATUS: HANDSHAKE_OK | LATENCY: 12ms',
    'flow-node-2': 'INTENT: CLASSIFIED_HIGH | TOKENS: 412',
    'flow-node-3': 'CRM: SYNCED | TARGET: HUBSPOT',
    'flow-node-4': 'MAIL: DISPATCHED | TEMPLATE: v2.4'
  };

  const nodes = document.querySelectorAll('.flow-node');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const info = nodeData[node.id];
      if (info) {
        tooltip.textContent = info;
        tooltip.classList.add('visible');
      }
    });

    node.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    });

    node.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

// Navigation Breadcrumbs logic
function initNavBreadcrumbs() {
  const paths = document.querySelectorAll('.nav-path');
  const sections = [
    { id: 'heroSection', path: 'C:/CASCADE/ROOT' },
    { id: 'servicesSection', path: 'C:/CASCADE/BUILD' },
    { id: 'pricingSection', path: 'C:/CASCADE/PRICING' }
  ];

  const handleScroll = () => {
    let currentId = '';
    sections.forEach(s => {
      const section = document.getElementById(s.id);
      if (section && window.scrollY >= section.offsetTop - 300) {
        currentId = s.id;
      }
    });

    paths.forEach(path => {
      const target = path.getAttribute('href').replace('#', '');
      const config = sections.find(s => s.id === target);
      
      if (target === currentId) {
        path.classList.add('active');
        if (config) {
          if (target === 'heroSection') path.textContent = 'C:/CASCADE/ROOT';
          else if (target === 'servicesSection') path.textContent = 'root.dispatch(services)';
          else if (target === 'pricingSection') path.textContent = 'api.fetch(pricing)';
        }
      } else {
        path.classList.remove('active');
        path.textContent = path.getAttribute('data-label');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call
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
      // Keep active-line class for the cursor to stay active until next line or end
      setTimeout(() => {
        activeLine.classList.remove('active-line');
        lineIndex++;
        charIndex = 0;
        type();
      }, 600);
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
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll(
    '.service-card, .timeline-step, .pricing-tier, .who-list-container, .faq-item-container, .stat-item'
  );

  targets.forEach(el => revealObserver.observe(el));
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
