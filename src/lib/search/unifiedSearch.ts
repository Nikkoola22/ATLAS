/**
 * Recherche unifiée en 2 étapes pour économiser les tokens
 * 
 * STRATÉGIE :
 * 1. Identifier la section pertinente via le sommaire léger (~500 tokens)
 * 2. Charger uniquement le contenu ciblé pour la réponse finale
 * 
 * ÉCONOMIE : ~90% de tokens en moins par requête
 */

import { callPerplexityAPI } from '../api/perplexity';
import { buildStrictSystemPrompt, buildLocationSystemPrompt } from '../prompts/systemPrompt';
import type { ChatMessage, SearchResult } from '../types';
import { 
  sommaireUnifie, 
  sommaireParSource,
  type SectionIndex
} from '../../data/sommaireUnifie';
import { chapitres } from '../../data/temps';
import { formation } from '../../data/formation';
import { teletravailData } from '../../data/teletravail';

// ========================
// ÉTAPE 1 : Localiser la section
// ========================

/**
 * Génère le contexte léger du sommaire (titres + mots-clés uniquement)
 */
function buildSommaireContext(): string {
  const lines: string[] = ['=== SOMMAIRE DES DOCUMENTS INTERNES ===\n'];

  // TEMPS DE TRAVAIL
  lines.push('📋 TEMPS DE TRAVAIL (temps.ts):');
  sommaireParSource.temps.forEach((s: SectionIndex) => {
    lines.push(`  - [${s.id}] ${s.titre}`);
    lines.push(`    Mots-clés: ${s.motsCles.join(', ')}`);
  });
  lines.push('');

  // FORMATION
  lines.push('📚 FORMATION (formation.ts):');
  sommaireParSource.formation.forEach((s: SectionIndex) => {
    lines.push(`  - [${s.id}] ${s.titre}`);
    lines.push(`    Mots-clés: ${s.motsCles.join(', ')}`);
  });
  lines.push('');

  // TÉLÉTRAVAIL
  lines.push('🏠 TÉLÉTRAVAIL (teletravail.ts):');
  sommaireParSource.teletravail.forEach((s: SectionIndex) => {
    lines.push(`  - [${s.id}] ${s.titre}`);
    lines.push(`    Mots-clés: ${s.motsCles.join(', ')}`);
  });

  return lines.join('\n');
}

/**
 * Étape 1 : Demande à l'API d'identifier la ou les sections pertinentes
 */
async function locateSections(question: string): Promise<string[]> {
  const sommaireContext = buildSommaireContext();
  const systemPrompt = buildLocationSystemPrompt(sommaireContext);

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Question de l'agent: "${question}"\n\nQuelles sections contiennent cette information ? Réponds avec les IDs.` }
  ];

  try {
    const reply = await callPerplexityAPI(messages, true);
    console.log('[UnifiedSearch] Réponse API localisation:', reply);
    
    // Extraire les IDs de section de la réponse
    const idMatches = reply.match(/\[([a-z_0-9]+)\]/gi) || [];
    const sectionIds = idMatches
      .map(m => m.replace(/[\[\]]/g, ''))
      .filter(id => sommaireUnifie.some(s => s.id === id));
    
    console.log('[UnifiedSearch] Sections extraites:', sectionIds);
    return sectionIds;
  } catch (err) {
    console.error('Erreur localisation sections:', err);
    return [];
  }
}

// ========================
// ÉTAPE 2 : Charger le contenu ciblé
// ========================

/**
 * Charge le contenu d'une section spécifique depuis les fichiers sources
 */
function getSectionContent(sectionId: string): string | null {
  const section = sommaireUnifie.find(s => s.id === sectionId);
  if (!section) return null;

  switch (section.source) {
    case 'temps': {
      const chapitre = section.chapitre;
      if (chapitre && chapitre >= 1 && chapitre <= 4) {
        return chapitres[chapitre as keyof typeof chapitres];
      }
      return Object.values(chapitres).join('\n\n---\n\n');
    }
    
    case 'formation':
      return formation;
    
    case 'teletravail':
      return teletravailData;
    
    default:
      return null;
  }
}

