/* ClaySlay – Main JS */

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================
// Custom Cursor
// =========================================
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  trail.style.left = trailX + 'px';
  trail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor expand on hover
document.querySelectorAll('a, button, .char-card, .feel-card, .clay-orb').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    trail.style.width = '60px';
    trail.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    trail.style.width = '36px';
    trail.style.height = '36px';
  });
});

// =========================================
// Scroll Reveal
// =========================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// =========================================
// Nav scroll state
// =========================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// =========================================
// Nav mobile toggle
// =========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '100%';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(250,247,242,0.97)';
  navLinks.style.padding = '1.5rem 2rem';
  navLinks.style.gap = '1.2rem';
  navLinks.style.backdropFilter = 'blur(12px)';
});

// =========================================
// Parallax hero blobs
// =========================================
const blobs = document.querySelectorAll('.blob');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  blobs[0].style.transform = `translate(${y * 0.04}px, ${-y * 0.06}px)`;
  blobs[1].style.transform = `translate(${-y * 0.03}px, ${y * 0.05}px)`;
  blobs[2].style.transform = `translate(${y * 0.05}px, ${y * 0.04}px)`;
}, { passive: true });

// =========================================
// Character card eye tracking
// =========================================
document.querySelectorAll('.char-card').forEach(card => {
  const pupils = card.querySelectorAll('.pupil');
  const color = card.dataset.color;
  if (color) card.style.setProperty('color', color);

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(Math.sqrt(dx*dx + dy*dy) * 0.03, 3);
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    pupils.forEach(p => {
      p.style.transform = `translate(${px}px, ${py}px)`;
    });
  });

  card.addEventListener('mouseleave', () => {
    pupils.forEach(p => {
      p.style.transform = 'translate(0,0)';
    });
  });
});

// =========================================
// Clay orb press interaction
// =========================================
const clayOrb = document.querySelector('.clay-orb');
if (clayOrb) {
  clayOrb.addEventListener('mousedown', () => {
    clayOrb.querySelector('.orb-inner').style.transform = 'translate(-50%,-50%) scale(0.9)';
    clayOrb.querySelector('.orb-inner').style.borderRadius = '55% 45% 60% 40% / 45% 60% 40% 55%';
  });
  clayOrb.addEventListener('mouseup', () => {
    clayOrb.querySelector('.orb-inner').style.transform = 'translate(-50%,-50%) scale(1.08)';
    setTimeout(() => {
      clayOrb.querySelector('.orb-inner').style.transform = 'translate(-50%,-50%) scale(1)';
      clayOrb.querySelector('.orb-inner').style.borderRadius = '50%';
    }, 400);
  });
}

// =========================================
// Marquee duplicate for seamless loop
// =========================================
const marqueeInner = document.querySelector('.marquee span');
if (marqueeInner) {
  marqueeInner.innerHTML = marqueeInner.innerHTML + marqueeInner.innerHTML;
}

// =========================================
// Feel cards stagger on scroll
// =========================================
const feelCards = document.querySelectorAll('.feel-card');
const feelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = parseInt(entry.target.dataset.index) || 0;
      entry.target.style.transitionDelay = (idx * 0.1) + 's';
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

feelCards.forEach(c => feelObserver.observe(c));

// =========================================
// Smooth scroll for nav links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    }
  });
});

// =========================================
// Squish sound feedback (visual ripple)
// =========================================
function createRipple(x, y, color) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px; top: ${y}px;
    width: 0; height: 0;
    border-radius: 50%;
    background: ${color || 'rgba(196,113,59,0.2)'};
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9990;
    transition: width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out;
  `;
  document.body.appendChild(ripple);
  requestAnimationFrame(() => {
    ripple.style.width = '120px';
    ripple.style.height = '120px';
    ripple.style.opacity = '0';
  });
  setTimeout(() => ripple.remove(), 700);
}

document.querySelectorAll('.char-card').forEach(card => {
  card.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY, card.dataset.color + '33');
  });
});

// =========================================
// Quote section text reveal on scroll
// =========================================
const quoteInner = document.querySelector('.quote-inner');
if (quoteInner) {
  const quoteObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.3 });
  quoteObserver.observe(quoteInner);
}
