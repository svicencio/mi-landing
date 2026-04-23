export async function getDolar() {
  try {
    const res = await fetch("https://mindicador.cl/api/dolar");
    const data = await res.json();

    return data.serie[0].valor;
  } catch (error) {
    console.error("Error obteniendo dólar:", error);
    return null;
  }
}
