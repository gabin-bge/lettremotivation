export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt vide' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERREUR GOOGLE API:", JSON.stringify(data));
      return res.status(500).json({ error: data.error?.message || 'Erreur API Gemini' });
    }

    const letterText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ result: letterText });
  } catch (error) {
    console.error("ERREUR SERVEUR:", error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}