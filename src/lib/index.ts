/**
 * Lib - Point d'entrée principal
 * 
 * Structure du module :
 * - api/          : Clients API (Perplexity)
 * - prompts/      : Générateurs de prompts système
 * - search/       : Moteur de recherche unifié
 * - types.ts      : Types partagés
 */

// API
export { callPerplexityAPI } from './api/perplexity';

// Prompts
export { 
  buildStrictSystemPrompt, 
  buildLocationSystemPrompt 
} from './prompts/systemPrompt';

// Recherche
export { 
  unifiedSearch, 
  searchInternalDocs, 
  searchInternalDocsWithNumber,
  queryInternalDocs
} from './search';

// Types
export type { 
  ChatMessage, 
  ChatRole,
  SearchResult, 
  SearchResultWithNumber,
  SearchOptions,
  DocumentSource,
  SectionIndex,
  LegacySearchResult
} from './types';
