// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── DARK MODE with localStorage persistence ──
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const THEME_KEY = 'studenthub-theme';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Load saved theme OR respect system preference
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// ── DYNAMIC GREETING AND DATE ──
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const greetEl = document.getElementById('greetingTitle');
  if (greetEl) greetEl.textContent = `${greeting}, Rohan`;

  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
setGreeting();

// ── WAITLIST FORM VALIDATION ──
const waitlistForm = document.getElementById('waitlistForm');
const emailInput   = document.getElementById('emailInput');

// Add error element dynamically
const emailError = document.createElement('span');
emailError.style.cssText = 'display:block; color:#ff6b6b; font-size:0.78rem; margin-top:0.4rem;';
emailError.setAttribute('role', 'alert');
emailInput?.parentNode?.insertBefore(emailError, emailInput.nextSibling);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

waitlistForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = emailInput?.value.trim();
  emailError.textContent = '';

  if (!val) {
    emailError.textContent = 'Please enter your email address.';
    emailInput?.focus();
    return;
  }
  if (!isValidEmail(val)) {
    emailError.textContent = 'Please enter a valid email (e.g. you@college.edu).';
    emailInput?.focus();
    return;
  }

  // Success state
  waitlistForm.innerHTML = `
    <p style="color: var(--amber-lt); font-weight: 600; font-size: 1rem;">
      ✅ You're on the list! We'll be in touch soon.
    </p>
  `;
});

// Clear error on typing
emailInput?.addEventListener('input', () => {
  emailError.textContent = '';
});