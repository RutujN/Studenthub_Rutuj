// Mobile Navigation Toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Dark Mode Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.documentElement;

themeToggle.addEventListener('click', () => {
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  }
});

// Dynamic greeting and date in hero card
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