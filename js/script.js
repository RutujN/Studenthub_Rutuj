/* ── DOM REFERENCES ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const THEME_KEY = 'studenthub-theme';

const greetingTitle = document.getElementById('greetingTitle');
const currentDate = document.getElementById('currentDate');
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const weatherBody = document.getElementById('weatherBody');
const quoteBody = document.getElementById('quoteBody');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const githubInput = document.getElementById('githubInput');
const githubFetchBtn = document.getElementById('githubFetchBtn');
const githubResult = document.getElementById('githubResult');
const feedbackName = document.getElementById('feedbackName');
const feedbackEmail = document.getElementById('feedbackEmail');
const feedbackMsg = document.getElementById('feedbackMsg');
const submitFeedback = document.getElementById('submitFeedback');
const formSuccess = document.getElementById('formSuccess');

/* ── HELPERS ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* ── HAMBURGER MENU ── */
hamburger?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.addEventListener('click', (event) => {
  if (event.target.tagName !== 'A') return;
  navLinks.classList.remove('open');
  hamburger?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
});

/* ── DARK MODE ── */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

initTheme();

/* ── DYNAMIC HERO DATE ── */
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  if (hour >= 17) greeting = 'Good evening';

  if (greetingTitle) greetingTitle.textContent = `${greeting}, Rohan`;
  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
}

setGreeting();

/* ── WAITLIST FORM ── */
const waitlistError = document.createElement('span');
waitlistError.style.cssText = 'display:block;color:#ff6b6b;font-size:0.78rem;margin-top:0.4rem;';
waitlistError.setAttribute('role', 'alert');
emailInput?.insertAdjacentElement('afterend', waitlistError);

waitlistForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput?.value.trim() || '';
  waitlistError.textContent = '';

  if (!email) {
    waitlistError.textContent = 'Please enter your email address.';
    emailInput?.focus();
    return;
  }

  if (!isValidEmail(email)) {
    waitlistError.textContent = 'Please enter a valid email (e.g. you@college.edu).';
    emailInput?.focus();
    return;
  }

  waitlistForm.innerHTML = `
    <p style="color: var(--amber-lt); font-weight: 600; font-size: 1rem;">
      ✅ You're on the list! We'll be in touch soon.
    </p>
  `;
});

emailInput?.addEventListener('input', () => {
  waitlistError.textContent = '';
});

/* ── WEATHER WIDGET ── */
const weatherCodes = {
  0: ['☀️', 'Clear sky'],
  1: ['🌤️', 'Mainly clear'],
  2: ['⛅', 'Partly cloudy'],
  3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Fog'],
  48: ['🌫️', 'Rime fog'],
  51: ['🌦️', 'Light drizzle'],
  53: ['🌦️', 'Drizzle'],
  55: ['🌧️', 'Dense drizzle'],
  61: ['🌧️', 'Slight rain'],
  63: ['🌧️', 'Rain'],
  65: ['🌧️', 'Heavy rain'],
  80: ['🌦️', 'Rain showers'],
  81: ['🌧️', 'Rain showers'],
  82: ['⛈️', 'Violent showers'],
  95: ['⛈️', 'Thunderstorm']
};

function renderWeather(data, label) {
  const current = data.current_weather;
  const [icon, condition] = weatherCodes[current.weathercode] || ['🌡️', 'Current weather'];

  weatherBody.innerHTML = `
    <div class="weather-display">
      <div class="weather-icon">${icon}</div>
      <div class="weather-temp">${Math.round(current.temperature)}°C</div>
      <div class="weather-cond">${condition} near ${escapeHTML(label)}</div>
      <div class="weather-wind">Wind ${Math.round(current.windspeed)} km/h</div>
    </div>
  `;
}

async function fetchWeather(latitude, longitude, label = 'your campus') {
  if (!weatherBody) return;
  weatherBody.innerHTML = '<div class="widget-loading">Loading weather...</div>';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    renderWeather(data, label);
  } catch {
    weatherBody.innerHTML = '<span class="field-error">Weather is unavailable right now.</span>';
  }
}

