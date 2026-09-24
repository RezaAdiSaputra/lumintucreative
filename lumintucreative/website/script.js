/* =========================================================
   LUMINTU — PARTIAL LOADER
   ========================================================= */

const sections = [
  ["navbar", "partials/navbar.html"],
  ["hero", "partials/hero.html"],
  ["about", "partials/about.html"],
  ["why-us", "partials/why-us.html"],
  ["services", "partials/services.html"],
  ["portfolio", "partials/portfolio.html"],
  ["visual-engineering", "partials/visual-engineering.html"],
  ["booth-stage", "partials/booth-stage.html"],
  ["creative-agency", "partials/creative-agency.html"],
  ["location", "partials/location.html"],
  ["clients", "partials/clients.html"],
  ["cta", "partials/cta.html"],
  ["footer", "partials/footer.html"]
];

async function loadPartials() {
  await Promise.all(
    sections.map(async ([id, file]) => {
      const target = document.getElementById(id);
      if (!target) return;

      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        target.innerHTML = await response.text();
      } catch (error) {
        console.error(error);
        target.innerHTML = "";
      }
    })
  );

  initNavigation();
  initNavbarScroll();
  initNavbarSearch();
  initYear();
  initPortfolio();
  initClients();
}

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka navigasi");
  };

  const openMenu = () => {
    links.classList.add("is-open");
    toggle.classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Tutup navigasi");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (links.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Tutup menu saat klik di luar area navigasi
  document.addEventListener("click", (e) => {
    if (links.classList.contains("is-open") && !links.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* =========================================================
   NAVBAR SCROLL BEHAVIOR
   Sembunyikan navbar saat scroll ke bawah,
   munculkan kembali saat scroll ke atas (di posisi manapun).
   ========================================================= */
function initNavbarScroll() {
  const navbar = document.querySelector(".site-nav");
  if (!navbar) return;

  // Batas toleransi posisi "stay di home utama" (paling atas / hero)
  // Di zona ini navbar selalu terlihat, arah scroll diabaikan.
  const homeThreshold = 60;
  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;

  const handleScroll = () => {
    const currentScrollY = window.scrollY || window.pageYOffset;
    const scrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY <= homeThreshold) {
      // Selalu tampil saat masih di area home utama
      navbar.classList.remove("site-nav--hidden");
    } else if (scrollingDown) {
      // Scroll ke bawah -> sembunyikan navbar
      navbar.classList.add("site-nav--hidden");

      // Tutup menu mobile jika sedang terbuka saat scroll
      const links = navbar.querySelector(".nav-links");
      const toggle = navbar.querySelector(".nav-toggle");
      if (links && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        if (toggle) {
          toggle.classList.remove("is-active");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Buka navigasi");
        }
      }

      // Tutup dropdown pencarian jika sedang aktif
      if (typeof closeSearch === "function") {
        closeSearch();
      }
    } else {
      // Scroll ke atas -> munculkan kembali navbar
      navbar.classList.remove("site-nav--hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Jalankan saat inisialisasi awal
  handleScroll();
}

/* =========================================================
   NAVBAR SEARCH BAR (BULAT & INTERAKTIF)
   ========================================================= */
let closeSearch = () => { };

function initNavbarSearch() {
  const searchContainer = document.getElementById("navSearch");
  const searchToggle = document.getElementById("navSearchToggle");
  const searchInput = document.getElementById("navSearchInput");
  const searchClear = document.getElementById("navSearchClear");
  const searchDropdown = document.getElementById("navSearchDropdown");

  if (!searchContainer || !searchToggle || !searchInput || !searchDropdown) return;

  const searchItems = [
    { title: "Home / Beranda", desc: "Halaman utama LUMINTU Creative Visual", url: "#home", tags: ["home", "beranda", "hero", "lumintu", "visual"] },
    { title: "About Us", desc: "Tentang kami & filosofi kreasi visual", url: "#about", tags: ["about", "tentang", "profil", "siapa kami", "ide"] },
    { title: "Why Us", desc: "Keunggulan memilih LUMINTU sebagai partner", url: "#why-us", tags: ["why", "kenapa", "keunggulan", "alasan", "kualitas"] },
    { title: "Services", desc: "Semua layanan event, multimedia & desain", url: "#services", tags: ["services", "layanan", "jasa", "service"] },
    { title: "Event Production", desc: "Tata panggung & visual experience event", url: "#services", tags: ["event", "acara", "panggung", "gathering", "konser"] },
    { title: "Multimedia Production", desc: "Video mapping, animasi 3D & motion graphics", url: "#services", tags: ["multimedia", "video", "animasi", "motion", "mapping", "3d"] },
    { title: "Creative Design", desc: "Branding visual, key visual & identitas brand", url: "#services", tags: ["creative", "kreatif", "desain", "design", "branding"] },
    { title: "Portfolio", desc: "Showcase proyek & dokumentasi karya terbaik", url: "#portfolio", tags: ["portfolio", "portofolio", "karya", "projek", "project", "galeri"] },
    { title: "Location / Alamat & Maps", desc: "Lokasi studio & kantor LUMINTU Creative Visual", url: "#location", tags: ["location", "lokasi", "alamat", "maps", "peta", "kantor", "studio", "gmaps", "google maps"] },
    { title: "Visual Engineering", desc: "Integrasi teknologi visual canggih & panggung", url: "#visual-engineering", tags: ["visual", "engineering", "teknologi", "stage", "instalasi"] },
    { title: "Clients", desc: "Daftar klien & kolaborasi terpercaya", url: "#clients", tags: ["clients", "klien", "partner", "mitra", "kolaborasi"] },
    { title: "Contact / WhatsApp", desc: "Konsultasikan kebutuhan visual Anda (halo minlu)", url: "#contact", tags: ["contact", "kontak", "whatsapp", "wa", "hubungi", "pesan", "minlu"] }
  ];

  const openSearch = () => {
    searchContainer.classList.add("is-open");
    searchToggle.setAttribute("aria-label", "Tutup pencarian");
    setTimeout(() => searchInput.focus(), 150);
  };

  closeSearch = () => {
    searchContainer.classList.remove("is-open");
    searchToggle.setAttribute("aria-label", "Buka pencarian");
    searchInput.value = "";
    searchDropdown.classList.remove("has-results");
    searchDropdown.innerHTML = "";
    if (searchClear) searchClear.style.display = "none";
  };

  searchToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (searchContainer.classList.contains("is-open")) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  const renderResults = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.remove("has-results");
      searchDropdown.innerHTML = "";
      if (searchClear) searchClear.style.display = "none";
      return;
    }

    if (searchClear) searchClear.style.display = "block";

    const filtered = searchItems.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTags;
    });

    if (filtered.length === 0) {
      searchDropdown.innerHTML = `<div class="nav-search-empty">Tidak ada hasil untuk "<strong>${query.replace(/</g, "&lt;")}</strong>"</div>`;
    } else {
      searchDropdown.innerHTML = filtered.map(item => `
        <a class="nav-search-item" href="${item.url}">
          <span class="nav-search-item-title">${item.title}</span>
          <span class="nav-search-item-desc">${item.desc}</span>
        </a>
      `).join("");
    }

    searchDropdown.classList.add("has-results");

    // Tangani klik pada hasil pencarian
    searchDropdown.querySelectorAll(".nav-search-item").forEach(itemLink => {
      itemLink.addEventListener("click", (e) => {
        const targetHref = itemLink.getAttribute("href");
        if (targetHref && targetHref.startsWith("#")) {
          const targetEl = document.querySelector(targetHref);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
        closeSearch();
      });
    });
  };

  searchInput.addEventListener("input", (e) => {
    renderResults(e.target.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
    } else if (e.key === "Enter") {
      const firstResult = searchDropdown.querySelector(".nav-search-item");
      if (firstResult) {
        firstResult.click();
      }
    }
  });

  if (searchClear) {
    searchClear.addEventListener("click", (e) => {
      e.stopPropagation();
      searchInput.value = "";
      renderResults("");
      searchInput.focus();
    });
  }

  // Tutup bila klik di luar area search
  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      if (searchContainer.classList.contains("is-open")) {
        closeSearch();
      }
    }
  });
}

