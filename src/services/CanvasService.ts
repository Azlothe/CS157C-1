export async function loadStrokes() {
  return fetch(`${import.meta.env.VITE_SERVER}/strokes`)
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
}