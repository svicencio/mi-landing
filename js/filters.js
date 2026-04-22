// funcion para resaltar el texto de busqueda
function highlightText(text, term) {
  if (!term) return text;

  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export function applyFilter({ buttons, cards, currentFilter, searchTerm }) {
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
