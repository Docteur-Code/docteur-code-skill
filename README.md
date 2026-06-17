# Docteur Code - Bilan de santé express

> Le check-up rapide pour les créateurs qui buildent avec l'IA (Cursor, Claude Code, Bolt, etc.).

Une skill pour Claude Code qui scanne votre projet, vous pose quelques questions, et produit un bilan visuel de la santé de votre code avec votre niveau actuel et 3 actions prioritaires.

C'est la version publique du bilan Docteur Code. La consultation complète (analyse approfondie, roadmap personnalisée, accompagnement) est disponible sur [docteur-code.fr](https://docteur-code.fr).

---

## L'échelle de santé

| Niveau | Nom             | Score  | Description                                                    |
| ------ | --------------- | ------ | -------------------------------------------------------------- |
| 1      | Soins intensifs | 0-25   | Projet en danger. Bugs en cascade, l'IA tourne en rond.        |
| 2      | Sous traitement | 26-50  | Tient debout à coups de patchs. Bonnes pratiques inconstantes. |
| 3      | Bonne santé     | 51-75  | Projet stable, process en place. Reste des optimisations.      |
| 4      | Pleine forme    | 76-100 | Workflow pro, code maintenable, factures Claude maîtrisées.    |

La plupart des projets vibe-codés se situent entre les niveaux 1 et 3. Le niveau 4 demande de la discipline.

---

## Installation

**En une commande.** Lancez ceci à la racine d'un projet utilisant Claude Code :

```bash
mkdir -p .claude/commands && \
  curl -fL https://raw.githubusercontent.com/Docteur-Code/docteur-code-skill/main/.claude/commands/docteur-code.md \
    -o .claude/commands/docteur-code.md && \
  echo "" && \
  echo "Skill installée dans .claude/commands/docteur-code.md" && \
  echo "Lance /docteur-code dans Claude Code pour démarrer le bilan."
```

Ou clonez le repo et copiez la commande :

```bash
git clone https://github.com/Docteur-Code/docteur-code-skill.git
cp docteur-code-skill/.claude/commands/docteur-code.md /chemin/vers/votre/projet/.claude/commands/
```

---

## Utilisation

Dans Claude Code, à la racine d'un projet :

```
/docteur-code
```

La skill va :

1. **Scanner** silencieusement votre projet (~30 secondes)
2. **Poser** 4 questions sur votre usage de Claude Code
3. **Calculer** votre score global et par catégorie
4. **Générer** un bilan HTML standalone et l'ouvrir dans le navigateur

---

## Ce qui est évalué

7 catégories pondérées :

| Catégorie           | Poids | Ce qui est vérifié                                       |
| ------------------- | ----- | -------------------------------------------------------- |
| Setup Claude Code   | 22%   | CLAUDE.md, hooks, skills, serveurs MCP, agents personnalisés |
| Sécurité            | 18%   | Secrets, .env, dépendances, auth, contrôle d'accès aux données (RLS), clés côté client, rate limiting |
| Architecture        | 15%   | Lockfile, modularité, séparation des responsabilités, validation des données, accès BDD |
| Phase de création   | 15%   | Tests, linter, formatage, vérification de types, pre-commit hooks |
| Déploiement         | 12%   | CI/CD bloquant, migrations BDD, staging, rollback, alerting |
| Gestion haut niveau | 10%   | Git, remote, branches, .gitignore, README/docs, messages de commit structurés |
| Bugs fonctionnels   | 8%    | Console.log oubliés, type safety, gestion des erreurs    |

Le scan détecte automatiquement environ 80% des points. Les 20% restants (comportement avec Claude Code, bugs bloquants ressentis) font l'objet de 4 questions simples.

**Garde-fous critiques.** Certains manques sont trop graves pour être compensés par le reste : secrets exposés dans git, absence de pipeline CI/CD, ou code sans aucune sauvegarde distante. Si l'un d'eux est détecté, le score de sa catégorie est plafonné à 50/100. Un script de déploiement manuel n'est pas considéré comme du CI/CD : le bilan vise les standards de 2026, sans complaisance.

---

## Output

### Bilans et historique

Les bilans sont stockés dans `./.claude/docteur-code/bilans/` avec un **timestamp horodaté** :
- Format : `bilan-YYYY-MM-DDTHH-mm-ss.html` (ex: `bilan-2025-06-16T14-32-47.html`)
- Permet de relancer la skill plusieurs fois dans la journée
- Chaque bilan est autonome, ouvrable dans n'importe quel navigateur

Un fichier `./.claude/docteur-code/progress.json` track l'historique :
```json
{
  "bilans": [
    { "timestamp": "2025-06-12T09-15-32", "score": 42, "niveau": 2 },
    { "timestamp": "2025-06-16T14-32-47", "score": 52, "niveau": 3 }
  ]
}
```

Cet historique permet de visualiser votre progression dans le temps. Chaque bilan affiche :

- **Score global** sur 100 et niveau de santé
- **Visualisation** de l'échelle des 4 niveaux
- **Détail par catégorie** avec barres de progression
- **Ordonnance** : les 3 actions prioritaires avec :
  - **Pourquoi c'est important** : explication concrète sans jargon
  - **Étapes détaillées** : à quoi ça ressemble maintenant, les commandes copiables, comment valider
  - **Checkboxes** : pour tracker visuellement votre progression
- **CTA** vers la consultation complète

Le HTML est standalone : pas de dépendance externe, pas de tracker. Vous pouvez le partager ou l'archiver.

---

## Pourquoi cette skill ?

La plupart des projets buildés avec l'IA finissent en code spaghetti. Pas par incompétence, mais parce qu'on apprend en faisant - et qu'on n'a pas toujours le bon retour au bon moment.

Cette skill donne un retour objectif en 5 minutes. Pas pour juger, mais pour montrer où sont les leviers prioritaires.

**L'ordonnance est activable** : chaque recommandation explique le **pourquoi** (en termes simples), montre l'**état actuel**, et propose des **étapes copiables avec validation**. L'objectif est qu'un novice puisse les exécuter sans connaissance préalable.

Le scan ne remplace pas l'expertise humaine sur des décisions d'architecture, l'analyse qualitative du code, ou le déblocage de bugs complexes. C'est précisément ce que couvre la [consultation complète](https://docteur-code.fr).

---

## Consultation complète

Si le bilan révèle des zones critiques, ou si vous voulez aller plus loin :

- **Audit complet** : 2h30 / 390 €
- **Diagnostic approfondi**, roadmap personnalisée, premières pistes actionnables
- **Garantie** : remboursé si aucune piste concrète identifiée
- Possibilité d'enchaîner sur un **accompagnement** (déblocage, déspaghettisation, optimisation Claude)

[Réserver →](https://docteur-code.fr)

---

## Licence

MIT - utilisez, forkez, partagez.

---

## À propos

Créé par Docteur Code. Spécialisé dans l'accompagnement des créateurs qui buildent avec l'IA mais qui n'ont pas de background tech.

[docteur-code.fr](https://docteur-code.fr)
