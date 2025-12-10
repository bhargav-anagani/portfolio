// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger && hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
});

// TYPING effect (simple, like the reference)
const phrases = [
  "B.Tech CSE Student",
  "Aspiring Software Engineer",
  "Java • Python • Web Development",
  "Accessibility & Frontend"
];
let tIndex = 0, charIndex = 0, typingForward = true;
const typedEl = document.getElementById('typed-text');
const speed = 60;
const pause = 1200;

function typeLoop() {
  const current = phrases[tIndex];
  if (typingForward) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      typingForward = false;
      setTimeout(typeLoop, pause);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      typingForward = true;
      tIndex = (tIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, speed);
}
document.addEventListener('DOMContentLoaded', () => {
  if (typedEl) typeLoop();
});

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      const offset = 24;
      const target = document.querySelector(href);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // close mobile nav
      if (nav.classList.contains('open')) nav.classList.remove('open');
    }
  });
});

// Reveal on scroll (IntersectionObserver)
const revealEls = document.querySelectorAll('.section, .project-card, .timeline-item, .edu-grid > div, .avatar');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Contact form demo
function submitForm(e) {
  e.preventDefault();
  const n = document.getElementById('name').value.trim();
  const em = document.getElementById('email').value.trim();
  const m = document.getElementById('message').value.trim();
  if (!n || !em || !m) return alert('Please fill all fields.');
  alert(`Thanks ${n}! (demo)`);
  document.getElementById('contactForm').reset();
}