/**
 * Charge le contenu des sections identifiées
 */
function loadSectionsContent(sectionIds: string[]): string {
  if (sectionIds.length === 0) return '';
  
  const contents: string[] = [];
  const loadedSources = new Set<string>();
  
  for (const sectionId of sectionIds) {
    const section = sommaireUnifie.find(s => s.id === sectionId);
    if (!section) continue;
    
    // Éviter de charger plusieurs fois le même contenu
    const sourceKey = section.source === 'temps' ? `temps_ch${section.chapitre}` : section.source;
    if (loadedSources.has(sourceKey)) continue;
    loadedSources.add(sourceKey);
    
    const content = getSectionContent(sectionId);
    if (content) {
      const titre = section.titre || sectionId;
      contents.push(`=== ${titre.toUpperCase()} ===\n${content}`);
    }
  }
  
  return contents.join('\n\n---\n\n');
}

/**
 * Étape 2 : Répondre à la question avec le contenu ciblé
 */
async function answerWithContent(
  question: string,
  sectionContent: string,
  history?: ChatMessage[]
): Promise<string> {
  const systemPrompt = buildStrictSystemPrompt(sectionContent);
  
  const messages: ChatMessage[] = [{ role: 'system', content: systemPrompt }];
  
  if (history?.length) {
    messages.push(...history);
  }
  
  messages.push({ role: 'user', content: question });
  
  return await callPerplexityAPI(messages, true);
}

// ========================
// RECHERCHE UNIFIÉE PRINCIPALE
// ========================

/**
 * Recherche unifiée en 2 étapes :
 * 1. Localise la section via le sommaire léger
 * 2. Charge le contenu ciblé et génère la réponse
 * 
 * @param question - La question de l'utilisateur
 * @param history - L'historique de conversation (optionnel)
 * @returns La réponse avec métadonnées
 */
export async function unifiedSearch(
  question: string,
  history?: ChatMessage[]
): Promise<SearchResult> {
  console.log('[UnifiedSearch] Étape 1: Localisation des sections...');
  
  // ÉTAPE 1 : Localiser les sections pertinentes
  const sectionIds = await locateSections(question);
  console.log('[UnifiedSearch] Sections identifiées:', sectionIds);
  
  if (sectionIds.length === 0) {
    return {
      answer: "Je ne trouve pas cette information dans nos documents internes.",
      sectionsUsed: [],
      tokensOptimized: true
    };
  }
  
  // ÉTAPE 2 : Charger le contenu ciblé
  console.log('[UnifiedSearch] Étape 2: Chargement du contenu ciblé...');
  const content = loadSectionsContent(sectionIds);
  
  if (!content) {
    return {
      answer: "Je ne trouve pas cette information dans nos documents internes.",
      sectionsUsed: sectionIds,
      tokensOptimized: true
    };
  }
  
  // ÉTAPE 3 : Générer la réponse avec le contenu ciblé
  console.log('[UnifiedSearch] Génération de la réponse...');
  const answer = await answerWithContent(question, content, history);
  
  return {
    answer,
    sectionsUsed: sectionIds,
    tokensOptimized: true
  };
}

/**
 * Version simplifiée qui retourne juste le texte de réponse
 */
export async function searchInternalDocs(
  question: string,
  history?: ChatMessage[]
): Promise<string> {
  const result = await unifiedSearch(question, history);
  return result.answer;
}

/**
 * Recherche avec extraction de nombre (pour les questions comme "combien de jours")
 */
export async function searchInternalDocsWithNumber(
  question: string,
  history?: ChatMessage[]
): Promise<{ text: string; number: number | null; sectionsUsed: string[] }> {
  const result = await unifiedSearch(question, history);
  
  const match = result.answer.match(/(\d{1,3})/);
  const number = match ? parseInt(match[1], 10) : null;
  
  return {
    text: result.answer,
    number,
    sectionsUsed: result.sectionsUsed
  };
}
