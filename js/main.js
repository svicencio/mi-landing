/* ======================
   1. REFERENCIAS
====================== */

import { getDolar } from "./api.js";
import { applyFilter } from "./filters.js";
import { showModal, hideModal, setLoading } from "./ui.js";

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

const elements = document.querySelectorAll(".fade-in");

const form = document.querySelector("form");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-modal");
const message = document.getElementById("modal-message");

const submitBtn = document.getElementById("submit-btn");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btn-text");

const inputs = form.querySelectorAll("input, textarea");

const nameInput = form.querySelector('input[name="name"]');
const emailInput = form.querySelector('input[name="email"]');
const messageInput = form.querySelector('textarea[name="message"]');

// dolar
const dolarEl = document.getElementById("dolar-value");

// filtros servicios
const buttons = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".card");

// filtro por texto
const searchInput = document.getElementById("search-input");

/* ======================
   2. UI (MODAL + LOADING)
====================== */
// movido a ui.js

// Funcion API para traer el valor del dolar
// funcion exportada a api.js
async function updateDolar() {
  const valor = await getDolar();

  if (valor) {
    dolarEl.textContent = `$${valor}`;
  } else {
    dolarEl.textContent = "No disponible";
  }
}

// funcion filtros de servicios

let currentFilter = localStorage.getItem("filter") || "all";
let searchTerm = "";





/* ======================
   3. VALIDACIÓN
====================== */
function showError(input, text) {
  const errorEl = document.getElementById("error-" + input.name);
  errorEl.textContent = text;
  input.classList.add("input-error");
}

function clearError(input) {
  const errorEl = document.getElementById("error-" + input.name);
  errorEl.textContent = "";
  input.classList.remove("input-error");
}

function validateName() {
  if (nameInput.value.trim().length < 3) {
    showError(nameInput, "Mínimo 3 caracteres");
    return false;
  }
  clearError(nameInput);
  return true;
}

function validateEmail() {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
  if (!valid) {
    showError(emailInput, "Email inválido");
    return false;
  }
  clearError(emailInput);
  return true;
}

function validateMessage() {
  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "Mensaje muy corto");
    return false;
  }
  clearError(messageInput);
  return true;
}

function validateForm() {
  return validateName() && validateEmail() && validateMessage();
}

/* ======================
   4. EVENTOS
====================== */

// recuerda el texto de las cards primero
cards.forEach((card) => {
  card.dataset.original = card.textContent;
});

applyFilter({ buttons, cards, currentFilter, searchTerm });
// funcion para resaltar el texto de busqueda
function highlightText(text, term) {
  if (!term) return text;

  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

updateDolar(); // al cargar

setInterval(updateDolar, 60000); // cada 60 segundos

// menú
toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// animaciones
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

elements.forEach((el) => observer.observe(el));

// validación en vivo
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
messageInput.addEventListener("input", validateMessage);

// submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    showModal("Corrige los errores antes de enviar", modal, message);
    return;
  }

  setLoading(true, submitBtn, spinner, btnText, inputs);

  const data = new FormData(form);

  fetch("/", {
    method: "POST",
    body: data,
  })
    .then(() => {
      showModal("Mensaje enviado", modal, message);
      form.reset();
    })
    .catch(() => {
      showModal("Error al enviar");
    })
    .finally(() => {
      setLoading(false, submitBtn, spinner, btnText, inputs);
    });
});

// filtros de servicio
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    applyFilter({ buttons, cards, currentFilter, searchTerm });
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.toLowerCase();
  currentFilter = "all";

  applyFilter({ buttons, cards, currentFilter, searchTerm });
});

// cerrar modal
closeBtn.addEventListener("click", () => hideModal(modal));
