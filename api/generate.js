import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt vide' });
  }

  try {
    const ai = new GoogleGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response || !response.text) {
      return res.status(500).json({ error: 'Réponse vide de l\'IA' });
    }

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error("ERREUR SDK GEMINI:", error);
    return res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
}