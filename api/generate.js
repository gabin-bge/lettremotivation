export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const origin = req.headers.origin || req.headers.referer;
  if (!origin || !origin.includes('lettremotivation.vercel.app')) {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }

  const { prompt } = req.body;
  if (!prompt || prompt.length > 5000) {
    return res.status(400).json({ error: 'Prompt invalide' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // Si l'API Gemini renvoie une erreur, on l'affiche dans les logs Vercel
    if (!response.ok) {
      console.error("Erreur API Gemini:", JSON.stringify(data));
      return res.status(500).json({ error: 'Erreur renvoyée par l\'API Gemini' });
    }

    const letterText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!letterText) {
      console.error("Structure de réponse inconnue:", JSON.stringify(data));
      return res.status(500).json({ error: 'Format de réponse invalide' });
    }

    return res.status(200).json({ result: letterText });
  } catch (error) {
    console.error("Erreur interne serveur:", error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}