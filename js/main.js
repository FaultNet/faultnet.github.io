const signupForm = document.getElementById('signupForm');
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + d.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
function getCookie(name) {
  const v = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
  return v ? v[1] : null;
}
function showSignedUp() {
  const sec = document.querySelector('.signup-section');
  if (!sec) return;
  sec.innerHTML = '<h2>Join Early Access</h2>' +
    '<p>Thanks! We\'ve received your sign-up and we\'ll be in touch as soon as the beta opens so you can get involved.</p>' +
    '<p><a href="about.html">Learn more →</a></p>';
}
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const action = form.action;
    const formData = new FormData(form);

    fetch(action, {
      method: form.method || 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        setCookie('signed-up', '1', 365);
        showSignedUp();
      } else {
        alert('Sorry — there was a problem submitting the form.');
      }
    }).catch(() => {
      alert('Network error. Please try again later.');
    });
  });
}
if (getCookie('signed-up')) showSignedUp();
try {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    const now = new Date();
    yearEl.textContent = now.getFullYear();
  }
} catch (err) {
  
}

(function() {
  const THEME_KEY = 'faultnet_theme';
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateButtons(theme);
  }

  function updateButtons(theme) {
    const btn = document.getElementById('themeToggle');
    const btnA = document.getElementById('themeToggleAbout');
    [btn, btnA].forEach(b => {
      if (!b) return;
      b.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      b.dataset.theme = theme === 'dark' ? 'dark' : 'light';
      b.setAttribute('title', theme === 'dark' ? 'Dark mode' : 'Light mode');
    });
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  function bindThemeControls() {
    initTheme();
    const btn = document.getElementById('themeToggle');
    const btnA = document.getElementById('themeToggleAbout');
    if (btn) btn.addEventListener('click', toggleTheme);
    if (btnA) btnA.addEventListener('click', toggleTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindThemeControls);
  } else {
    bindThemeControls();
  }
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered:', reg);
      reg.addEventListener('updatefound', () => console.log('ServiceWorker update found'));
      navigator.serviceWorker.addEventListener('controllerchange', () => console.log('ServiceWorker controller changed'));
    } catch (err) {
      console.error('ServiceWorker registration failed:', err);
    }
  });
}
