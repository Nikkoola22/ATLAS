/**
 * Module de recherche unifiée - Point d'entrée principal
 * 
 * Exporte toutes les fonctions de recherche depuis un seul point
 */

export { unifiedSearch, searchInternalDocs, searchInternalDocsWithNumber } from './unifiedSearch';
export { queryInternalDocs } from './legacySearch';
export type { 
  SearchResult, 
  SearchResultWithNumber, 
  ChatMessage, 
  SearchOptions 
} from '../types';
