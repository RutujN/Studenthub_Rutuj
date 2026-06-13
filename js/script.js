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

// ── QUOTE GENERATOR (Fetch API + Async/Await) ──
async function fetchQuote() {
  const quoteBody = document.getElementById('quoteBody');
  if (!quoteBody) return;
  quoteBody.textContent = 'Loading…';
  try {
    const res  = await fetch('https://quotesapi.prayushadhikari.com.np/api/quotes?order=random&limit=1');
    const data = await res.json();
    const q    = data.data[0];
    quoteBody.innerHTML = `
      <blockquote style="font-style:italic; color:var(--ink); margin-bottom:0.5rem;">"${q.quote}"</blockquote>
      <cite style="font-size:0.75rem; color:var(--muted);">— ${q.author}</cite>
    `;
  } catch {
    quoteBody.innerHTML = '<em>"The secret of getting ahead is getting started."</em><br><cite style="font-size:0.75rem;color:var(--muted);">— Mark Twain</cite>';
  }
}
document.getElementById('newQuoteBtn')?.addEventListener('click', fetchQuote);
fetchQuote();

// ── GITHUB PROFILE FETCHER (Fetch API + Async/Await) ──
async function fetchGitHub(username) {
  const result = document.getElementById('githubResult');
  if (!result) return;
  result.innerHTML = '<span style="color:var(--muted);font-size:0.8rem;">Loading…</span>';
  try {
    const res  = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    result.innerHTML = `
      <div class="github-profile">
        <img src="${data.avatar_url}" alt="${data.login} avatar" />
        <div>
          <div class="gh-name"><a href="${data.html_url}" target="_blank" rel="noopener">${data.name ?? data.login}</a></div>
          <div class="gh-bio">${data.bio ?? 'No bio provided'}</div>
          <div style="font-size:0.72rem;color:var(--muted);margin-top:0.2rem;">📦 ${data.public_repos} repos · 👥 ${data.followers} followers</div>
        </div>
      </div>
    `;
  } catch {
    result.innerHTML = '<span style="color:#D94040;font-size:0.8rem;">User not found. Check the username.</span>';
  }
}
document.getElementById('githubFetchBtn')?.addEventListener('click', () => {
  const val = document.getElementById('githubInput')?.value.trim();
  if (val) fetchGitHub(val);
});
document.getElementById('githubInput')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) fetchGitHub(val);
  }
});
// Pre-fill your own username
const ghInput = document.getElementById('githubInput');
if (ghInput) ghInput.value = 'RutujN';