/**
 * API Client - Appels vers Perplexity
 * Point d'entrée unique pour les communications avec l'API
 */

import type { ChatMessage } from '../types';

export interface PerplexityRequestOptions {
  model?: string;
  disableWebSearch?: boolean;
}

/**
 * Appelle l'API Perplexity via le proxy /api/completions
 * 
 * @param messages - Liste des messages de conversation
 * @param disableWebSearch - Si true, désactive la recherche web (pour les docs internes)
 * @returns Le contenu de la réponse de l'API
 */
export async function callPerplexityAPI(
  messages: ChatMessage[],
  disableWebSearch = false
): Promise<string> {
  const apiEndpoint = '/api/completions';

  const requestBody: Record<string, unknown> = {
    model: 'sonar-pro',
    messages,
  };

  // Désactiver la recherche web pour les questions sur les docs internes
  if (disableWebSearch) {
    requestBody.search_domain_filter = [];
    requestBody.web_search = false;
    requestBody.return_images = false;
    requestBody.return_related_questions = false;
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error (${response.status})`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? JSON.stringify(json);
}

export default callPerplexityAPI;