function initYear() {
  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
}

/* =========================================================
   PORTFOLIO — DYNAMIC LOADER + FILTER + DETAIL MODAL
   Data diambil dari: data/portfolio.json

   CARA TAMBAH PROJECT BARU:
   1. Simpan foto cover ke: assets/images/nama-foto.jpg
   2. Buka file: data/portfolio.json
   3. Tambahkan entry baru:
      {
        "id": "proj_X",
        "title": "Nama Project",
        "category": "Event Documentation",
        "size": "large",
        "cover": "assets/images/cover.jpg",
        "description": "Deskripsi project...",
        "images": [
          "assets/images/foto-1.jpg",
          "assets/images/foto-2.jpg"
        ]
      }
   4. Simpan file. Refresh browser. Selesai!
   ========================================================= */

let portfolioData = [];
let portfolioCurrentFilter = "all";
let pmodalCurrentIndex = 0;
let pmodalImages = [];

async function initPortfolio() {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;

  try {
    const res = await fetch("data/portfolio.json?v=" + Date.now());
    if (!res.ok) throw new Error("Gagal memuat data/portfolio.json");
    portfolioData = await res.json();

    if (!Array.isArray(portfolioData) || portfolioData.length === 0) {
      grid.innerHTML = `<p style="color:#888;grid-column:1/-1">Belum ada project. Tambahkan di data/portfolio.json.</p>`;
      return;
    }

    renderPortfolioGrid("all");
    initPortfolioFilters();
    initPortfolioModal();

  } catch (err) {
    console.error("Portfolio loader error:", err);
    grid.innerHTML = `<p style="color:#888;grid-column:1/-1">Gagal memuat portfolio. Periksa file data/portfolio.json.</p>`;
  }
}

