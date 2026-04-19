// ======================
// MENU MOBILE
// ======================
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// ======================
// ANIMACIONES SCROLL
// ======================
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

elements.forEach((el) => observer.observe(el));

/* Envio de formularios */

const form = document.querySelector("form");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-modal");
const message = document.getElementById("modal-message");

form.addEventListener("submit", function(e) {
  e.preventDefault(); // evita recarga

  const data = new FormData(form);

  fetch("/", {
    method: "POST",
    body: data
  })
  .then(() => {
    message.textContent = "Mensaje enviado correctamente";
    modal.classList.remove("hidden");
    form.reset();
  })
  .catch(() => {
    message.textContent = "Error al enviar. Intenta nuevamente.";
    modal.classList.remove("hidden");
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});