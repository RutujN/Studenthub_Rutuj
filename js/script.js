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