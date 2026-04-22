export function showModal(text, modal, message) {
  message.textContent = text;
  modal.classList.remove("hidden");
}

export function hideModal(modal) {
  modal.classList.add("hidden");
}

export function setLoading(state, submitBtn, spinner, btnText, inputs) {
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