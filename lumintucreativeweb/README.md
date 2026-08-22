# LUMINTU Landing Page — Starter

## Struktur
- index.html             -> entry point
- style.css              -> seluruh styling
- script.js              -> loader partial + interaksi navbar
- partials/              -> tiap section dipisah agar mudah maintenance
- assets/images/         -> tempat foto, render, dan asset visual

## Cara menjalankan
Karena section dimuat memakai `fetch()`, jangan buka `index.html` langsung dengan `file://`.

Gunakan local server, misalnya:
- VS Code + Live Server
- atau `python -m http.server`

## Yang perlu diganti
1. `assets/images/*.jpg` dengan foto/project asli.
2. Nomor WhatsApp di `partials/cta.html` dan `partials/footer.html`.
3. Email dan social media.
4. Nama client placeholder.
5. Copywriting sesuai brand guideline final.

## Maintenance
Untuk mengubah satu section, cukup edit file di `partials/`.
Contoh:
- Hero -> `partials/hero.html`
- Services -> `partials/services.html`
- Portfolio -> `partials/portfolio.html`
- Footer -> `partials/footer.html`

CSS tetap terpusat di `style.css`.
