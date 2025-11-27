/**
 * Recherche legacy - Compatibilité avec l'ancien système
 * 
 * Cette fonction est maintenue pour la rétrocompatibilité
 * Préférez utiliser unifiedSearch pour les nouvelles fonctionnalités
 */

import { callPerplexityAPI } from '../api/perplexity';
import { buildStrictSystemPrompt } from '../prompts/systemPrompt';
import type { ChatMessage, SearchOptions } from '../types';

/**
 * Requête sur les documents internes avec le contexte complet
 * 
 * @deprecated Utilisez searchInternalDocs de unifiedSearch.ts pour optimiser les tokens
 * @param question - La question de l'utilisateur
 * @param contexte - Le contexte complet de la documentation
 * @param options - Options de recherche
 */
export async function queryInternalDocs(
  question: string,
  contexte: string,
  options?: SearchOptions
): Promise<{ text: string; number?: number | null }> {
  const system = buildStrictSystemPrompt(contexte);

  const messages: ChatMessage[] = [{ role: 'system', content: system }];
  
  if (options?.history?.length) {
    messages.push(...options.history);
  }
  
  messages.push({ role: 'user', content: question });

  try {
    const reply = await callPerplexityAPI(messages, true);
    
    if (options?.onlyNumber) {
      const match = String(reply).match(/(\d{1,3})/);
      return { 
        text: reply, 
        number: match ? parseInt(match[1], 10) : null 
      };
    }

    return { text: reply };
  } catch (err) {
    throw err;
  }
}

export default queryInternalDocs;
