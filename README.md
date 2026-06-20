# De Boer Restaurant — Grand Inna Medan | Digital Menu

Website menu digital untuk De Boer Restaurant, Hotel Grand Inna Medan.
Tampilan, warna, layout, animasi, dan seluruh fungsi (filter, pencarian,
popup detail, navigasi, dark theme, dsb) **100% identik** dengan versi
asli — proyek ini hanya merapikan struktur file agar mudah dikelola dan
siap dipublikasikan lewat GitHub Pages.

## 🗂️ Struktur Folder

```
.
├── index.html              # Halaman utama (markup HTML murni)
├── css/
│   └── style.css           # Seluruh styling (tema gelap + gold)
├── js/
│   └── script.js           # Seluruh logika: filter, search, popup, navbar, scroll-reveal
├── data/
│   └── menu.json           # Seluruh data menu (99 item) — sumber data card menu
├── images/
│   ├── menu/                # 51 foto menu (di-ekstrak dari base64 asli, format JPG)
│   └── gallery/              # (kosong — lihat catatan Gallery di bawah)
├── assets/
│   ├── fonts/                # (kosong — situs ini memakai Google Fonts via CDN)
│   └── videos/                # (kosong — situs ini tidak memakai video)
├── .gitignore
└── README.md
```

## ▶️ Cara Menjalankan

Karena `index.html` memuat data menu secara asinkron lewat
`fetch('data/menu.json')`, file **tidak bisa** dibuka langsung dengan
double-click (`file://`) di sebagian browser — gunakan local server
ringan:

```bash
# Opsi 1: Python (sudah terpasang di banyak sistem)
python3 -m http.server 8000

# Opsi 2: Node.js
npx serve .

# Opsi 3: VS Code
# Install ekstensi "Live Server", klik kanan index.html → "Open with Live Server"
```

Lalu buka `http://localhost:8000` di browser.

## 🌐 Publikasi ke GitHub Pages

1. Push folder ini ke repository GitHub.
2. Masuk ke **Settings → Pages**.
3. Pilih branch `main` (atau `master`) dan folder `/ (root)`.
4. Simpan — situs akan tersedia di `https://<username>.github.io/<repo>/`.

Tidak ada konfigurasi build/tooling tambahan yang diperlukan; ini adalah
static site murni (HTML + CSS + JS + JSON).

## 📋 Catatan Migrasi dari File Tunggal

File asli (`yang_betulan_final.html`, ±2.9 MB) berisi seluruh kode HTML,
CSS, JavaScript, **dan 51 foto menu yang di-encode base64 langsung di
dalam JavaScript**. Pemisahan yang dilakukan:

| Asal (di file asli)                                   | Tujuan                          |
|---------------------------------------------------------|----------------------------------|
| `<style> ... </style>`                                  | `css/style.css`                  |
| `const menuData = [ ... ]` (data + gambar base64)        | `data/menu.json` + `images/menu/*.jpg` |
| Logika JS (filter, search, popup, navbar, scroll, dst.)  | `js/script.js`                   |
| Markup HTML (`<body>...</body>`)                         | `index.html` (tidak diubah)      |

**Tidak ada teks, harga, deskripsi, kelas CSS, animasi, atau baris
logika JavaScript yang diubah maupun dihapus** — hanya dipindahkan ke
file yang sesuai. Satu-satunya penambahan kode adalah fungsi
`loadMenuData()` di `js/script.js` yang melakukan `fetch()` terhadap
`data/menu.json` sebelum `renderMenu()` pertama kali dipanggil — ini
diperlukan karena data menu kini berada di file eksternal, bukan
inline lagi.

### Tentang gambar di `images/menu/`

51 dari 99 item menu sebelumnya menyimpan fotonya sebagai data URI
base64 (`data:image/jpeg;base64,...`) langsung di dalam kode JavaScript
— inilah penyebab ukuran file asli mencapai hampir 3 MB. Foto-foto
tersebut sudah didekode dan disimpan sebagai file `.jpg` biasa di
`images/menu/`, dengan penamaan `{id}-{nama-menu}.jpg` (contoh:
`01-gurami-bakar-de-boer.jpg`). Field `"image"` pada `data/menu.json`
untuk item-item ini sudah diarahkan ke path lokal tersebut.

