# 📋 PANDUAN NAMBAH FOTO / KONTEN LUMINTU WEBSITE

Tanpa masuk koding, tanpa admin panel. Cukup edit file teks & taruh foto.

---

## 🖼️ CARA NAMBAH PROJECT / PORTFOLIO BARU

**File yang diedit:** `data/portfolio.json`

**Langkah:**
1. Simpan foto project ke folder: `assets/images/`
   - Contoh: `assets/images/project-pameran-2025.jpg`
   - Format yang disupport: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Ukuran ideal: lebar minimal 1200px, perbandingan sekitar 16:9

2. Buka file `data/portfolio.json` dengan Notepad atau VS Code

3. Tambahkan entry baru di dalam tanda kurung siku `[...]`, pisahkan dengan koma:

```json
{
  "id": "proj_5",
  "title": "Nama Project Kamu",
  "category": "Event Production",
  "size": "large",
  "image": "assets/images/project-pameran-2025.jpg"
}
```

**Keterangan kolom:**
| Kolom      | Penjelasan                                         |
|------------|----------------------------------------------------|
| `id`       | ID unik, boleh isi bebas. Misal: "proj_5"         |
| `title`    | Judul project yang tampil di website               |
| `category` | Kategori project. Contoh: "Event Production"       |
| `size`     | Ukuran card di website: **"large"** atau **"small"** |
| `image`    | Path foto. Simpan di `assets/images/`              |

4. Simpan file → Buka browser → Refresh halaman → **Selesai!**

---

## 🏢 CARA NAMBAH LOGO KLIEN BARU

**File yang diedit:** `data/clients.json`

**Langkah:**
1. Simpan file logo ke folder: `assets/images/`
   - Contoh: `assets/images/client-tokopedia.png`
   - Format terbaik: `.png` dengan background transparan
   - Ukuran ideal: lebar 300px, tinggi 100–120px

2. Buka file `data/clients.json`

3. Tambahkan entry baru:

```json
{
  "id": "client_9",
  "name": "Tokopedia",
  "logo": "assets/images/client-tokopedia.png"
}
```

**Catatan:** Kalau logo belum siap, isi `"logo": ""` — nama brand akan tampil sebagai teks sementara.

4. Simpan file → Refresh browser → **Selesai!**

---

## ✏️ CARA EDIT TEKS / COPYWRITING SECTION

Untuk edit teks di bagian-bagian website, buka file di folder `partials/`:

| Section          | File yang dibuka                     |
|------------------|--------------------------------------|
| Hero (judul besar)  | `partials/hero.html`              |
| About            | `partials/about.html`                |
| Services         | `partials/services.html`             |
| Lokasi & Maps    | `partials/location.html`             |
| Footer           | `partials/footer.html`               |

---

## 📁 Struktur Folder Singkat

```
lumintucreativeweb/
├── assets/
│   └── images/          ← 📸 TARUH SEMUA FOTO DI SINI
├── data/
│   ├── portfolio.json   ← 📝 EDIT INI untuk nambah/hapus project
│   └── clients.json     ← 📝 EDIT INI untuk nambah/hapus klien
├── partials/            ← Edit untuk ubah teks section
└── index.html           ← Jangan perlu diutak-atik
```

---

> **Tips:** Setelah edit file JSON, kalau perubahan belum muncul di browser, coba tekan **Ctrl+Shift+R** (hard refresh) untuk memaksa browser reload file terbaru.