function renderPortfolioGrid(filter) {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;

  const filtered = filter === "all"
    ? portfolioData
    : portfolioData.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:#888;grid-column:1/-1;padding:40px 0;">Belum ada project di kategori ini.</p>`;
    return;
  }

  grid.innerHTML = filtered.map((item) => {
    const sizeClass = item.size === "large" ? "project--large" : "project--small";
    const cover = item.cover || item.image || "";
    const hasImage = cover.trim() !== "";
    const imgTag = hasImage
      ? `<img src="${cover}" alt="${item.title}" loading="lazy">`
      : `<div class="project-placeholder-img"></div>`;

    const imgCount = Array.isArray(item.images) ? item.images.length : (cover ? 1 : 0);

    return `
      <article class="project ${sizeClass} project--clickable"
               data-portfolio-id="${item.id}"
               tabindex="0"
               role="button"
               aria-label="Lihat detail: ${item.title}">
        ${imgTag}
        <div class="project-overlay">
          <span class="project-category">${item.category || ""}</span>
          <h3>${item.title}</h3>
          <span class="project-view-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            ${imgCount > 1 ? imgCount + " Foto" : "Lihat Detail"}
          </span>
        </div>
      </article>
    `;
  }).join("");

  // Event listener tiap card
  grid.querySelectorAll(".project--clickable").forEach(card => {
    const openModal = () => {
      const id = card.dataset.portfolioId;
      const item = portfolioData.find(p => p.id === id);
      if (item) openPortfolioModal(item);
    };
    card.addEventListener("click", openModal);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(); }
    });
  });

  // Animasi masuk card
  requestAnimationFrame(() => {
    grid.querySelectorAll(".project--clickable").forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(18px)";
      setTimeout(() => {
        card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, i * 70);
    });
  });
}

function initPortfolioFilters() {
  const container = document.getElementById("portfolio-filters");
  if (!container) return;

  container.querySelectorAll(".pf-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".pf-tab").forEach(b => b.classList.remove("pf-tab--active"));
      btn.classList.add("pf-tab--active");
      portfolioCurrentFilter = btn.dataset.filter;
      renderPortfolioGrid(portfolioCurrentFilter);
    });
  });
}

function initPortfolioModal() {
  const backdrop = document.getElementById("portfolioModal");
  const closeBtn = document.getElementById("portfolioModalClose");
  const prevBtn = document.getElementById("pmodalPrev");
  const nextBtn = document.getElementById("pmodalNext");
  if (!backdrop) return;

  closeBtn && closeBtn.addEventListener("click", closePortfolioModal);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closePortfolioModal(); });

  document.addEventListener("keydown", e => {
    if (!backdrop.hidden) {
      if (e.key === "Escape") closePortfolioModal();
      if (e.key === "ArrowLeft") navigateModal(-1);
      if (e.key === "ArrowRight") navigateModal(1);
    }
  });

  prevBtn && prevBtn.addEventListener("click", () => navigateModal(-1));
  nextBtn && nextBtn.addEventListener("click", () => navigateModal(1));
}

