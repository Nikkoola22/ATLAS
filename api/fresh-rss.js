// Fichier : /api/fresh-rss.js (Vercel Serverless Function pour Vite)

export default async function handler(req, res) {
  const feedUrl = req.query.feedUrl;

  if (!feedUrl) {
    return res.status(400).json({ error: 'Le paramètre feedUrl est manquant' });
  }

  try {
    // Cache buster pour éviter les caches
    const urlAvecCacheBuster = `${feedUrl}?_=${Date.now()}`;
    
    const response = await fetch(urlAvecCacheBuster, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Vercel Serverless)',
        'Accept': 'application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`Le serveur du flux a répondu avec le statut : ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Headers anti-cache
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).send(xmlText);

  } catch (error) {
    console.error(`Erreur API pour le flux ${feedUrl}:`, error);
    return res.status(502).json({ 
      error: 'Impossible de récupérer le flux RSS.', 
      details: error.message 
    });
  }
}