function initWeather() {
  if (!weatherBody) return;

  if (!navigator.geolocation) {
    fetchWeather(18.5204, 73.8567, 'Pune');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => fetchWeather(position.coords.latitude, position.coords.longitude, 'you'),
    () => fetchWeather(18.5204, 73.8567, 'Pune'),
    { timeout: 7000 }
  );
}

initWeather();

/* ── QUOTE WIDGET ── */
async function fetchQuote() {
  if (!quoteBody) return;
  quoteBody.textContent = 'Loading quote...';

  try {
    const response = await fetch('https://api.quotable.io/random?tags=education|inspirational');
    if (!response.ok) throw new Error('Quote request failed');
    const quote = await response.json();
    quoteBody.innerHTML = `
      <blockquote style="font-style:italic;color:var(--ink);margin-bottom:0.5rem;">"${escapeHTML(quote.content)}"</blockquote>
      <cite style="font-size:0.75rem;color:var(--muted);">— ${escapeHTML(quote.author)}</cite>
    `;
  } catch {
    quoteBody.innerHTML = `
      <blockquote style="font-style:italic;color:var(--ink);margin-bottom:0.5rem;">"The secret of getting ahead is getting started."</blockquote>
      <cite style="font-size:0.75rem;color:var(--muted);">— Mark Twain</cite>
    `;
  }
}

newQuoteBtn?.addEventListener('click', fetchQuote);
fetchQuote();

/* ── GITHUB PROFILE WIDGET ── */
async function fetchGitHub(username) {
  if (!githubResult) return;
  githubResult.innerHTML = '<span style="color:var(--muted);font-size:0.8rem;">Loading...</span>';

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('GitHub user not found');
    const user = await response.json();

    githubResult.innerHTML = `
      <div class="github-profile">
        <img src="${escapeHTML(user.avatar_url)}" alt="${escapeHTML(user.login)} avatar" />
        <div>
          <div class="gh-name"><a href="${escapeHTML(user.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(user.name || user.login)}</a></div>
          <div class="gh-bio">${escapeHTML(user.bio || 'No bio provided')}</div>
          <div class="gh-stats">📦 ${user.public_repos} repos · 👥 ${user.followers} followers</div>
        </div>
      </div>
    `;
  } catch {
    githubResult.innerHTML = '<span class="field-error">User not found. Check the username.</span>';
  }
}

githubFetchBtn?.addEventListener('click', () => {
  const username = githubInput?.value.trim();
  if (username) fetchGitHub(username);
});

githubInput?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const username = githubInput.value.trim();
  if (username) fetchGitHub(username);
});

if (githubInput) {
  githubInput.value = 'RutujN';
  fetchGitHub(githubInput.value);
}

/* ── FEEDBACK FORM ── */
function setFieldError(id, message) {
  const error = document.getElementById(id);
  if (error) error.textContent = message;
}

function clearFeedbackErrors() {
  setFieldError('nameError', '');
  setFieldError('emailError', '');
  setFieldError('msgError', '');
  if (formSuccess) formSuccess.textContent = '';
}

submitFeedback?.addEventListener('click', () => {
  clearFeedbackErrors();

  const name = feedbackName?.value.trim() || '';
  const email = feedbackEmail?.value.trim() || '';
  const message = feedbackMsg?.value.trim() || '';
  let isValid = true;

  if (name.length < 2) {
    setFieldError('nameError', 'Please enter your name.');
    isValid = false;
  }

  if (!isValidEmail(email)) {
    setFieldError('emailError', 'Please enter a valid email address.');
    isValid = false;
  }

  if (message.length < 10) {
    setFieldError('msgError', 'Please write at least 10 characters.');
    isValid = false;
  }

  if (!isValid) return;

  if (formSuccess) formSuccess.textContent = 'Thanks! Your feedback has been recorded locally.';
  feedbackName.value = '';
  feedbackEmail.value = '';
  feedbackMsg.value = '';
});

[feedbackName, feedbackEmail, feedbackMsg].forEach((field) => {
  field?.addEventListener('input', clearFeedbackErrors);
});
