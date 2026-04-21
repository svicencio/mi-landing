/* ======================
   1. REFERENCIAS
====================== */
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
function showModal(text) {
  message.textContent = text;
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
}

function setLoading(state) {
  submitBtn.disabled = state;

  if (state) {
    btnText.textContent = "Enviando";
    spinner.classList.remove("hidden");
    inputs.forEach((i) => (i.disabled = true));
  } else {
    btnText.textContent = "Enviar";
    spinner.classList.add("hidden");
    inputs.forEach((i) => (i.disabled = false));
  }
}

// Funcion API para traer el valor del dolar

let isLoading = false;

async function getDolar() {
  if (isLoading) return;
  isLoading = true;

  try {
    const res = await fetch("https://mindicador.cl/api/dolar");
    const data = await res.json();

    const valor = data.serie[0].valor;
    dolarEl.textContent = "$ " + Math.round(valor);
  } catch {
    dolarEl.textContent = "No disponible";
  } finally {
    isLoading = false;
  }
}

// funcion filtros de servicios

let currentFilter = localStorage.getItem("filter") || "all";
let searchTerm = "";

function applyFilter() {
  // guardar filtro
  localStorage.setItem("filter", currentFilter);

  // botones activos
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });

  // recorrer las cartas y destacar
  cards.forEach((card) => {
    const categoryMatch =
      currentFilter === "all" || card.dataset.category === currentFilter;

    const originalText = card.dataset.original.toLowerCase();
    const searchMatch = originalText.includes(searchTerm);

    const match = categoryMatch && searchMatch;

    card.style.display = match ? "block" : "none";

    // aplicar highlight de busqueda
    if (match) {
      const highlighted = highlightText(card.dataset.original, searchTerm);
      card.innerHTML = highlighted;
    } else {
      // restaurar contenido original
      card.innerHTML = card.dataset.original;
    }
  });
}

// funcion para resaltar el texto de busqueda
function highlightText(text, term) {
  if (!term) return text;

  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

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

applyFilter();

getDolar(); // al cargar

setInterval(getDolar, 60000); // cada 60 segundos

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
    showModal("Corrige los errores antes de enviar");
    return;
  }

  setLoading(true);

  const data = new FormData(form);

  fetch("/", {
    method: "POST",
    body: data,
  })
    .then(() => {
      showModal("Mensaje enviado correctamente");
      form.reset();
    })
    .catch(() => {
      showModal("Error al enviar");
    })
    .finally(() => {
      setLoading(false);
    });
});

// filtros de servicio
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.toLowerCase();

  // resetear filtro
  currentFilter = "all";

  applyFilter();
});

// cerrar modal
closeBtn.addEventListener("click", hideModal);