function openPortfolioModal(item) {
  const backdrop = document.getElementById("portfolioModal");
  const mainImg = document.getElementById("pmodalMainImg");
  const thumbsEl = document.getElementById("pmodalThumbs");
  const catEl = document.getElementById("pmodalCategory");
  const titleEl = document.getElementById("pmodalTitle");
  const descEl = document.getElementById("pmodalDesc");
  const counterEl = document.getElementById("pmodalCounter");
  const metaEl = document.getElementById("pmodalMeta");
  const prevBtn = document.getElementById("pmodalPrev");
  const nextBtn = document.getElementById("pmodalNext");
  if (!backdrop) return;

  catEl.textContent = item.category || "";
  titleEl.textContent = item.title || "";
  descEl.textContent = item.description || "";

  // Bangun daftar gambar
  pmodalImages = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    pmodalImages = item.images.filter(Boolean);
  }
  if (pmodalImages.length === 0 && item.cover) pmodalImages = [item.cover];
  if (pmodalImages.length === 0 && item.image) pmodalImages = [item.image];

  pmodalCurrentIndex = 0;

  // Thumbnail strip
  thumbsEl.innerHTML = pmodalImages.map((src, i) => `
    <button class="pmodal-thumb ${i === 0 ? "pmodal-thumb--active" : ""}"
            data-idx="${i}" aria-label="Foto ${i + 1}">
      <img src="${src}" alt="Thumbnail ${i + 1}" loading="lazy">
    </button>
  `).join("");

  thumbsEl.querySelectorAll(".pmodal-thumb").forEach(btn => {
    btn.addEventListener("click", () => {
      pmodalCurrentIndex = parseInt(btn.dataset.idx);
      updateModalImage();
    });
  });

  const showNav = pmodalImages.length > 1;
  if (prevBtn) prevBtn.style.display = showNav ? "" : "none";
  if (nextBtn) nextBtn.style.display = showNav ? "" : "none";
  if (thumbsEl) thumbsEl.style.display = showNav ? "" : "none";

  metaEl.innerHTML = `<span>${pmodalImages.length} foto${item.category ? " &nbsp;·&nbsp; " + item.category : ""}</span>`;

  updateModalImage();

  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => backdrop.classList.add("pmodal-backdrop--visible"));
}

function closePortfolioModal() {
  const backdrop = document.getElementById("portfolioModal");
  if (!backdrop) return;
  backdrop.classList.remove("pmodal-backdrop--visible");
  setTimeout(() => {
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }, 280);
}

function navigateModal(dir) {
  if (pmodalImages.length <= 1) return;
  pmodalCurrentIndex = (pmodalCurrentIndex + dir + pmodalImages.length) % pmodalImages.length;
  updateModalImage();
}

function updateModalImage() {
  const mainImg = document.getElementById("pmodalMainImg");
  const counterEl = document.getElementById("pmodalCounter");
  const thumbsEl = document.getElementById("pmodalThumbs");

  if (!mainImg) return;

  const src = pmodalImages[pmodalCurrentIndex];
  if (src) {
    mainImg.classList.add("pmodal-img--loading");
    const tmp = new Image();
    tmp.onload = () => {
      mainImg.src = src;
      mainImg.alt = `Foto ${pmodalCurrentIndex + 1}`;
      mainImg.classList.remove("pmodal-img--loading");
    };
    tmp.src = src;
  }

  counterEl.textContent = `${pmodalCurrentIndex + 1} / ${pmodalImages.length}`;

  thumbsEl && thumbsEl.querySelectorAll(".pmodal-thumb").forEach((btn, i) => {
    btn.classList.toggle("pmodal-thumb--active", i === pmodalCurrentIndex);
  });
}

/* =========================================================
   CLIENTS — DYNAMIC LOADER
   Data diambil dari: data/clients.json

   CARA TAMBAH CLIENT BARU:
   1. Simpan logo ke: assets/images/client-namabrand.png
   2. Buka file: data/clients.json
   3. Tambahkan entry baru:
      {
        "id": "client_X",
        "name": "Nama Brand",
        "logo": "assets/images/client-namabrand.png"
      }
   4. Simpan file. Refresh browser. Selesai!
   ========================================================= */
async function initClients() {
  const grid = document.getElementById("clients-grid");
  if (!grid) return;

  try {
    const res = await fetch("data/clients.json?v=" + Date.now());
    if (!res.ok) throw new Error("Gagal memuat data/clients.json");
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = `<p style="color:#888;grid-column:1/-1">Belum ada client. Tambahkan di data/clients.json.</p>`;
      return;
    }

    grid.innerHTML = items.map(item => {
      const hasLogo = item.logo && item.logo.trim() !== "";
      const inner = hasLogo
        ? `<img src="${item.logo}" alt="Logo ${item.name}" loading="lazy" class="client-logo-img">`
        : `<span>${item.name}</span>`;
      return `<div class="client-logo" title="${item.name}">${inner}</div>`;
    }).join("");

  } catch (err) {
    console.error("Clients loader error:", err);
    grid.innerHTML = `<p style="color:#888;grid-column:1/-1">Gagal memuat clients. Periksa file data/clients.json.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadPartials);
