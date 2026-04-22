/* ======================
   1. REFERENCIAS
====================== */

import { getDolar } from "./api.js";
import { applyFilter } from "./filters.js";
import { showModal, hideModal, setLoading } from "./ui.js";
import {
  validateName,
  validateEmail,
  validateMessage,
  validateForm,
} from "./validation.js";

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

const elements = document.querySelectorAll(".fade-in");

if (!form) {
  console.error("Formulario no encontrado");
}
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

// agrupar inicialización
function init() {
  setLoading(false, submitBtn, spinner, btnText, inputs);

  cards.forEach((card) => {
    card.dataset.original = card.textContent;
  });

  applyFilter({ buttons, cards, currentFilter, searchTerm });

  updateDolar();
  setInterval(updateDolar, 60000);
}

init();

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

   Todo en validation.js
====================== */

/* ======================
   4. EVENTOS
====================== */

// recuerda el texto de las cards primero
cards.forEach((card) => {
  card.dataset.original = card.textContent;
});

applyFilter({ buttons, cards, currentFilter, searchTerm });

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

if (elements.length) {
  elements.forEach((el) => observer.observe(el));
}

// validación en vivo solo si se interactua con el elemento
nameInput.addEventListener("input", () => validateName(nameInput));
emailInput.addEventListener("input", () => validateEmail(emailInput));
messageInput.addEventListener("input", () => validateMessage(messageInput));

// submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm({ nameInput, emailInput, messageInput })) {
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
