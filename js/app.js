/* =========================================
   TICKETVERSE — MAIN APP JS
   ========================================= */

const EVENTS = [
  { id:1, title:'Kalki 3.0', category:'movies', emoji:'🎬', date:'Mar 28, 2026', time:'6:30 PM', venue:'PVR Cinemas, Hyderabad', price:250, hotSale:true, color:'#1a1a2e' },
  { id:2, title:'Arijit Singh Live', category:'concerts', emoji:'🎵', date:'Apr 5, 2026', time:'7:00 PM', venue:'HCU Ground, Hyderabad', price:1500, hotSale:true, color:'#1a0a2e' },
  { id:3, title:'RCB vs MI — IPL 2026', category:'sports', emoji:'⚽', date:'Apr 14, 2026', time:'3:30 PM', venue:'M. Chinnaswamy Stadium', price:800, hotSale:false, color:'#0a2e0a' },
  { id:4, title:'The Dark Knight Returns', category:'theatre', emoji:'🎭', date:'Apr 10, 2026', time:'5:00 PM', venue:'Ravindra Bharathi, Hyd', price:400, hotSale:false, color:'#2e0a0a' },
  { id:5, title:'Zakir Khan Stand-Up', category:'comedy', emoji:'😂', date:'Apr 18, 2026', time:'8:00 PM', venue:'Shilpakala Vedika', price:600, hotSale:true, color:'#2e2a0a' },
  { id:6, title:'Disney On Ice', category:'kids', emoji:'🎪', date:'Apr 20, 2026', time:'4:00 PM', venue:'HICC, Hyderabad', price:700, hotSale:false, color:'#0a2e2e' },
  { id:7, title:'Dune: Awakening', category:'movies', emoji:'🎬', date:'May 2, 2026', time:'9:00 PM', venue:'INOX, Banjara Hills', price:300, hotSale:false, color:'#1a1a2e' },
  { id:8, title:'Coldplay World Tour', category:'concerts', emoji:'🎵', date:'May 10, 2026', time:'6:30 PM', venue:'DY Patil Stadium, Mumbai', price:5000, hotSale:true, color:'#1a0a2e' },
  { id:9, title:'India vs Australia T20', category:'sports', emoji:'🏏', date:'May 15, 2026', time:'7:00 PM', venue:'Uppal Stadium, Hyderabad', price:1200, hotSale:false, color:'#0a2e0a' },
  { id:10, title:'Hamlet — Live', category:'theatre', emoji:'🎭', date:'May 8, 2026', time:'5:30 PM', venue:'Ranga Shankara, Bangalore', price:350, hotSale:false, color:'#2e0a0a' },
  { id:11, title:'Kapil Sharma Live', category:'comedy', emoji:'😂', date:'May 22, 2026', time:'7:30 PM', venue:'NSCI Dome, Mumbai', price:900, hotSale:true, color:'#2e2a0a' },
  { id:12, title:'Avatar in Concert', category:'concerts', emoji:'🎵', date:'Jun 1, 2026', time:'6:00 PM', venue:'HICC, Hyderabad', price:2000, hotSale:false, color:'#0a152e' },
];

const TRENDING = [
  { name:'Coldplay World Tour', detail:'Concerts • Mumbai • May 10', price:'₹5,000', emoji:'🎵' },
  { name:'India vs Australia T20', detail:'Sports • Hyderabad • May 15', price:'₹1,200', emoji:'🏏' },
  { name:'Arijit Singh Live', detail:'Concerts • Hyderabad • Apr 5', price:'₹1,500', emoji:'🎵' },
  { name:'Kalki 3.0', detail:'Movies • IMAX • Hyderabad', price:'₹250', emoji:'🎬' },
  { name:'Zakir Khan Stand-Up', detail:'Comedy • Shilpakala • Apr 18', price:'₹600', emoji:'😂' },
];

let currentFilter = 'all';
let bookingQty = 1;
let currentEvent = null;
let currentSeatTier = 'Gold';

