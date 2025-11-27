/**
 * Types partagés pour le système de recherche
 */

// Types pour l'historique de conversation
export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// Types pour les résultats de recherche
export interface SearchResult {
  answer: string;
  sectionsUsed: string[];
  tokensOptimized: boolean;
}

export interface SearchResultWithNumber extends SearchResult {
  number: number | null;
}

// Types pour le sommaire
export type DocumentSource = 'temps' | 'formation' | 'teletravail';

export interface SectionIndex {
  id: string;
  titre: string;
  motsCles: string[];
  source: DocumentSource;
  chapitre?: number;
  resume?: string;
}

// Options de recherche
export interface SearchOptions {
  onlyNumber?: boolean;
  history?: ChatMessage[];
}

// Résultat de recherche legacy
export interface LegacySearchResult {
  chapitre: number;
  titre: string;
  score: number;
  articles: Array<{ titre: string; page: number }>;
}
