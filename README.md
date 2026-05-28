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
mkdir -p .claude/commands && curl -sL https://raw.githubusercontent.com/Docteur-Code/docteur-code-skill/main/.claude/commands/docteur-code.md -o .claude/commands/docteur-code.md
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
| Setup Claude Code   | 22%   | CLAUDE.md, hooks, skills installés                       |
| Sécurité            | 18%   | Secrets dans git, .env, dépendances, auth, observabilité |
| Architecture        | 15%   | Lockfiles, modularité, séparation back/front             |
| Phase de création   | 15%   | Tests, linter, pre-commit hooks                          |
| Déploiement         | 12%   | CI/CD, migrations BDD, environnements                    |
| Gestion haut niveau | 10%   | Git, remote, branches, .gitignore                        |
| Bugs fonctionnels   | 8%    | Console.log oubliés, type safety                         |

Le scan détecte automatiquement environ 80% des points. Les 20% restants (comportement avec Claude Code, bugs bloquants ressentis) font l'objet de 4 questions simples.

---

## Output

Un fichier `docteur-code-bilan.html` autonome, ouvrable dans n'importe quel navigateur. Il contient :

- Score global sur 100 et niveau de santé
- Visualisation de l'échelle des 4 niveaux
- Détail par catégorie avec barres de progression
- **Ordonnance** : les 3 actions prioritaires à appliquer
- CTA vers la consultation complète

Le HTML est standalone : pas de dépendance externe, pas de tracker. Vous pouvez le partager ou l'archiver.

---

## Pourquoi cette skill ?

La plupart des projets buildés avec l'IA finissent en code spaghetti. Pas par incompétence, mais parce qu'on apprend en faisant - et qu'on n'a pas toujours le bon retour au bon moment.

Cette skill donne un retour objectif en 5 minutes. Pas pour juger, mais pour montrer où sont les leviers prioritaires.

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
