/**
 * @deprecated Utilisez les imports depuis './search' ou './prompts/systemPrompt'
 * Ce fichier est maintenu pour la rétrocompatibilité
 */
export { buildStrictSystemPrompt } from './prompts/systemPrompt';
export { queryInternalDocs } from './search/legacySearch';
export type { ChatMessage as ChatHistoryItem } from './types';
