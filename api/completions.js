export default async function handler(req, res) {
  // Ajouter les headers CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📝 Requête reçue:', JSON.stringify(req.body, null, 2));
  
  // Vérifier que la clé API existe
  if (!process.env.PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY n\'est pas définie');
    return res.status(500).json({ 
      error: "Configuration manquante", 
      details: "La clé API Perplexity n'est pas configurée dans Vercel. Veuillez ajouter PERPLEXITY_API_KEY dans les variables d'environnement." 
    });
  }
  
  console.log('🔑 Clé API trouvée:', process.env.PERPLEXITY_API_KEY.substring(0, 10) + '...');
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    const modifiedBody = {
      ...req.body,
      return_images: false,
      return_related_questions: false,
      max_tokens: 1000,
      temperature: 0.0
    };
    
    console.log('🚀 Envoi vers Perplexity:', JSON.stringify(modifiedBody, null, 2));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(modifiedBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📡 Statut réponse Perplexity:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Erreur Perplexity:', text);
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    console.log('✅ Réponse Perplexity reçue');
    res.status(200).json(data);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("⏱️ Timeout: Requête Perplexity dépassée (30s)");
      return res.status(504).json({ error: "Timeout", details: "La requête a dépassé le délai limite de 30 secondes" });
    }
    console.error("💥 Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}
