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

function hasErrors() {
  return document.querySelectorAll(".input-error").length > 0;
}

form.addEventListener("submit", function (e) {
  e.preventDefault(); // evita recarga

  if (hasErrors()) {
    message.textContent = "Corrige los errores antes de enviar";
    modal.classList.remove("hidden");
    return;
  }

  const data = new FormData(form);

  fetch("/", {
    method: "POST",
    body: data,
  })
    .then(() => {
      message.textContent = "Mensaje enviado correctamente";
      modal.classList.remove("hidden");
      form.reset();
    })
    .catch(() => {
      message.textContent = "Error al enviar";
      modal.classList.remove("hidden");
    });
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Mensajes de errores

const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[name="email"]');
const messageInput = document.querySelector('textarea[name="message"]');

function showError(input, message) {
  const errorEl = document.getElementById("error-" + input.name);
  errorEl.textContent = message;
  input.classList.add("input-error");
}

function clearError(input) {
  const errorEl = document.getElementById("error-" + input.name);
  errorEl.textContent = "";
  input.classList.remove("input-error");
}

// VALIDACIONES

nameInput.addEventListener("input", () => {
  if (nameInput.value.trim().length < 3) {
    showError(nameInput, "Mínimo 3 caracteres");
  } else {
    clearError(nameInput);
  }
});

emailInput.addEventListener("input", () => {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
  if (!valid) {
    showError(emailInput, "Email inválido");
  } else {
    clearError(emailInput);
  }
});

messageInput.addEventListener("input", () => {
  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "Mensaje muy corto");
  } else {
    clearError(messageInput);
  }
});
