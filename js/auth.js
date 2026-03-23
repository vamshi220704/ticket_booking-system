/* =========================================
   TICKETVERSE — AUTH JS
   ========================================= */

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

function togglePass(fieldId, btn) {
  const input = document.getElementById(fieldId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fa fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fa fa-eye"></i>';
  }
}

// =================== LOGIN ===================
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');

  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  btn.classList.add('loading');
  btn.querySelector('span').textContent = 'Signing in...';

  setTimeout(() => {
    // Check if user exists in localStorage
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      showToast('No account found. Please register first.', 'error');
      btn.classList.remove('loading');
      btn.querySelector('span').textContent = 'Sign In';
      return;
    }

    if (user.password !== btoa(password)) {
      showToast('Incorrect password. Please try again.', 'error');
      btn.classList.remove('loading');
      btn.querySelector('span').textContent = 'Sign In';
      return;
    }

    // Login success
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem('tv_user', JSON.stringify(sessionUser));

    showToast('Welcome back, ' + (user.firstName || user.name) + '! 🎉', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
  }, 1000);
}

// =================== REGISTER ===================
function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('confirmPassword').value;
  const agree = document.getElementById('agreeTerms').checked;
  const btn = document.getElementById('registerBtn');

  if (!firstName || !lastName || !email || !phone || !password || !confirm) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  if (!agree) {
    showToast('Please agree to terms to continue', 'error');
    return;
  }
  if (password.length < 8) {
    showToast('Password must be at least 8 characters', 'error');
    return;
  }
  if (password !== confirm) {
    showToast('Passwords do not match', 'error');
    return;
  }
  if (!validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  btn.classList.add('loading');
  btn.querySelector('span').textContent = 'Creating account...';

  setTimeout(() => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      showToast('An account with this email already exists', 'error');
      btn.classList.remove('loading');
      btn.querySelector('span').textContent = 'Create Free Account';
      return;
    }

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      name: firstName + ' ' + lastName,
      email,
      phone,
      password: btoa(password), // basic encoding
      createdAt: new Date().toLocaleDateString(),
      newsletter: document.getElementById('newsletter').checked
    };

    users.push(newUser);
    localStorage.setItem('tv_users', JSON.stringify(users));

    // Auto-login
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem('tv_user', JSON.stringify(sessionUser));

    showToast('Account created! Welcome to TicketVerse! 🎉', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
  }, 1200);
}

// =================== SOCIAL LOGIN ===================
function socialLogin(provider) {
  showToast(`${provider} login is not configured in demo mode`, 'error');
}

// =================== PASSWORD STRENGTH ===================
function checkStrength(password) {
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { pct: 0, color: 'transparent', text: '' },
    { pct: 20, color: '#e0362c', text: 'Very Weak' },
    { pct: 40, color: '#ff7043', text: 'Weak' },
    { pct: 60, color: '#ffc107', text: 'Fair' },
    { pct: 80, color: '#4caf50', text: 'Strong' },
    { pct: 100, color: '#00bcd4', text: 'Very Strong 💪' }
  ];

  const level = levels[Math.min(score, 5)];
  fill.style.width = level.pct + '%';
  fill.style.background = level.color;
  label.textContent = level.text;
  label.style.color = level.color;
}

// =================== FORGOT PASSWORD ===================
function forgotPassword() {
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showToast('Enter your email above first, then click Forgot Password', 'error');
    return;
  }
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    showToast('No account found with this email', 'error');
    return;
  }
  showToast('Password reset link sent to ' + email + ' (demo mode)', 'success');
}

// =================== TERMS ===================
function showTerms() {
  alert('Terms of Service\n\n1. You agree to use TicketVerse responsibly.\n2. Tickets are non-transferable.\n3. Refunds subject to event policy.\n4. We protect your data securely.\n\nFull terms at ticketverse.in/terms');
}

// =================== HELPERS ===================
function getUsers() {
  try { return JSON.parse(localStorage.getItem('tv_users')) || []; } catch { return []; }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('tv_user') || 'null');
  const path = window.location.pathname;
  if (user && (path.includes('login.html') || path.includes('register.html'))) {
    window.location.href = 'dashboard.html';
  }
});
