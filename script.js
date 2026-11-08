/* ============================================
   وطن كودر — Interactions
============================================ */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 30);
  lastScroll = y;
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.opacity   = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    s1.style.transform = s2.style.opacity = s3.style.transform = '';
    s2.style.opacity   = '1';
  }
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    s1.style.transform = s3.style.transform = '';
    s2.style.opacity = '1';
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-delay]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Stagger grid children
const staggerContainers = [
  '.services-grid',
  '.pf-grid',
  '.testi-grid',
  '.process-list',
  '.tech-grid',
  '.why-points',
];

staggerContainers.forEach(selector => {
  const container = document.querySelector(selector);
  if (!container) return;
  const children = container.querySelectorAll('[data-reveal], .service-card, .pf-card, .testi-card, .process-item, .tech-item, .why-pt');
  children.forEach((child, i) => {
    child.style.setProperty('--stagger-delay', `${i * 70}ms`);
    if (!child.hasAttribute('data-reveal')) {
      child.setAttribute('data-reveal', '');
      revealObserver.observe(child);
    }
  });
});

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.pf-btn');
const pfCards    = document.querySelectorAll('.pf-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.getAttribute('data-filter');
    pfCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-cat') === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        // re-trigger reveal animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('visible'));
        });
      }
    });
  });
});

// ===== CONTACT FORM → WHATSAPP =====
const WHATSAPP_NUMBER = '9647726540792'; // بدون + أو مسافات

const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate required fields
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
      }
    });
    if (!valid) return;

    // Read form values
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const phone   = form.phone.value.trim();
    const service = form.service.options[form.service.selectedIndex].text;
    const message = form.message.value.trim();

    // Build WhatsApp message
    const lines = [
      '📋 *طلب جديد من موقع وطن كودر*',
      '─────────────────',
      `👤 الاسم: ${name}`,
      `📧 البريد: ${email}`,
      phone ? `📱 الهاتف: ${phone}` : null,
      `🛠 الخدمة: ${service}`,
      '─────────────────',
      `💬 التفاصيل:\n${message}`,
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;

    // Show feedback then open WhatsApp
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الفتح...';

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      form.reset();
      submitBtn.style.display = 'none';
      success.removeAttribute('hidden');
    }, 600);
  });

  // Clear error on input
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      if (field.style.borderColor) field.style.borderColor = '';
    });
  });
}

// ===== SMOOTH SCROLL (offset for fixed navbar) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 76,
      behavior: 'smooth',
    });
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]:not(.btn-cta-nav)');

const activeSectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + entry.target.id) {
        a.style.color = 'var(--accent)';
      }
    });
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => activeSectionObserver.observe(s));
