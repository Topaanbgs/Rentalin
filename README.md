# 🎮 Rentalin - Modern PlayStation Rental Management System

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**Rentalin** adalah platform manajemen penyewaan PlayStation yang dirancang untuk mendigitalisasi operasional UMKM rental. Dibangun dengan stack modern **Laravel Inertia React**, aplikasi ini menawarkan pengalaman Single Page Application (SPA) yang cepat dengan backend yang robust.

---

## 🚀 Key Features

### 👤 User Side
- **Automated Booking:** Sistem pemesanan unit PS secara real-time.
- **Interactive Dashboard:** Pantau status penyewaan dan riwayat transaksi.
- **QR Payment Simulation:** Simulasi pembayaran instan menggunakan QR Code berbasis React komponen untuk kemudahan transaksi digital.

### 🛡️ Admin Side (Smart Dashboard)
- **Unit Management:** Kontrol ketersediaan unit PS (PS4/PS5).
- **Transaction Monitoring:** Laporan transaksi masuk secara transparan.
- **User Analytics:** Ringkasan data penyewa untuk strategi bisnis.

---

## 🛠️ Tech Stack

- **Backend:** [Laravel 10+](https://laravel.com)
- **Frontend:** [React.js](https://react.dev) via [Inertia.js](https://inertiajs.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database:** MySQL / PostgreSQL
- **State Management:** X-Inertia shared props

---

## ⚙️ Local Installation

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

1. **Clone Repositori**
   ```bash
   git clone [https://github.com/Topaanbgs/Rentalin.git](https://github.com/Topaanbgs/Rentalin.git)
   cd Rentalin
Instalasi Dependency (PHP & Node)

Bash
composer install
npm install
Konfigurasi Environment

Bash
cp .env.example .env
# Jangan lupa atur koneksi DATABASE di file .env
php artisan key:generate
Migrasi & Seeder

Bash
php artisan migrate --seed
Jalankan Aplikasi Buka dua terminal:

Terminal 1: php artisan serve

Terminal 2: npm run dev

💡 Highlight Pengembangan
Proyek ini mengimplementasikan konsep Monolith-Modern, di mana routing dilakukan di sisi server (Laravel) namun rendering dilakukan secara dinamis oleh React tanpa reload halaman (SPA). Simulasi pembayaran QR Code dikembangkan untuk mendemonstrasikan logika frontend-to-backend dalam menangani status transaksi secara aman.

📄 License
Project ini dilisensikan di bawah MIT License.

Developed by Topan Bagus Prasetyo