// =================== RENDER ===================
function renderEvents(filter) {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.category === filter);
  grid.innerHTML = filtered.map((ev, i) => `
    <div class="event-card" style="animation-delay:${i * 0.05}s" onclick="openBooking(${ev.id})">
      <div class="event-thumb" style="background:${ev.color}">
        ${ev.emoji}
        <div class="event-badge badge-${ev.category}">${ev.category.charAt(0).toUpperCase()+ev.category.slice(1)}</div>
        ${ev.hotSale ? '<div class="event-hot-badge">🔥 HOT</div>' : ''}
      </div>
      <div class="event-info">
        <div class="event-title">${ev.title}</div>
        <div class="event-meta">
          <span>📅 ${ev.date}</span>
          <span>🕐 ${ev.time}</span>
        </div>
        <div class="event-meta">
          <span>📍 ${ev.venue}</span>
        </div>
        <div class="event-footer">
          <div class="event-price">₹${ev.price.toLocaleString()}</div>
          <button class="event-book" onclick="event.stopPropagation();openBooking(${ev.id})">Book Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderTrending() {
  const list = document.getElementById('trendingList');
  if (!list) return;
  list.innerHTML = TRENDING.map((t, i) => `
    <div class="trending-item" onclick="showToast('Searching for ${t.name}...')">
      <div class="trending-rank ${i < 3 ? 'top' : ''}">${i+1}</div>
      <div class="trending-emoji">${t.emoji}</div>
      <div class="trending-info">
        <div class="trending-name">${t.name}</div>
        <div class="trending-detail">${t.detail}</div>
      </div>
      <div class="trending-price">${t.price}</div>
      <div class="trending-arrow">›</div>
    </div>
  `).join('');
}

// =================== FILTER ===================
function filterEvents(cat, btn) {
  currentFilter = cat;
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderEvents(cat);
}

// =================== BOOKING MODAL ===================
function openBooking(id) {
  const user = getUser();
  if (!user) {
    showToast('Please login to book tickets!', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }
  currentEvent = EVENTS.find(e => e.id === id);
  bookingQty = 1;
  currentSeatTier = 'Gold';
  const modal = document.getElementById('bookingModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;
  updateModalContent(content);
  modal.classList.add('active');
}

function updateModalContent(content) {
  const ev = currentEvent;
  const total = ev.price * bookingQty;
  content.innerHTML = `
    <div class="modal-event-thumb">${ev.emoji}</div>
    <div class="modal-title">${ev.title}</div>
    <div class="modal-meta">
      <span>📅 ${ev.date}</span>
      <span>🕐 ${ev.time}</span>
      <span>📍 ${ev.venue}</span>
    </div>
    <div class="modal-price">₹${ev.price.toLocaleString()} <span style="font-size:0.85rem;color:var(--text2);font-weight:400">per ticket</span></div>
    <div class="seat-selector">
      <label>Select Seat Tier</label>
      <select id="seatTier" onchange="changeTier(this.value)">
        <option value="Gold">Gold — ₹${ev.price.toLocaleString()}</option>
        <option value="Silver">Silver — ₹${Math.round(ev.price * 0.75).toLocaleString()}</option>
        <option value="Platinum">Platinum — ₹${Math.round(ev.price * 1.5).toLocaleString()}</option>
      </select>
    </div>
    <div class="qty-selector">
      <label>Tickets:</label>
      <button class="qty-btn" onclick="changeQty(-1)">−</button>
      <span class="qty-num" id="qtyNum">1</span>
      <button class="qty-btn" onclick="changeQty(1)">+</button>
    </div>
    <div class="modal-total">Total: <strong id="totalPrice">₹${total.toLocaleString()}</strong></div>
    <button class="btn-confirm" onclick="confirmBooking()">Confirm Booking 🎉</button>
  `;
}

function changeTier(tier) {
  currentSeatTier = tier;
  const multiplier = tier === 'Silver' ? 0.75 : tier === 'Platinum' ? 1.5 : 1;
  const price = Math.round(currentEvent.price * multiplier);
  const total = price * bookingQty;
  const el = document.getElementById('totalPrice');
  if (el) el.textContent = '₹' + total.toLocaleString();
}

function changeQty(delta) {
  bookingQty = Math.max(1, Math.min(10, bookingQty + delta));
  document.getElementById('qtyNum').textContent = bookingQty;
  const select = document.getElementById('seatTier');
  const tier = select ? select.value : 'Gold';
  const multiplier = tier === 'Silver' ? 0.75 : tier === 'Platinum' ? 1.5 : 1;
  const price = Math.round(currentEvent.price * multiplier);
  document.getElementById('totalPrice').textContent = '₹' + (price * bookingQty).toLocaleString();
}

function confirmBooking() {
  const user = getUser();
  if (!user) return;
  const select = document.getElementById('seatTier');
  const tier = select ? select.value : 'Gold';
  const multiplier = tier === 'Silver' ? 0.75 : tier === 'Platinum' ? 1.5 : 1;
  const price = Math.round(currentEvent.price * multiplier);
  const total = price * bookingQty;

  const booking = {
    id: Date.now(),
    eventId: currentEvent.id,
    title: currentEvent.title,
    emoji: currentEvent.emoji,
    date: currentEvent.date,
    time: currentEvent.time,
    venue: currentEvent.venue,
    qty: bookingQty,
    tier: tier,
    total: total,
    bookedAt: new Date().toLocaleDateString()
  };

  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('tv_bookings_' + user.email, JSON.stringify(bookings));

  closeModal();
  showToast(`🎉 Booking confirmed! ${bookingQty} ticket(s) for ${currentEvent.title}`, 'success');
}

function closeModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('active');
}

// =================== UTILS ===================
function heroSearchAction() {
  const q = document.getElementById('heroSearch').value.trim();
  if (!q) return;
  const found = EVENTS.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));
  const grid = document.getElementById('eventsGrid');
  if (found.length === 0) {
    showToast('No events found for "' + q + '"', 'error');
  } else {
    document.getElementById('eventsGrid').scrollIntoView({ behavior: 'smooth' });
    renderEventsFromArray(found);
    showToast(`Found ${found.length} event(s) for "${q}"`);
  }
}

function renderEventsFromArray(arr) {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  grid.innerHTML = arr.map((ev, i) => `
    <div class="event-card" style="animation-delay:${i * 0.05}s" onclick="openBooking(${ev.id})">
      <div class="event-thumb" style="background:${ev.color}">
        ${ev.emoji}
        <div class="event-badge badge-${ev.category}">${ev.category.charAt(0).toUpperCase()+ev.category.slice(1)}</div>
        ${ev.hotSale ? '<div class="event-hot-badge">🔥 HOT</div>' : ''}
      </div>
      <div class="event-info">
        <div class="event-title">${ev.title}</div>
        <div class="event-meta"><span>📅 ${ev.date}</span><span>🕐 ${ev.time}</span></div>
        <div class="event-meta"><span>📍 ${ev.venue}</span></div>
        <div class="event-footer">
          <div class="event-price">₹${ev.price.toLocaleString()}</div>
          <button class="event-book" onclick="event.stopPropagation();openBooking(${ev.id})">Book Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

// =================== AUTH HELPERS ===================
function getUser() {
  try { return JSON.parse(localStorage.getItem('tv_user')); } catch { return null; }
}
function getBookings() {
  const user = getUser();
  if (!user) return [];
  try { return JSON.parse(localStorage.getItem('tv_bookings_' + user.email)) || []; } catch { return []; }
}

// =================== NAV ACTIONS (LOGGED IN) ===================
function updateNavForUser() {
  const user = getUser();
  const actions = document.getElementById('navActions');
  if (actions && user) {
    const initial = (user.firstName || user.name || 'U').charAt(0).toUpperCase();
    actions.innerHTML = `
      <span style="font-size:0.88rem;color:var(--text2)">Hi, ${user.firstName || user.name}</span>
      <div class="user-menu" id="navUserMenu">
        <div class="user-avatar" onclick="toggleNavDropdown()">${initial}</div>
        <div class="user-dropdown" id="navDropdown">
          <div class="dropdown-header">
            <div class="user-avatar-lg">${initial}</div>
            <div>
              <div class="dropdown-name">${user.firstName || user.name}</div>
              <div class="dropdown-email">${user.email}</div>
            </div>
          </div>
          <a href="dashboard.html" class="dropdown-item"><i class="fa fa-th-large"></i> Dashboard</a>
          <a href="dashboard.html#mytickets" class="dropdown-item"><i class="fa fa-ticket"></i> My Tickets</a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item logout-item" onclick="logout()"><i class="fa fa-sign-out-alt"></i> Logout</a>
        </div>
      </div>
    `;
  }
}

function toggleNavDropdown() {
  document.getElementById('navDropdown').classList.toggle('open');
}

function logout() {
  localStorage.removeItem('tv_user');
  showToast('Logged out successfully');
  setTimeout(() => { window.location.href = 'index.html'; }, 800);
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('navUserMenu');
  if (menu && !menu.contains(e.target)) {
    const dd = document.getElementById('navDropdown');
    if (dd) dd.classList.remove('open');
  }
});

// =================== INIT ===================
document.addEventListener('DOMContentLoaded', () => {
  renderEvents('all');
  renderTrending();
  updateNavForUser();

  // Close modal on overlay click
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Enter key on search
  const hs = document.getElementById('heroSearch');
  if (hs) hs.addEventListener('keydown', (e) => { if (e.key === 'Enter') heroSearchAction(); });
});
