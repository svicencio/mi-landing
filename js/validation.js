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

export function validateName(input) {
  if (input.value.trim().length < 3) {
    showError(input, "Mínimo 3 caracteres");
    return false;
  }
  clearError(input);
  return true;
}

export function validateEmail(input) {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
  if (!valid) {
    showError(input, "Email inválido");
    return false;
  }
  clearError(input);
  return true;
}

export function validateMessage(input) {
  if (input.value.trim().length < 10) {
    showError(input, "Mensaje muy corto");
    return false;
  }
  clearError(input);
  return true;
}

export function validateForm({ nameInput, emailInput, messageInput }) {
  return (
    validateName(nameInput) &&
    validateEmail(emailInput) &&
    validateMessage(messageInput)
  );
}