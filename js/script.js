/* ================================================================
   DE BOER RESTAURANT — GRAND INNA MEDAN
   script.js — Logika aplikasi (filter, search, popup, navbar, dll)

   Catatan migrasi:
   Data menu (sebelumnya array `menuData` inline di HTML, lengkap
   dengan gambar base64) sekarang dimuat secara asinkron dari
   data/menu.json agar struktur proyek lebih rapi dan mudah dikelola.
   Seluruh logika render, filter, pencarian, dan popup di bawah ini
   TIDAK diubah sama sekali dari versi asli — hanya dipindahkan.
================================================================ */

let menuData = [];

/* ================================================================
   LOAD DATA MENU DARI data/menu.json
================================================================ */
async function loadMenuData() {
  try {
    const res = await fetch('data/menu.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    menuData = await res.json();
  } catch (err) {
    console.error('Gagal memuat data/menu.json:', err);
    const grid = document.getElementById('menuGrid');
    if (grid) {
      grid.innerHTML = `<div class="no-result"><span>⚠️</span>Gagal memuat data menu.<br>Periksa koneksi atau coba muat ulang halaman.</div>`;
    }
  }
}

/* ================================================================
   KATEGORI & FILTER
================================================================ */
const categories = [
  "All",
  "Signature",
  "Delight & Bites",
  "Appetizer",
  "Soup",
  "Main Course",
  "Favorite Rice",
  "Noodles",
  "Vegetables",
  "Dessert",
  "Coffee",
  "Tea",
  "Fresh Juice",
  "Healthy Juice",
  "Drinks"
];

let activeCategory = "All";

/* ================================================================
   RENDER FILTERS
================================================================ */
function renderFilters() {
  const wrap = document.getElementById('filters');
  wrap.innerHTML = categories.map(cat =>
    `<button class="filter-btn ${cat === activeCategory ? 'active' : ''}"
      onclick="setCategory('${cat.replace(/'/g, "\\'")}')"
      aria-pressed="${cat === activeCategory}">${cat}</button>`
  ).join('');
}

function setCategory(cat) {
  activeCategory = cat;
  renderFilters();
  renderMenu();
}

/* ================================================================
   BADGE HELPERS
================================================================ */
function badgeLabel(key) {
  const labels = {
    best: "Best Seller",
    chef: "Chef Recommendation",
    new: "New",
    spicy: "🌶 Spicy",
    veg: "🥦 Vegetarian"
  };
  return labels[key] || key;
}

/* ================================================================
   RENDER MENU CARDS
================================================================ */
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const countEl = document.getElementById('menuCount');
  const term = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = menuData.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = !term ||
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term);
    return matchCat && matchSearch && item.available;
  });

  // Update count
  countEl.innerHTML = term || activeCategory !== "All"
    ? `Menampilkan <span>${filtered.length}</span> dari ${menuData.length} menu`
    : `Total <span>${filtered.length}</span> pilihan menu`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-result"><span>🍽️</span>Menu tidak ditemukan.<br>Coba kata kunci lain.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const badges = (item.badge || []).map(b =>
      `<span class="badge ${b}">${badgeLabel(b)}</span>`
    ).join('');

    return `
      <article class="menu-card" onclick="openPopup(${item.id})" role="listitem"
        tabindex="0" onkeydown="if(event.key==='Enter')openPopup(${item.id})"
        aria-label="${item.name} - ${item.price}">
        <div class="card-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'">
          <div class="badges">${badges}</div>
        </div>
        <div class="card-body">
          <span class="card-cat">${item.category}</span>
          <div class="card-head">
            <h3>${item.name}</h3>
            <span class="card-price">${item.price}</span>
          </div>
          <p class="card-desc">${item.description}</p>
          <div class="card-cta">Lihat Detail</div>
        </div>
      </article>`;
  }).join('');
}

/* ================================================================
   POPUP DETAIL
================================================================ */
function openPopup(id) {
  const item = menuData.find(m => m.id === id);
  if (!item) return;

  document.getElementById('popupImg').src = item.image;
  document.getElementById('popupImg').alt = item.name;
  document.getElementById('popupCat').textContent = item.category;
  document.getElementById('popupName').textContent = item.name;
  document.getElementById('popupPrice').textContent = item.price;
  document.getElementById('popupDesc').textContent = item.description;
  document.getElementById('popupBadges').innerHTML = (item.badge || []).map(b =>
    `<span class="badge ${b}">${badgeLabel(b)}</span>`
  ).join('');

  const overlay = document.getElementById('popupOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopupDirect() {
  document.getElementById('popupOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closePopup(e) {
  if (e.target === document.getElementById('popupOverlay')) closePopupDirect();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopupDirect();
});

/* ================================================================
   NAVBAR SCROLL
================================================================ */
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  topBtn.classList.toggle('show', window.scrollY > 400);
});

/* ================================================================
   MOBILE MENU
================================================================ */
function toggleMenu() { document.getElementById('navLinks').classList.toggle('open'); }
function closeMenu() { document.getElementById('navLinks').classList.remove('open'); }

/* ================================================================
   BACK TO TOP
================================================================ */
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* ================================================================
   REVEAL ON SCROLL
================================================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ================================================================
   INIT
================================================================ */
(async function init() {
  renderFilters();
  await loadMenuData();
  renderMenu();
})();
