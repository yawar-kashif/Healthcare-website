// ── SCROLL & NAVBAR ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  const btt = document.getElementById('backToTop');
  const bar = document.getElementById('progress-bar');
  const scrollY = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollY / docH) * 100;

  nav.classList.toggle('scrolled', scrollY > 50);
  btt.classList.toggle('visible', scrollY > 400);
  bar.style.width = progress + '%';
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link, .mobile-menu .btn-primary').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── REVEAL ANIMATIONS ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ── COUNTERS ──
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const startVal = 0;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(easeOut(progress) * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Hero stats
['hStat1','hStat2','hStat3'].forEach((id, i) => {
  const el = document.getElementById(id);
  const targets = [48000, 120, 25];
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter(el, targets[i], 2500);
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(el);
});

// ── LIVE VITALS ──
const heartRateEl = document.getElementById('heartRate');
const o2El = document.getElementById('o2');
function updateVitals() {
  const hr = 68 + Math.floor(Math.random() * 10);
  const o2 = 97 + Math.floor(Math.random() * 2);
  if (heartRateEl) heartRateEl.innerHTML = `${hr} <small style="font-size:12px;font-weight:400">bpm</small>`;
  if (o2El) o2El.innerHTML = `${o2} <small style="font-size:12px;font-weight:400">%</small>`;
}
setInterval(updateVitals, 3000);

// ── TESTIMONIALS ──
const track = document.getElementById('testimonialsTrack');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('tDots');
let tIndex = 0;
const visibleCards = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  const totalDots = Math.max(1, cards.length - visibleCards() + 1);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'tNav-dot' + (i === tIndex ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(i) {
  const maxIndex = Math.max(0, cards.length - visibleCards());
  tIndex = Math.max(0, Math.min(i, maxIndex));
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 400;
  track.style.transform = `translateX(-${tIndex * cardWidth}px)`;
  cards.forEach((c, idx) => c.classList.toggle('active', idx === tIndex));
  document.querySelectorAll('.tNav-dot').forEach((d, idx) => d.classList.toggle('active', idx === tIndex));
}

document.getElementById('tNext')?.addEventListener('click', () => goToSlide(tIndex + 1));
document.getElementById('tPrev')?.addEventListener('click', () => goToSlide(tIndex - 1));
buildDots();
window.addEventListener('resize', () => { buildDots(); goToSlide(0); });

// Auto-play testimonials
let autoPlay = setInterval(() => goToSlide((tIndex + 1) % (cards.length - visibleCards() + 1)), 5000);
track?.addEventListener('mouseenter', () => clearInterval(autoPlay));
track?.addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => goToSlide((tIndex + 1) % (cards.length - visibleCards() + 1)), 5000);
});

// ── FAQ ──
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── TOAST ──
function showToast(title, msg, icon = '✅') {
  const toast = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  toast.classList.add('show');
  setTimeout(hideToast, 5000);
}
function hideToast() {
  document.getElementById('toast').classList.remove('show');
}

// ── FORM HANDLERS ──
function handleApptSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '⏳ Confirming...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✦ Confirm Appointment';
    btn.disabled = false;
    e.target.reset();
    showToast('Appointment Requested!', 'We\'ll confirm within 2 hours via email.', '📅');
  }, 1800);
  return false;
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✦ Send Message';
    btn.disabled = false;
    e.target.reset();
    showToast('Message Received!', 'Our team will respond within 24 hours.', '✉️');
  }, 1500);
  return false;
}

function handleNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if (!email || !email.includes('@')) return showToast('Invalid Email', 'Please enter a valid email address.', '⚠️');
  showToast('You\'re Subscribed!', 'Welcome to VitaCare Health Insights.', '📬');
  document.getElementById('newsletterEmail').value = '';
}

// ── SET MIN DATE ──
const dateInputs = document.querySelectorAll('input[type="date"]');
const today = new Date().toISOString().split('T')[0];
dateInputs.forEach(d => d.min = today);

// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--teal-light)' : '';
  });
});