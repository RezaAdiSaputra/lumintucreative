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
  initYear();
}

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
    toggle.setAttribute(
      "aria-expanded",
      links.classList.contains("is-open")
    );
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initYear() {
  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", loadPartials);
