// funcion para resaltar el texto de busqueda
function highlightText(text, term) {
  if (!term) return text;

  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export function applyFilter({ buttons, cards, currentFilter, searchTerm, resultsCount, noResults}) {
  let visibleCount = 0;

  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });

  cards.forEach((card) => {
    const categoryMatch =
      currentFilter === "all" || card.dataset.category === currentFilter;

    const originalText = card.dataset.original.toLowerCase();
    const searchMatch = originalText.includes(searchTerm);

    const match = categoryMatch && searchMatch;

    card.style.display = match ? "block" : "none";

    if (match) {
      visibleCount++;

      const highlighted = highlightText(card.dataset.original, searchTerm);
      card.innerHTML = highlighted;
    } else {
      card.innerHTML = card.dataset.original;
    }
  });

  // 👇 NUEVO: feedback UI
  resultsCount.textContent = `${visibleCount} resultado(s)`;

  if (visibleCount === 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }
}
