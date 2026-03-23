/* =========================================
   TICKETVERSE — DASHBOARD JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('tv_user') || 'null');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Set user info
  const initial = (user.firstName || user.name || 'U').charAt(0).toUpperCase();
  const name = user.firstName || user.name || 'User';

  document.getElementById('welcomeName').textContent = name;
  document.getElementById('userAvatar').textContent = initial;
  document.getElementById('userAvatarLg').textContent = initial;
  document.getElementById('dropdownName').textContent = name;
  document.getElementById('dropdownEmail').textContent = user.email;

  // Toggle dropdown
  document.getElementById('userAvatar').addEventListener('click', () => {
    document.getElementById('userDropdown').classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    const menu = document.querySelector('.user-menu');
    if (menu && !menu.contains(e.target)) {
      document.getElementById('userDropdown').classList.remove('open');
    }
  });

  // Load bookings
  loadMyTickets(user);

  // Recommendations
  renderRecommendations();
});

function loadMyTickets(user) {
  const bookings = JSON.parse(localStorage.getItem('tv_bookings_' + user.email) || '[]');
  const list = document.getElementById('myTicketsList');
  const totalEl = document.getElementById('totalBookings');

  if (totalEl) totalEl.textContent = bookings.length;

  if (!bookings.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎟</div>
        <h3>No tickets yet!</h3>
        <p>Head to the homepage and book your first experience.</p>
        <a href="index.html" class="btn-primary" style="display:inline-block;margin-top:12px">Browse Events</a>
      </div>
    `;
    return;
  }

  list.innerHTML = bookings.reverse().map(b => `
    <div class="booked-ticket">
      <div class="booked-emoji">${b.emoji}</div>
      <div class="booked-info">
        <div class="booked-title">${b.title}</div>
        <div class="booked-detail">📅 ${b.date} &nbsp;•&nbsp; 🕐 ${b.time} &nbsp;•&nbsp; 📍 ${b.venue}</div>
        <div class="booked-detail">🎫 ${b.qty} ticket(s) &nbsp;•&nbsp; Seat: ${b.tier} &nbsp;•&nbsp; Booked: ${b.bookedAt}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <span class="booked-status">✓ Confirmed</span>
        <span class="booked-price">₹${b.total.toLocaleString()}</span>
      </div>
    </div>
  `).join('');
}

function renderRecommendations() {
  const grid = document.getElementById('recGrid');
  if (!grid) return;
  const picks = [
    { title:'Arijit Singh Live', emoji:'🎵', date:'Apr 5, 2026', price:'₹1,500', color:'#1a0a2e' },
    { title:'RCB vs MI', emoji:'⚽', date:'Apr 14, 2026', price:'₹800', color:'#0a2e0a' },
    { title:'Zakir Khan Stand-Up', emoji:'😂', date:'Apr 18, 2026', price:'₹600', color:'#2e2a0a' },
    { title:'Disney On Ice', emoji:'🎪', date:'Apr 20, 2026', price:'₹700', color:'#0a2e2e' },
  ];
  grid.innerHTML = picks.map(p => `
    <div class="event-card" onclick="window.location.href='index.html'">
      <div class="event-thumb" style="background:${p.color};height:120px">${p.emoji}</div>
      <div class="event-info">
        <div class="event-title" style="font-size:0.9rem">${p.title}</div>
        <div class="event-meta"><span>📅 ${p.date}</span></div>
        <div class="event-footer">
          <div class="event-price">${p.price}</div>
          <button class="event-book" style="font-size:0.75rem;padding:5px 12px">Book</button>
        </div>
      </div>
    </div>
  `).join('');
}

function logout() {
  localStorage.removeItem('tv_user');
  window.location.href = 'index.html';
}