48 item menu sisanya sejak awal sudah memakai URL foto dari Unsplash
(`https://images.unsplash.com/...`) sebagai placeholder — bukan file
lokal. URL-URL tersebut **dipertahankan apa adanya** di
`data/menu.json` (lihat catatan jaringan di bawah).

### Tentang folder `images/gallery/` (kosong)

Bagian *Gallery* di `index.html` memakai 7 foto dari Unsplash via URL
langsung (bukan base64), sama seperti pada file asli. Lingkungan kerja
yang digunakan untuk merapikan proyek ini tidak memiliki akses jaringan
ke domain `images.unsplash.com`, sehingga foto-foto tersebut tidak bisa
diunduh otomatis ke folder `images/gallery/`. Markup `<img>` pada
bagian Gallery **tetap berfungsi normal** karena tetap menunjuk ke URL
Unsplash aslinya — tidak ada tampilan yang rusak atau berubah.

Jika Anda ingin menjadikan foto gallery benar-benar lokal:
1. Unduh manual ke-7 foto dari URL yang ada di bagian `<!-- ===== GALLERY ===== -->` pada `index.html`.
2. Simpan ke `images/gallery/` dengan nama bebas (mis. `01-ambiance.jpg`).
3. Ganti atribut `src="https://images.unsplash.com/..."` pada tiap `<img>` di section Gallery menjadi `src="images/gallery/01-ambiance.jpg"` dst.

Langkah yang sama berlaku untuk foto hero (`.hero` background di
`css/style.css`) dan foto section About, yang juga masih memakai URL
Unsplash.

### Tentang `assets/fonts/` dan `assets/videos/` (kosong)

Situs asli tidak memakai file font lokal (`@font-face`) maupun video —
tipografi diambil dari Google Fonts via `<link>` di `<head>`
(`Playfair Display` & `Poppins`), dan tidak ada elemen `<video>` di
manapun. Kedua folder ini disediakan sesuai struktur proyek standar
dan siap dipakai bila suatu saat dibutuhkan, namun saat ini sengaja
dikosongkan (hanya berisi `.gitkeep` agar folder tetap ter-track Git)
agar tidak ada file yang mengarah ke aset yang tidak ada.

## ✅ Checklist Verifikasi

- [x] Markup `<body>` di `index.html` diperiksa **identik byte-per-byte** dengan file asli.
- [x] Seluruh isi `<style>` dipindah ke `css/style.css` tanpa perubahan satu karakter pun.
- [x] Seluruh fungsi JavaScript (filter, search realtime, popup detail, badge, navbar scroll, hamburger menu, back-to-top, scroll-reveal/IntersectionObserver) dipindah ke `js/script.js` tanpa perubahan logika.
- [x] 99 item menu berhasil diekstrak ke `data/menu.json` (termasuk `id`, `name`, `category`, `price`, `description`, `image`, `badge`, `available`).
- [x] 51 foto base64 berhasil didekode menjadi file `.jpg` valid di `images/menu/` dan path-nya diperbarui di `menu.json`.
- [x] Tidak ada kategori, badge, atau harga yang hilang/berubah dibanding data asli.
- [x] Semua path di `index.html` (`css/style.css`, `js/script.js`) sudah relatif dan benar untuk dijalankan via local server maupun GitHub Pages.

## 🔧 Tech Stack

- HTML5 semantik
- CSS3 murni (custom properties, grid, flexbox, animasi) — tanpa framework
- JavaScript murni (vanilla) — tanpa framework/library eksternal
- Google Fonts (Playfair Display, Poppins)
- Data menu dalam format JSON statis

## 📞 Kontak Restoran

Hotel Grand Inna Medan, Jl. Balai Kota No.2, Kesawan, Medan Barat,
Kota Medan, Sumatera Utara.
Telepon: 061 415 7744 · 0811 6561 819 (Hotel)
Email: deboer@grandinnamedan.com

---
*README ini dibuat otomatis sebagai bagian dari proses restrukturisasi proyek dari satu file `index.html` menjadi struktur folder yang rapi dan siap GitHub Pages.*
