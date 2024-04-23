import { Strokes } from "@/data/models/Strokes";

export const loadStrokes = async (left : number, top : number, right : number, bottom : number) => {
  console.log(`${import.meta.env.VITE_SERVER}/strokes?left=${left}&top=${top}&right=${right}&bottom=${bottom}`);
  return fetch(`${import.meta.env.VITE_SERVER}/strokes?left=${left}&top=${top}&right=${right}&bottom=${bottom}`)
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
}

export const sendStrokeDataToServer = async (strokeData: Strokes.Stroke) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/strokes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(strokeData),
    });
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    console.log("Stroke data sent successfully to the server.");
  } catch (error) {
    console.error("Failed to send stroke data:", error);
  }
};