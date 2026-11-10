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
    return res.status(400).json({ error: 'Prompt invalide ou trop long' });
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
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}