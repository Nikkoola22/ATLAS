# 10 questions pour tester le système de recherche ATLAS

## Questions pour tester le chapitre TEMPS DE TRAVAIL (Chapitre 1-4)

1. **Combien d'heures de travail par semaine ?**
   - Attendu: Chapitre 1 - Temps de travail
   - Teste: Durée légale, 1607h

2. **J'ai droit à combien de jours de congés par an ?**
   - Attendu: Chapitre 2 - Les congés
   - Teste: Congés annuels, ARTT, jours ouvrés

3. **J'ai droit à combien de jours pour mon mariage ?**
   - Attendu: Chapitre 3 - Autorisations spéciales d'absence
   - Teste: Mariage, PACS, 7 jours

4. **Comment fonctionne la journée de solidarité ?**
   - Attendu: Chapitre 1 - Temps de travail
   - Teste: Jour supplémentaire, récupération

## Questions pour tester le chapitre FORMATION (Chapitre 5)

5. **Comment fonctionne le CPF ?**
   - Attendu: Chapitre 5 - Formation
   - Teste: Compte Personnel de Formation, droits

6. **Puis-je faire une VAE ?**
   - Attendu: Chapitre 5 - Formation
   - Teste: Validation des Acquis de l'Expérience

7. **J'ai droit à la formation ?**
   - Attendu: Chapitre 5 - Formation
   - Teste: Droit à la formation, agents stagiaires/titulaires

## Questions pour tester le chapitre TÉLÉTRAVAIL (Chapitre 6)

8. **Combien de jours de télétravail par mois ?**
   - Attendu: Chapitre 6 - Télétravail
   - Teste: Durée autorisation, forfait annuel, 3 jours max

9. **Peut-on travailler depuis le domicile ?**
   - Attendu: Chapitre 6 - Télétravail
   - Teste: Domicile, travail à distance

10. **Comment demander le télétravail ?**
    - Attendu: Chapitre 6 - Télétravail
    - Teste: Procédure de demande, écrit, modalités

---

## 🎯 Questions pour tester les améliorations

### Test de disambiguation
- **"Comment utiliser mon CPF"** vs **"Combien d'heures par an"**
  - CPF devrait aller vers Formation, pas Temps

- **"Combien de jours de télétravail"** vs **"Combien de jours de congés"**
  - Télétravail → Chapitre 6, Congés → Chapitre 2

### Test de synonymes
- **"Puis-je faire du travail à distance ?"** → Devrait détecter "télétravail"
- **"Peut-on faire de l'apprentissage ?"** → Devrait détecter "formation"

### Test de précision
- **"Qu'est-ce que le CET ?"** → Chapitre 2 (Congés), pas autre chose
- **"J'ai droit à des jours pour garde d'enfant malade ?"** → Chapitre 3 (Autorisations)

---

## 📊 Résultats attendus

### Suite aux corrections apportées :
- ✅ Scoring pondéré : Keywords × 3, Articles × 2
- ✅ Booster domain-spécifique : × 3 pour CPF, VAE, télétravail, etc.
- ✅ Synonymes enrichis pour meilleure compréhension

### Précision attendue :
- Chapitres spécifiques : **95%+** (au lieu de 74%)
- Distinction FORMATION vs TEMPS : **~100%**
- Distinction TÉLÉTRAVAIL vs TEMPS : **~100%**

---

## 🚀 Comment tester

```bash
# Lancer les services
npm run dev

# Ouvrir http://localhost:5174/
# Poser les 10 questions dans le chatbot
# Vérifier que les bonnes réponses sont données
```

