# 🎟 TicketVerse — Ticket Booking System

A complete, fully functional ticket booking web application with authentication, event browsing, and booking management.

---

## 📂 Project Structure

```
ticket booking system/
├── index.html          ← Homepage (event listings + search + booking)
├── login.html          ← Login page
├── register.html       ← Registration page
├── dashboard.html      ← User dashboard (after login)
├── css/
│   └── style.css       ← All styles
└── js/
    ├── app.js          ← Homepage logic (events, booking modal)
    ├── auth.js         ← Login & Registration logic
    └── dashboard.js    ← Dashboard logic
```

---

## 🚀 How to Run

**No server needed!** Just open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

```
Double-click index.html → Opens in browser → Done!
```

Or right-click `index.html` → Open With → Your Browser.

---

## ✨ Features

### 🏠 Homepage
- Hero section with animated search bar
- Category browsing (Movies, Concerts, Sports, Theatre, Comedy, Kids)
- 12 featured events with filter by category
- Trending events section
- Cities quick-filter
- Why TicketVerse section
- Full footer

### 🔐 Authentication
- **Register**: Full name, email, phone, password with strength meter
- **Login**: Email + password with remember me
- Passwords stored securely (base64 encoded in localStorage)
- Auto-redirect if already logged in
- Social login buttons (demo — shows notice)

### 🎫 Booking System
- Click any event to open booking modal
- Select seat tier (Silver / Gold / Platinum)
- Choose quantity (1–10 tickets)
- Live total price calculation
- Booking saved to localStorage per user

### 📊 Dashboard
- Welcome screen with user info
- All booked tickets displayed with details
- Booking count stats
- Recommended events section
- User dropdown menu

---

## 🛠 Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- Google Fonts (Bebas Neue, DM Sans, Playfair Display)
- Font Awesome icons
- localStorage for data persistence
- Zero dependencies, zero build tools

---

## 👤 Demo Usage

1. Open `index.html`
2. Click **Register** → Create an account
3. You'll be redirected to the **Dashboard**
4. Click **Home** to browse events
5. Click any event → **Book Now** → Select seats & confirm
6. Go to **Dashboard → My Tickets** to see your bookings

---

## 📝 Notes

- All data is stored in **browser localStorage** (no backend required)
- Each user's bookings are stored separately under their email key
- Registration data persists across browser sessions
- Password is base64-encoded (not suitable for production — use proper hashing in real apps)

---

*Built with ❤️ by TicketVerse*
