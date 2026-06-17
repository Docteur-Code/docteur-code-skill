---
description: Bilan de santé express de votre projet codé avec l'IA. Diagnostic en 5 minutes.
version: 1.7.0
---

# Docteur Code - Bilan de santé express

**Version : 1.7.0**

Le check-up rapide pour les créateurs qui buildent avec l'IA (Cursor, Claude Code, Bolt, etc.).

Cette skill scanne votre projet, vous pose quelques questions complémentaires, et produit un diagnostic visuel avec votre niveau de santé du code et 3 actions prioritaires à mener.

C'est la version publique du bilan Docteur Code. La consultation complète (avec analyse approfondie, roadmap personnalisée et accompagnement) est disponible sur réservation.

---

## Comment ça marche

```
Phase 1 : Scan de l'environnement  →  Phase 2 : 4 questions  →  Phase 3 : Diagnostic + HTML
   (automatique, silencieux)         (comportementales)         (score + niveau + ordonnance)
```

---

## L'échelle de santé du code

| Niveau | Nom | Score | Description |
|--------|-----|-------|-------------|
| 1 | Soins intensifs | 0-25 | Projet en danger. Bugs en cascade, l'IA tourne en rond. Sans intervention, ça empire. |
| 2 | Sous traitement | 26-50 | Projet qui tient debout à coups de patchs. Quelques bonnes pratiques mais inconstantes. |
| 3 | Bonne santé | 51-75 | Projet stable, process en place. Reste des optimisations à faire. |
| 4 | Pleine forme | 76-100 | Workflow pro, code maintenable, factures Claude maîtrisées. |

---

## Phase 1 : Scan de l'environnement

Scanner silencieusement le projet courant. Ne **pas** demander d'autorisation pour chaque vérification. Lire ce qui est disponible et inférer.

Pour chaque point ci-dessous, déterminer un score de **0 (absent/mauvais)**, **1 (partiel)**, **2 (correct)**, **3 (excellent)**, ou **N/A** (le point ne s'applique pas à ce type de projet).

Toutes les vérifications sont à faire avec les outils Bash et Read. Aucune écriture pour l'instant.

### Catégorie 1 - Setup & utilisation Claude Code (poids 22%)

```
1. CLAUDE.md à la racine   [GARDE-FOU CRITIQUE]
   - Vérifier : CLAUDE.md, .claude/CLAUDE.md, ~/.claude/CLAUDE.md
   - 0 = absent
   - 1 = présent mais < 20 lignes
   - 2 = 20-100 lignes avec sections (archi, commandes, conventions)
   - 3 = 100+ lignes, références à memory, hooks, agents

2. Hooks installés
   - Vérifier : .claude/settings.json (section hooks)
   - 0 = aucun hook
   - 1 = 1-2 hooks basiques
   - 2 = 3+ hooks dont au moins un PreToolUse ou PostToolUse
   - 3 = hooks avancés, dont au moins un d'optimisation (économie de tokens, formatage auto, lint à la volée)

3. Skills/Commands installés
   - Vérifier : .claude/commands/ ET .claude/skills/
   - 0 = aucun
   - 1 = 1-2 skills basiques (< 20 lignes)
   - 2 = 3-5 skills
   - 3 = 6+ skills incluant des skills adaptés au stack (Supabase, React Native, etc.)

4. Serveurs MCP configurés
   - Les serveurs MCP connectent Claude à tes outils externes (base de données,
     Notion, GitHub, n8n, etc.) pour qu'il agisse directement dessus.
   - Vérifier : .mcp.json, ou la section mcpServers dans .claude/settings.json / ~/.claude/settings.json
   - N/A = projet où aucun outil externe n'est pertinent (script isolé)
   - 0 = aucun serveur MCP configuré
   - 2 = 1-2 serveurs MCP connectés
   - 3 = plusieurs serveurs MCP adaptés au stack (BDD, gestion de projet, déploiement…)

5. Subagents / agents personnalisés
   - Les agents personnalisés délèguent des tâches spécialisées (revue de code,
     recherche, tests) à des assistants dédiés, en parallèle.
   - Vérifier : .claude/agents/, ou ~/.claude/agents/
   - 0 = aucun agent personnalisé
   - 2 = 1-2 agents définis
   - 3 = plusieurs agents spécialisés et adaptés au workflow
```

### Catégorie 2 - Sécurité (poids 18%)

```
6. Secrets dans git history   [GARDE-FOU CRITIQUE]
   - Exécuter : git log --all --full-history -p 2>/dev/null | grep -iE "(api[_-]?key|secret|password|token|bearer)" | head -50
   - 0 = secrets trouvés dans l'historique
   - 3 = aucun secret trouvé
   - Vérifier aussi : grep -rE "(sk-[a-zA-Z0-9]{20,}|api_key.*=.*['\"][a-zA-Z0-9]{20,})" --include="*.js" --include="*.ts" --include="*.py" .

7. .env présent ET ignoré par git   [GARDE-FOU CRITIQUE]
   - Vérifier : .env existe + .env dans .gitignore
   - 0 = .env présent ET non ignoré (CRITIQUE)
   - 1 = pas de .env du tout (variables hardcodées probablement)
   - 2 = .env présent et ignoré, mais pas de .env.example
   - 3 = .env + .env.example + correctement gitignored

8. Dépendances auditées
   - Exécuter selon stack : npm audit --json 2>/dev/null, ou pip-audit, ou bundle audit
   - 0 = vulnérabilités HIGH/CRITICAL trouvées
   - 1 = MODERATE warnings nombreux
   - 2 = quelques LOW
   - 3 = clean ou near-clean

9. Authentification via solution éprouvée
   - Grep package.json pour : @supabase/supabase-js, @clerk/clerk-react, next-auth, @auth0/, passport, lucia-auth
   - 0 = système d'auth maison détecté (routes /login/register custom sans librairie reconnue)
   - 1 = bcrypt seul (auth basique)
   - 3 = librairie d'auth reconnue présente
   - N/A = pas de système d'auth nécessaire (site statique)

10. Observabilité présente
   - Grep package.json pour : @sentry/, winston, pino, datadog, logrocket, posthog
   - 0 = aucune (console.log partout)
   - 2 = logger structuré présent
   - 3 = error tracking (Sentry) + logger

11. Contrôle d'accès aux données (autorisation / RLS)   [GARDE-FOU CRITIQUE]
   - Le plus gros risque des apps vibe-codées : une base ouverte où n'importe qui
     peut lire/écrire les données de tous les utilisateurs.
   - Vérifier selon le stack :
     - Supabase : policies RLS dans supabase/migrations (RLS activé + create policy),
       et que la clé service_role n'est PAS utilisée côté client
     - Firebase : firestore.rules / storage.rules non permissifs (pas de `allow read, write: if true`)
     - Backend custom : middleware d'autorisation sur les routes qui accèdent aux données
   - N/A = pas de données utilisateur à protéger (site purement statique, pas de BDD)
   - 0 = base ouverte / aucune règle d'autorisation (accès total possible)
   - 1 = autorisation partielle (certaines tables ou routes protégées, d'autres non)
   - 2 = autorisation en place sur l'essentiel
   - 3 = autorisation systématique (RLS activé partout, ou contrôle serveur complet)

12. Clés sensibles non exposées côté client   [GARDE-FOU CRITIQUE]
    - Une clé secrète (service_role Supabase, clé API privée, secret serveur) ne doit
      JAMAIS se retrouver dans le code qui tourne dans le navigateur.
    - Vérifier : grep -rE "service_role|sk-live|sk_live|-----BEGIN" dans src/ client/ app/,
      variables NEXT_PUBLIC_* / VITE_* / EXPO_PUBLIC_* contenant un secret, clés en dur
    - 0 = au moins une clé secrète exposée côté client
    - 3 = aucune clé sensible côté client (seulement des clés publiques/anon prévues pour ça)

13. Rate limiting / protection contre les abus
    - Limiter le nombre de requêtes protège tes endpoints (login, API) du brute-force
      et des abus automatisés.
    - Vérifier les dépendances : express-rate-limit, @upstash/ratelimit, rate-limiter-flexible,
      slowapi (Python), ou protection au niveau hébergeur/proxy (Cloudflare, Vercel)
    - N/A = pas d'API ni d'authentification exposées (site purement statique)
    - 0 = aucune limite (endpoints exposés sans protection)
    - 2 = rate limiting sur les endpoints sensibles (auth)
    - 3 = rate limiting généralisé + protection anti-abus (captcha/WAF si pertinent)
```

### Catégorie 3 - Architecture du code (poids 15%)

```
14. Lockfile / reproductibilité
   - Vérifier : présence de package-lock.json / yarn.lock / pnpm-lock.yaml / poetry.lock / Pipfile.lock
   - 0 = pas de lockfile (les versions installées varient d'une machine à l'autre)
   - 2 = lockfile présent
   - 3 = lockfile + mise à jour automatisée des dépendances (dependabot.yml ou renovate.json)

15. Modularité du code   [GARDE-FOU CRITIQUE]
    - Compter : find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.py" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -exec wc -l {} \; | sort -rn | head -5
    - En 2026, l'IA génère facilement des fichiers énormes : être strict.
    - 0 = au moins 1 fichier > 1000 lignes (fichier géant, ingérable)
    - 1 = au moins 1 fichier entre 600 et 1000 lignes
    - 2 = tout sous 600 lignes, mais quelques fichiers entre 300 et 600
    - 3 = tout sous ~300 lignes, découpage clair par responsabilité

16. Séparation des responsabilités
    - La logique métier, l'accès aux données et l'affichage doivent vivre dans des
      fichiers/dossiers distincts, pas mélangés dans les mêmes fichiers.
    - Vérifier la structure : dossiers séparés (api/, server/, services/, lib/ vs
      components/, pages/, ui/). En monolithe (Next.js), routes API isolées dans /api.
    - N/A = projet purement statique sans logique
    - 0 = tout est mélangé (logique métier directement dans les composants d'affichage)
    - 1 = séparation partielle, beaucoup de mélange subsiste
    - 2 = séparation claire entre affichage et logique, quelques exceptions
    - 3 = séparation nette : affichage, logique métier et accès aux données bien isolés

17. Validation des données en entrée
    - Vérifier les dépendances : zod, yup, joi, valibot, superstruct (JS/TS) ;
      pydantic, marshmallow, cerberus, class-validator (Python/autres)
    - Vérifier aussi que les entrées externes (formulaires, API, paramètres d'URL) sont contrôlées
    - 0 = aucune validation (les données entrent sans aucun contrôle)
    - 2 = une librairie de validation présente et utilisée par endroits
    - 3 = validation systématique des entrées externes (formulaires, API, variables d'env)

18. Couche d'accès aux données structurée
    - Les interactions avec la base passent par une couche dédiée (ORM, query builder,
      ou dossier repository), pas par du SQL brut éparpillé partout.
    - Vérifier les dépendances : prisma, drizzle, typeorm, sequelize, mongoose, kysely
      (JS/TS) ; sqlalchemy, django ORM, peewee (Python)
    - N/A = projet sans base de données
    - 0 = SQL brut dispersé dans le code, sans couche dédiée
    - 2 = ORM ou query builder présent et utilisé
    - 3 = accès aux données centralisé (ORM + couche repository/service claire)
```

### Catégorie 4 - Phase de création du code (poids 15%)

```
19. Tests unitaires
    - Chercher : *.test.*, *.spec.*, __tests__/, tests/, jest.config, vitest.config, pytest.ini,
      et un script "test" réel dans package.json (pas un "echo no test")
    - En 2026, l'IA génère du code en masse : sans tests, rien ne garantit qu'il marche encore après chaque modification. Être strict.
    - 0 = aucun test, ou seulement un script de test bidon
    - 1 = quelques tests épars, ratio test/code < 10 %
    - 2 = tests présents sur une bonne partie du code, lançables par une commande
    - 3 = tests fournis + couverture mesurée avec un seuil minimal exigé

20. Linter configuré
    - Un linter analyse ton code et signale les erreurs et les mauvaises pratiques au fil de l'écriture.
    - Vérifier : .eslintrc* / eslint.config.*, biome.json (linter), ruff.toml / [tool.ruff] dans pyproject.toml, .flake8
    - 0 = aucun linter
    - 1 = config de linter présente mais quasi vide (règles par défaut désactivées)
    - 2 = linter configuré avec un vrai jeu de règles
    - 3 = linter configuré + script "lint" dans package.json (vérifiable en une commande)

21. Formatage de code imposé
    - Un formateur applique automatiquement la même mise en forme à tout le code, pour qu'il reste lisible et cohérent d'un fichier à l'autre.
    - Vérifier : .prettierrc* / prettier dans package.json, biome.json (section formatter), [tool.ruff.format] ou black dans pyproject.toml (un simple .editorconfig ne suffit pas)
    - 0 = aucun formateur configuré
    - 2 = formateur présent (configuration détectée)
    - 3 = formateur + script de formatage dans package.json (format / format:check) appliqué à tout le projet

22. Vérification de types dans les scripts
    - Activer le mode strict ne sert à rien si personne ne lance jamais la vérification des types : beaucoup d'outils de build ignorent les erreurs de type.
    - Vérifier un script dédié dans package.json : tsc --noEmit, vue-tsc, svelte-check, astro check, ou un outil équivalent (mypy, pyright en Python)
    - N/A = projet sans typage statique (JavaScript pur sans tsconfig, et aucun outil de typage)
    - 0 = aucune commande de vérification des types
    - 2 = une commande de vérification des types existe (script typecheck / check)
    - 3 = vérification des types lancée automatiquement à chaque modification (intégration continue)

23. Pre-commit hooks
    - Un hook pre-commit lance des vérifications automatiques juste avant chaque enregistrement, et bloque ce qui ne va pas.
    - Vérifier : .husky/, lefthook.yml, .pre-commit-config.yaml, simple-git-hooks dans package.json
    - 0 = aucun hook pre-commit
    - 1 = hook présent mais vide, ou qui ne lance aucune vérification utile
    - 2 = hook qui lance au moins le linter ou le formateur sur le code modifié
    - 3 = hook qui lance lint + formatage + tests (ou vérification des types) avant chaque enregistrement
```

### Catégorie 5 - Déploiement (poids 12%)

```
24. Pipeline CI/CD réel (automatisé et bloquant)   [GARDE-FOU CRITIQUE]
    - IMPORTANT : un script de déploiement manuel (deploy.sh, SCP, restart systemd,
      cron) n'est PAS du CI/CD. Le CI/CD est un pipeline AUTOMATIQUE déclenché par
      un push ou une PR, qui teste avant de livrer.
    - Vérifier : .github/workflows/*.yml NON VIDES, .gitlab-ci.yml, .circleci/config.yml,
      et que le pipeline exécute réellement des étapes (tests / lint / build / deploy)
    - 0 = aucun pipeline, OU dossier workflows présent mais vide, OU uniquement un script manuel
    - 1 = pipeline présent mais ne fait que builder (ne lance ni tests ni lint)
    - 2 = pipeline qui lance les tests OU le lint sur push/PR
    - 3 = pipeline qui lance tests + lint ET bloque le merge/déploiement en cas d'échec

25. Migrations BDD
    - Vérifier : dossiers migrations/, prisma/migrations/, supabase/migrations/, alembic/versions/
    - N/A = pas de BDD
    - 0 = pas de migrations versionées mais BDD présente
    - 3 = migrations versionnées et présentes

26. Environnements distincts (dev / staging / prod)
    - Un environnement de staging (préproduction) pour tester avant la vraie prod
      est le standard moderne. Le simple dev/prod ne suffit plus.
    - Vérifier : .env.production / .env.staging / .env.development, scripts
      deploy:staging vs deploy:prod, branches ou projets d'environnement distincts
    - 0 = un seul environnement (tu testes directement en prod)
    - 1 = séparation dev/prod basique, mais pas de staging
    - 2 = staging présent, ou séparation dev/staging/prod partielle
    - 3 = dev + staging + prod distincts et réellement utilisés

27. Rollback / retour arrière
    - Capacité à revenir rapidement à la version précédente si un déploiement casse.
    - Vérifier : script de rollback, tags de version / releases, déploiement par image
      versionnée (Docker), ou procédure de rollback documentée
    - N/A = site purement statique régénéré à chaque build (revenir en arrière est trivial)
    - 0 = aucun moyen de revenir en arrière (réparation manuelle dans l'urgence)
    - 2 = rollback possible ou documenté (redéployer un tag/commit précédent à la main)
    - 3 = rollback automatisé (déclenché sur échec d'un health check, ou commande dédiée)

28. Alerting de déploiement
    - Être prévenu automatiquement du succès ou de l'échec d'un déploiement, sans
      avoir à lire les logs SSH à la main.
    - Vérifier : intégrations Slack / Telegram / Discord / email dans le pipeline ou
      le script de deploy, monitoring d'uptime, health checks, webhooks
    - 0 = aucune notification (il faut regarder les logs manuellement)
    - 2 = notification de base sur échec, ou monitoring d'uptime externe
    - 3 = notifications succès + échec, et monitoring/alerting actif
```

### Catégorie 6 - Gestion haut niveau (poids 10%)

```
29. Utilisation de Git
    - Git enregistre l'historique de ton projet ; un historique vivant montre un travail suivi et traçable.
    - Exécuter : git log --oneline | wc -l (nombre de commits), puis git log --oneline | head -20 (qualité des messages)
    - 0 = < 5 commits, ou messages vides et génériques ("update", "wip", "fix")
    - 1 = 5-20 commits, messages souvent peu parlants
    - 2 = 20-100 commits avec des messages compréhensibles
    - 3 = 100+ commits, messages clairs et descriptifs qui expliquent le pourquoi du changement

30. Push sur un remote   [GARDE-FOU CRITIQUE]
    - Exécuter : git remote -v
    - 0 = aucun remote (le code n'existe qu'en local, aucune sauvegarde)
    - 3 = remote présent (github/gitlab/etc.)

31. Branches séparées
    - Travailler sur des branches dédiées garde ta version principale stable pendant que tu développes.
    - Exécuter : git branch -a | wc -l, et observer si le travail passe par des branches puis des fusions
    - 0 = uniquement main/master (tout le travail directement sur la branche principale)
    - 1 = une ou deux branches, mais l'essentiel du travail va droit sur la principale
    - 2 = plusieurs branches de fonctionnalité utilisées régulièrement
    - 3 = chaque changement passe par une branche dédiée puis une fusion (pull request)

32. .gitignore configuré
    - Le fichier .gitignore empêche d'enregistrer ce qui ne doit pas l'être (secrets, fichiers temporaires, dossiers générés).
    - Lire .gitignore et vérifier la présence de : node_modules, .env, dist/, build/, .DS_Store, fichiers de cache
    - 0 = absent, ou présent mais sans .env ni node_modules (l'essentiel manque)
    - 2 = présent avec les essentiels (dépendances, secrets, dossiers générés)
    - 3 = couverture complète et adaptée au stack (caches, logs, fichiers d'environnement, artefacts de build)

33. Documentation du projet (README)
    - Un README explique à quoi sert le projet, comment l'installer et le lancer ; c'est la porte d'entrée pour toi dans six mois comme pour un nouvel arrivant.
    - Vérifier : présence d'un README.md non vide à la racine, et idéalement un dossier docs/ ou des sections claires (installation, usage, configuration)
    - 0 = aucun README, ou fichier quasi vide (un titre seul)
    - 1 = README minimal (quelques lignes, sans instructions d'installation ni d'usage)
    - 2 = README correct : présentation + installation + lancement
    - 3 = documentation soignée : README complet et, si le projet le justifie, dossier docs/ ou guides dédiés

34. Messages de commit structurés
    - Une convention de nommage des enregistrements (par exemple "feat:", "fix:", "docs:") rend l'historique lisible d'un coup d'oeil et permet même de générer des notes de version automatiquement.
    - Exécuter : git log --oneline | head -30 et repérer des préfixes réguliers (feat / fix / chore / docs...)
    - N/A = trop peu de commits pour juger (historique encore très court)
    - 0 = aucune convention, messages écrits au cas par cas
    - 2 = convention suivie sur une bonne partie des enregistrements récents
    - 3 = convention appliquée systématiquement, historique homogène et facile à parcourir
```

### Catégorie 7 - Bugs fonctionnels (poids 8%)

```
35. Console.log de debug oubliés
    - Les messages de débogage et les marqueurs TODO/FIXME laissés dans le code encombrent la version finale et peuvent révéler des détails internes.
    - Exécuter : grep -rE "console\.(log|debug)|debugger|TODO|FIXME|XXX" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" -l 2>/dev/null | wc -l
    - 0 = plus de 30 fichiers concernés
    - 1 = 10 à 30 fichiers
    - 2 = 3 à 10 fichiers
    - 3 = moins de 3 fichiers (code propre)

36. Type safety (si TypeScript)
    - Le mode strict de TypeScript attrape de nombreuses erreurs avant même que le code ne tourne.
    - Vérifier dans tsconfig.json : "strict": true, et l'absence de relâchements ("noImplicitAny": false notamment)
    - N/A = projet JavaScript pur (pas de tsconfig.json)
    - 0 = strict absent, à false, ou tsconfig quasi permissif
    - 1 = strict activé mais contourné par de nombreux `any` ou `@ts-ignore`
    - 2 = strict activé, usage de `any` limité
    - 3 = strict complet, sans implicit any ni contournements éparpillés

37. Gestion des erreurs (pas d'erreurs avalées)
    - Une erreur attrapée puis ignorée (un bloc « catch » vide) masque les pannes : le programme continue comme si de rien n'était alors que quelque chose a échoué en silence.
    - Exécuter : grep -rEn "catch *\([^)]*\) *\{ *\}|catch *\{ *\}|\.catch\(\(\) *=> *\{\}\)|except[^:]*: *pass" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" --include="*.py" 2>/dev/null | wc -l
    - 0 = plusieurs erreurs avalées (blocs vides) dans le code
    - 2 = de rares cas, mais l'essentiel des erreurs est traité ou remonté
    - 3 = aucune erreur avalée : chaque erreur est gérée, journalisée ou remontée
```

---

## Phase 2 : Questions complémentaires

Après le scan, poser **4 questions** simples au user (en français, ton convivial mais direct). Ces questions concernent des points non détectables automatiquement.

**Mode d'interaction :**

- **Si l'outil `AskUserQuestion` est disponible** (Claude Code récent) : l'utiliser pour poser les 4 questions en un seul appel, chacune avec ses options cliquables. C'est l'expérience à privilégier.
- **Sinon** : fallback en texte, poser les 4 questions d'un coup et attendre une réponse libre.

### Format AskUserQuestion (recommandé)

Appeler `AskUserQuestion` avec ces 4 questions, chacune en `multiSelect: false` :

```json
[
  {
    "question": "Quand tu travailles avec Claude (ou Cursor, Bolt...), tu utilises le mode plan avant les tâches complexes ?",
    "header": "Mode plan",
    "multiSelect": false,
    "options": [
      { "label": "Oui souvent", "description": "Tu pars d'un plan validé avant que l'IA touche au code." },
      { "label": "Parfois", "description": "Tu l'utilises quand la tâche te paraît grosse, sinon non." },
      { "label": "Non", "description": "Tu donnes l'instruction et l'IA exécute directement." },
      { "label": "Jamais entendu parler", "description": "Pas de souci, on en parlera dans le bilan." }
    ]
  },
  {
    "question": "Quand tu attaques une grosse tâche, tu la découpes en petites sous-tâches avant de la donner à l'IA ?",
    "header": "Découpage",
    "multiSelect": false,
    "options": [
      { "label": "Oui systématiquement", "description": "Tu listes les étapes avant de lancer l'IA dessus." },
      { "label": "Parfois", "description": "Quand tu sens que ça va déraper sinon." },
      { "label": "Non", "description": "Tu lui donnes la tâche en bloc et tu corriges au fur et à mesure." }
    ]
  },
  {
    "question": "Tu utilises /compact ou /memory pour gérer le contexte sur les longues sessions ?",
    "header": "Contexte",
    "multiSelect": false,
    "options": [
      { "label": "Oui les deux", "description": "Tu connais et tu utilises /compact et /memory." },
      { "label": "Un des deux", "description": "Tu en utilises au moins un régulièrement." },
      { "label": "Non", "description": "Tu laisses le contexte tourner ou tu ouvres une nouvelle session." }
    ]
  },
  {
    "question": "Sur le projet actuel, est-ce que tu as des bugs bloquants que tu n'arrives pas à résoudre ?",
    "header": "Bugs",
    "multiSelect": false,
    "options": [
      { "label": "Oui plusieurs", "description": "Plusieurs trucs cassés qui te freinent au quotidien." },
      { "label": "Oui 1-2", "description": "Un ou deux bugs que tu contournes pour l'instant." },
      { "label": "Non c'est stable", "description": "Pas de bug bloquant identifié." }
    ]
  }
]
```

### Format texte (fallback)

Si `AskUserQuestion` n'est pas dispo, poser les 4 questions d'un coup :

```
1. Quand tu travailles avec Claude (ou Cursor, Bolt...), tu utilises le **mode plan** avant les tâches complexes ? (oui souvent / parfois / non / jamais entendu parler)

2. Quand tu attaques une grosse tâche, tu la **découpes en petites sous-tâches** avant de la donner à l'IA ? (oui systématiquement / parfois / non)

3. Tu utilises **/compact** ou **/memory** pour gérer le contexte sur les longues sessions ? (oui les deux / un des deux / non)

4. Sur le projet actuel, est-ce que tu as des **bugs bloquants** que tu n'arrives pas à résoudre ? (oui plusieurs / oui 1-2 / non c'est stable)
```

### Mapping des réponses sur l'échelle 0-3

- **Q1 mode plan** : jamais entendu parler = 0, non = 0, parfois = 1, oui souvent = 3 → ajouter à Setup Claude Code
- **Q2 découpage** : non = 0, parfois = 2, oui systématiquement = 3 → ajouter à Phase de création
- **Q3 contexte** : non = 0, un des deux = 2, oui les deux = 3 → ajouter à Setup Claude Code
- **Q4 bugs** : oui plusieurs = 0, oui 1-2 = 1, non c'est stable = 3 → ajouter à Bugs fonctionnels

---

## Phase 3 : Calcul du diagnostic

### Score par catégorie

Pour chaque catégorie, calculer :

```
score_categorie = SOMME(score_question × poids_question_implicite) / SOMME(poids × 3) × 100
```

Pour simplifier dans ce contexte public, considérer tous les poids des questions à 1 (pas de pondération intra-catégorie).

Ignorer les N/A : ne pas les compter au numérateur ni au dénominateur.

### Garde-fous critiques (plafonnement)

Certains points sont des **garde-fous critiques** : leur absence représente un risque qu'aucune autre bonne pratique ne compense. Si un garde-fou critique est noté **0**, le score de SA catégorie est **plafonné à 50/100**, même si tout le reste est parfait.

Garde-fous critiques (repérés par `[GARDE-FOU CRITIQUE]` dans le scan) :
- **Setup Claude Code** — Aucun CLAUDE.md (#1) à 0 → Setup plafonné à 50
- **Sécurité** — L'un de ces points à 0 → Sécurité plafonnée à 50 : secrets dans l'historique git (#6), .env exposé (#7), base ouverte / pas de contrôle d'accès (#11), ou clé secrète exposée côté client (#12)
- **Architecture** — Fichier géant > 1000 lignes (Modularité #15 à 0) → Architecture plafonnée à 50
- **Déploiement** — Pipeline CI/CD réel (#24) à 0 → Déploiement plafonné à 50
- **Gestion haut niveau** — Aucun remote / pas de sauvegarde (#30) à 0 → catégorie plafonnée à 50

Appliquer le plafond APRÈS le calcul de `score_categorie`, juste avant le score global : `score_categorie = min(score_categorie, 50)` si un garde-fou de la catégorie est à 0.

### Règle anti-complaisance (TRÈS IMPORTANT)

- **Ne jamais arrondir un score vers le haut.** Un 89 % reste 89 %, jamais 100 %. Tronquer plutôt qu'arrondir.
- **Un script de déploiement manuel n'est PAS du CI/CD.** Un `deploy.sh`, du SCP, un restart systemd ou un cron = score 0 pour le critère #15.
- En cas de doute sur un critère, **choisir le score le plus bas**, pas le plus haut. Le bilan doit être lucide, pas complaisant.
- Le but est de refléter les standards de 2026, pas de rassurer : un projet sans CI/CD, sans staging, sans rollback ni alerting ne peut pas avoir un score de déploiement élevé.

### Score global

```
score_global = SOMME(score_categorie × poids_categorie)
```

Poids catégories :
- Setup Claude Code : 0.22
- Sécurité : 0.18
- Architecture : 0.15
- Phase de création : 0.15
- Déploiement : 0.12
- Gestion haut niveau : 0.10
- Bugs fonctionnels : 0.08

### Niveau de santé

```
0-25  → Soins intensifs
26-50 → Sous traitement
51-75 → Bonne santé
76-100 → Pleine forme
```

### Phase 3a : Charger et évaluer les chaînes de conséquence (NEW)

1. Charger le fichier `./.claude/commands/docteur-code-consequences.json`
2. Pour chaque diagnostic à score 0-1 :
   - Récupérer son entrée correspondante (champs `why_matters` et `consequences`)
   - Évaluer la pertinence selon Phase 2 :
     - Si l'utilisateur signale des bugs → les conséquences liées aux tests et à la fiabilité pèsent plus lourd
     - Si l'utilisateur signale des coûts Claude → les conséquences liées au setup et à la productivité pèsent plus lourd
     - Si l'utilisateur signale des problèmes de déploiement → les conséquences liées au CI/CD et au déploiement pèsent plus lourd
   - Calculer un score de sévérité (0-10) basé sur : impact à long terme + pertinence Phase 2 + faisabilité de la solution
3. Stocker chaque diagnostic avec son score de sévérité, son `why_matters` et ses trois conséquences

### Phase 3b : Sélectionner les 3 quick wins enrichis

Identifier les 3 questions où :
1. Le score est à 0 ou 1
2. Le score de sévérité conséquence est >= 7 (conséquence avec un fort impact à long terme)
3. OU la conséquence correspond directement à un problème signalé en Phase 2
4. L'action est rapide à mettre en œuvre (< 30 min)

Trier par :
1. Score de sévérité conséquence (décroissant)
2. Poids de la catégorie (décroissant)
3. Difficulté d'implémentation (croissant)

Pour chaque quick win sélectionné, créer une structure enrichie :

```json
{
  "id": "recommendation_id",
  "title": "Titre court (7-10 mots max)",
  "benefit": "Ce que l'utilisateur gagne concrètement (ex: 'Tes secrets restent privés')",
  "severity": "CRITICAL|MAJOR|MINOR",
  "category": "Nom de la catégorie",
  
  "consequence_chain": {
    "short_term": "1-2 phrases complètes : ce qui se passe à court terme (1-2 semaines). Concret, sans jargon.",
    "medium_term": "1-2 phrases complètes : ce qui se passe à moyen terme (1-3 mois).",
    "final_risk": "1-2 phrases complètes : le pire cas à long terme (3+ mois)."
  },
  
  "whyMatters": "2-3 phrases complètes et simples qui expliquent POURQUOI c'est important. UNE phrase clé doit être en gras avec <strong>...</strong>. Pas de chiffres ni d'horizons ici (ils sont dans les conséquences). Public non technique : si un terme technique est inévitable, l'expliquer en quelques mots.",
  "currentState": "Description de l'état actuel détecté dans le scan (ex: '.env présent mais NON ignoré par git')",
  "steps": [
    {
      "num": 1,
      "title": "Titre de l'étape",
      "description": "Explication courte",
      "command": "bash command to copy/paste (if applicable)",
      "expectedResult": "Ce qu'on doit voir après"
    }
  ]
}
```

**Principes de rédaction (TRÈS IMPORTANT)** :
- Public = créateurs **non techniciens**. Chaque phrase doit être comprise par quelqu'un qui ne code pas.
- **Phrases complètes uniquement.** Jamais de fragments télégraphiques (pas de "Bugs subtils passent inaperçus et accumulent"). On écrit "Les petites erreurs passent inaperçues et s'accumulent sans que tu les voies."
- **Zéro jargon non expliqué** et zéro anglicisme inutile : pas de "runtime", "codebase", "refactor", "merge", "commit" bruts. Si un terme technique est indispensable, l'expliquer en quelques mots juste après.
- **Moins d'informations, mais plus claires.** Une idée par phrase. Mieux vaut court et limpide que complet et confus.
- Dans `whyMatters`, mettre **une phrase clé en gras** (`<strong>`) pour accrocher l'œil.
- Le `whyMatters` explique le POURQUOI ; les conséquences (court/moyen/long) répondent au "qu'est-ce qui se passe si je ne fais rien". Ne pas mélanger les deux.
- S'appuyer sur les textes de référence dans `docteur-code-consequences.json` et les adapter au projet réel, en gardant ce niveau de simplicité.
- Chaque étape (`step`) doit être exécutable en 1-2 minutes, avec une commande copiable et une étape de validation finale.
- Pas d'estimation de temps dans les textes (l'utilisateur verra si c'est rapide ou non).

**Exemples complétés** :

1. **Sécuriser .env par git**
```json
{
  "id": "gitignore-env",
  "title": "Sécuriser .env par git",
  "benefit": "Tes secrets restent privés, ton infra reste sûre",
  "severity": "CRITICAL",
  "category": "Sécurité",
  
  "consequence_chain": {
    "short_term": "Tes secrets restent visibles dans ton code, accessibles à quiconque met la main dessus.",
    "medium_term": "Si ton code fuite ou devient public, tes clés partent avec et peuvent être utilisées contre toi.",
    "final_risk": "Une seule fuite suffit à exposer tous tes accès d'un coup, avec un grand ménage à faire derrière."
  },
  
  "whyMatters": "Le fichier .env range tes secrets à part, séparés du code, pour ne jamais les diffuser par accident. <strong>S'il n'est pas protégé, tes clés se promènent en clair dans ton projet.</strong> C'est la base de l'hygiène de sécurité, et ça se règle en deux minutes.",
  "currentState": ".env détecté mais NON dans .gitignore",
  "steps": [
    {
      "num": 1,
      "title": "Vérifier que .gitignore existe",
      "description": "Si .gitignore n'existe pas, on le crée",
      "command": "touch .gitignore",
      "expectedResult": "Fichier .gitignore apparaît à la racine du projet"
    },
    {
      "num": 2,
      "title": "Ajouter .env à .gitignore",
      "description": "On ajoute les fichiers .env pour qu'ils ne soient jamais trackés",
      "command": "cat >> .gitignore << 'EOF'\n.env\n.env.local\n.env.*.local\nEOF",
      "expectedResult": "grep .env .gitignore affiche les lignes ajoutées"
    },
    {
      "num": 3,
      "title": "Vérifier que git ignore bien .env",
      "description": "On s'assure que git ne track plus .env",
      "command": "git status | grep -i env",
      "expectedResult": "Aucune ligne .env n'apparaît (silence = bon signe)"
    }
  ]
}
```

2. **Documenter tes conventions (CLAUDE.md)**
```json
{
  "id": "claude-md",
  "title": "Documenter tes conventions",
  "benefit": "L'IA comprend tes préférences = réponses plus rapides et meilleures",
  "severity": "MAJOR",
  "category": "Setup Claude Code",
  
  "consequence_chain": {
    "short_term": "À chaque demande, l'IA devine tes préférences au lieu de les connaître. Tu reçois du code qui ne ressemble pas au reste de ton projet.",
    "medium_term": "Tu passes ton temps à reformuler et à corriger les réponses de l'IA. Ton projet devient un assemblage de styles différents.",
    "final_risk": "Tu dépenses deux fois plus en crédits d'IA pour un résultat qui demande quand même des retouches."
  },
  
  "whyMatters": "Le fichier CLAUDE.md, c'est la fiche d'instructions que l'IA lit avant de toucher à ton code. <strong>Sans elle, l'IA invente ses propres règles à chaque fois</strong> et tu dois corriger ses réponses encore et encore. Dix minutes pour l'écrire t'économisent des heures de va-et-vient.",
  "currentState": "CLAUDE.md absent ou incomplet",
  "steps": [
    {
      "num": 1,
      "title": "Créer le fichier CLAUDE.md",
      "description": "À la racine du projet",
      "command": "touch ./CLAUDE.md",
      "expectedResult": "ls -la | grep CLAUDE.md montre le fichier"
    },
    {
      "num": 2,
      "title": "Ajouter le contenu minimal",
      "description": "Un modèle de base pour commencer",
      "command": "cat > ./CLAUDE.md << 'EOF'\n# {{PROJET_NOM}}\n\n## Stack\nNode.js + TypeScript + React (adapter à ton project)\n\n## Code style\n- Imports: OS → npm → locals\n- Fonctions < 50 lignes\n- Pas de console.log en prod\n- Noms explicites\n\n## Git\n- Branches feature depuis main\n- Messages en anglais\nEOF",
      "expectedResult": "cat CLAUDE.md affiche le contenu"
    },
    {
      "num": 3,
      "title": "Personnaliser selon ton projet",
      "description": "Ajouter tes vraies règles (indentation, conventions de nommage, libs préférées, etc.)",
      "command": "# Édite CLAUDE.md manuellement dans ton IDE",
      "expectedResult": "Le fichier contient tes conventions actuelles"
    }
  ]
}
```

---

## Génération du dashboard HTML

Après avoir tout calculé, **toujours générer** un fichier HTML standalone et l'ouvrir dans le navigateur.

### Étapes

1. Créer un HTML auto-contenu en utilisant le template ci-dessous
2. Remplacer tous les tokens `{{...}}` avec les vraies valeurs
3. Générer le timestamp ISO avec heure : `YYYY-MM-DDTHH-mm-ss` (ex: `2025-06-16T14-32-47`)
4. Créer le dossier `.claude/docteur-code/bilans/` s'il n'existe pas
5. Écrire le fichier dans `./.claude/docteur-code/bilans/bilan-{{TIMESTAMP}}.html`
6. Mettre à jour `./.claude/docteur-code/progress.json` avec le nouveau score et timestamp
7. Ouvrir dans le navigateur : `open ./.claude/docteur-code/bilans/bilan-{{TIMESTAMP}}.html`
8. Dire au user : "Ton bilan Docteur Code est prêt. Fichier : `./.claude/docteur-code/bilans/bilan-{{TIMESTAMP}}.html`"

### Tokens à remplacer

- `{{SCORE_GLOBAL}}` : score sur 100 (entier)
- `{{NIVEAU_NUM}}` : 1, 2, 3 ou 4
- `{{NIVEAU_NOM}}` : Soins intensifs / Sous traitement / Bonne santé / Pleine forme
- `{{NIVEAU_COULEUR}}` : code couleur selon niveau (rouge/orange/jaune/vert)
- `{{RESUME}}` : 2-3 phrases de synthèse adaptée au niveau (ex: "Ton projet a une base saine sur la sécurité et le Git workflow, mais souffre d'un manque d'optimisation côté Claude Code. Le code commence à devenir difficile à maintenir.")
- `{{CATEGORIES_CARDS}}` : HTML des 7 cartes de catégories (voir format)
- `{{ORDONNANCE}}` : HTML des 3 quick wins (voir format)
- `{{DATE_BILAN}}` : date du jour au format français (ex: "27 mai 2026")
- `{{TIME_BILAN}}` : heure au format HH:mm:ss (ex: "14:32:47")
- `{{PROJET_NOM}}` : nom du dossier courant (basename du pwd)

### Format d'une carte catégorie

```html
<div class="cat-card cat-score-{{LEVEL_CLASS}}">
  <div class="cat-header">
    <span class="cat-icon">{{ICONE}}</span>
    <span class="cat-name">{{NOM}}</span>
  </div>
  <div class="cat-description">{{DESCRIPTION}}</div>
  <div class="cat-bar">
    <div class="cat-bar-fill" style="width: {{SCORE}}%"></div>
  </div>
  <div class="cat-score">{{SCORE}}/100</div>
</div>
```

Où les descriptions de catégories sont :
- Setup Claude Code : "Utilises-tu Claude Code de façon optimale ?"
- Sécurité : "Ton projet protège-t-il tes secrets et données ?"
- Architecture : "Ton app est-elle construite sur des fondations solides ?"
- Phase de création : "Ton code est-il testé et formaté correctement ?"
- Déploiement : "Peux-tu déployer sans stress ?"
- Gestion haut niveau : "Gères-tu bien ton code et ton historique ?"
- Bugs fonctionnels : "Ton code fonctionne-t-il sans erreurs silencieuses ?"

Où `LEVEL_CLASS` dépend du score :
- 0-25 : `critical` (rouge)
- 26-50 : `warning` (orange)
- 51-75 : `ok` (jaune-vert)
- 76-100 : `excellent` (vert)

Icônes proposées (en emoji car simple à inclure inline) :
- Setup Claude Code : 🤖
- Sécurité : 🔒
- Architecture : 🏗️
- Phase de création : ⚙️
- Déploiement : 🚀
- Gestion haut niveau : 📊
- Bugs fonctionnels : 🐛

### Format d'un quick win

Chaque recommandation met le **bénéfice en avant** (ce que l'user va gagner) + contexte, puis les détails techniques.

```html
<div class="rx-item">
  <div class="rx-num">{{NUMERO}}</div>
  <div class="rx-content">
    
    <!-- En-tête : titre + bénéfice visibles d'abord -->
    <div class="rx-header-section">
      <div class="rx-title">{{RECOMMENDATION_TITLE}}</div>
      <div class="rx-benefit">🎯 Tu vas gagner : {{BENEFIT}}</div>
    </div>
    
    <!-- État détecté -->
    <div class="rx-context">
      <strong>État actuel :</strong> {{CURRENT_STATE}}
    </div>
    
    <!-- 1. Pourquoi c'est important (ouvert sur la 1ère reco) -->
    <details class="rx-detail" {{IF_FIRST}}open{{/IF_FIRST}}>
      <summary>ℹ️ Pourquoi c'est important</summary>
      <div class="rx-why">{{WHY_MATTERS}}</div>
    </details>

    <!-- 2. Qu'est-ce qui se passe si tu ne fais rien -->
    <details class="rx-consequence">
      <summary>⚠️ Qu'est-ce qui se passe si tu ne fais rien</summary>
      <div class="consequence-chain">
        <div class="consequence-step">
          <div class="step-label">Court terme (1-2 semaines)</div>
          <div class="step-content">{{CONSEQUENCE_SHORT_TERM}}</div>
        </div>
        <div class="chain-arrow">↓</div>
        <div class="consequence-step">
          <div class="step-label">Moyen terme (1-3 mois)</div>
          <div class="step-content">{{CONSEQUENCE_MEDIUM_TERM}}</div>
        </div>
        <div class="chain-arrow">↓</div>
        <div class="consequence-step final">
          <div class="step-label">Risque à long terme</div>
          <div class="step-content risk">{{CONSEQUENCE_FINAL_RISK}}</div>
        </div>
      </div>
    </details>

    <!-- 3. Comment procéder -->
    <details class="rx-detail">
      <summary>⚙️ Comment procéder ({{DIFFICULTY}}))</summary>
      <div class="rx-steps">
        {{STEPS_HTML}}
      </div>
    </details>

    <div class="rx-checkbox">
      <input type="checkbox" id="done-{{NUMERO}}" />
      <label for="done-{{NUMERO}}">✓ Complété</label>
    </div>

  </div>
</div>
```

**Format JSON mise à jour pour recommandations :**
Ajouter un champ `benefit` qui décrit simplement ce que l'user va gagner :
```json
{
  "id": "gitignore-env",
  "title": "Sécuriser .env par git",
  "benefit": "Tes secrets ne seront jamais publics sur GitHub",
  "difficulty": "2 min",
  "severity": "CRITICAL",
  "category": "Sécurité",
  "whyMatters": "...",
  "currentState": "...",
  "steps": [...]
}
```

Où `{{STEPS_HTML}}` est généré comme :
```html
<div class="rx-step">
  <div class="rx-step-num">Étape 1</div>
  <div class="rx-step-title">{{STEP_TITLE}}</div>
  <div class="rx-step-desc">{{STEP_DESCRIPTION}}</div>
  
  {{#if STEP_COMMAND}}
  <div class="rx-code-block">
    <code>{{STEP_COMMAND}}</code>
    <button class="rx-copy">Copier</button>
  </div>
  {{/if}}
  
  {{#if EXPECTED_RESULT}}
  <div class="rx-expected">
    <strong>Tu dois voir :</strong><br>
    {{EXPECTED_RESULT}}
  </div>
  {{/if}}
  
  <input type="checkbox" id="step-{{NUMERO}}-{{STEP_NUM}}" />
  <label for="step-{{NUMERO}}-{{STEP_NUM}}">Étape complétée</label>
</div>
```

### Template HTML complet

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bilan Docteur Code - {{PROJET_NOM}}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --primary: #0F4C75;
    --primary-light: #3282B8;
    --bg-light: #F5F9FC;
    --bg-paper: #FFFFFF;
    --critical: #C73E1D;
    --warning: #E89923;
    --ok: #BFA32D;
    --excellent: #27AE60;
    --text: #1B262C;
    --text-muted: #5A6C7A;
    --border: #DCE6EF;
  }

  body {
    background: var(--bg-light);
    color: var(--text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    line-height: 1.6;
    min-height: 100vh;
    padding: 40px 20px;
  }

  .sheet {
    max-width: 880px;
    margin: 0 auto;
    background: var(--bg-paper);
    border-radius: 12px;
    box-shadow: 0 4px 32px rgba(15, 76, 117, 0.08);
    overflow: hidden;
  }

  /* En-tête style ordonnance médicale */
  .letterhead {
    background: var(--primary);
    color: white;
    padding: 32px 40px;
    position: relative;
  }

  .letterhead::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: repeating-linear-gradient(
      45deg,
      var(--critical),
      var(--critical) 10px,
      var(--primary-light) 10px,
      var(--primary-light) 20px
    );
  }

  .letterhead-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
  }

  .brand-name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .brand-tag {
    font-size: 12px;
    opacity: 0.85;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .doc-meta {
    text-align: right;
    font-size: 12px;
    opacity: 0.85;
    line-height: 1.5;
  }

  .doc-meta strong {
    display: block;
    color: white;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
    opacity: 1;
  }

  .doc-time {
    font-size: 11px;
    opacity: 0.7;
  }

  .doc-title {
    font-size: 14px;
    letter-spacing: 4px;
    text-transform: uppercase;
    opacity: 0.85;
    margin-top: 16px;
  }

  /* Contenu principal */
  .body {
    padding: 40px;
  }

  /* Section diagnostic principal */
  .diagnosis {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 32px;
    align-items: center;
    padding: 32px;
    background: var(--bg-light);
    border-radius: 8px;
    margin-bottom: 32px;
    border-left: 5px solid var(--niveau-color, var(--primary));
  }

  .score-circle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: white;
    border: 6px solid var(--niveau-color, var(--primary));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .score-num {
    font-size: 44px;
    font-weight: 700;
    color: var(--niveau-color, var(--primary));
    line-height: 1;
  }

  .score-max {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .niveau-block .niveau-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .niveau-block .niveau-name {
    font-size: 32px;
    font-weight: 700;
    color: var(--niveau-color, var(--primary));
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .resume {
    color: var(--text);
    font-size: 15px;
    line-height: 1.6;
  }

  /* Échelle de progression */
  .scale {
    display: flex;
    margin-bottom: 40px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .scale-step {
    flex: 1;
    padding: 16px 12px;
    text-align: center;
    background: white;
    position: relative;
  }

  .scale-step:not(:last-child) {
    border-right: 1px solid var(--border);
  }

  .scale-icon {
    font-size: 24px;
    margin-bottom: 8px;
    display: block;
    line-height: 1;
  }

  .scale-step .step-num {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .scale-step .step-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }

  .scale-step .step-range {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .scale-step.active {
    background: var(--niveau-color, var(--primary));
    color: white;
  }

  .scale-step.active .step-num,
  .scale-step.active .step-name,
  .scale-step.active .step-range {
    color: white;
  }

  /* Catégories */
  .section-title {
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--border);
    font-weight: 700;
  }

  .categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin-bottom: 40px;
  }

  .cat-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    transition: transform 0.15s ease;
  }

  .cat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 76, 117, 0.1);
  }

  .cat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .cat-icon {
    font-size: 20px;
  }

  .cat-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    flex: 1;
  }

  .cat-description {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 12px;
    line-height: 1.4;
  }

  .cat-bar {
    height: 6px;
    background: var(--bg-light);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .cat-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  .cat-score {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
  }

  .cat-card.cat-score-critical .cat-bar-fill { background: var(--critical); }
  .cat-card.cat-score-warning .cat-bar-fill { background: var(--warning); }
  .cat-card.cat-score-ok .cat-bar-fill { background: var(--ok); }
  .cat-card.cat-score-excellent .cat-bar-fill { background: var(--excellent); }

  .cat-card.cat-score-critical .cat-score { color: var(--critical); }
  .cat-card.cat-score-warning .cat-score { color: var(--warning); }
  .cat-card.cat-score-ok .cat-score { color: var(--ok); }
  .cat-card.cat-score-excellent .cat-score { color: var(--excellent); }

  /* Ordonnance */
  .prescription {
    background: var(--bg-light);
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 32px;
    border: 1px dashed var(--primary-light);
    position: relative;
  }

  .rx-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .rx-symbol {
    font-family: 'Georgia', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--primary);
    font-style: italic;
  }

  .rx-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .rx-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .rx-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .rx-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .rx-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
  }

  .rx-text {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text);
    padding-top: 4px;
  }

  /* Recommandations détaillées */
  .rx-content {
    flex: 1;
  }

  .rx-header-section {
    margin-bottom: 12px;
  }

  .rx-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .rx-benefit {
    font-size: 14px;
    font-weight: 600;
    color: var(--excellent);
    padding: 8px;
    background: rgba(39, 174, 96, 0.05);
    border-radius: 4px;
    border-left: 3px solid var(--excellent);
    margin-bottom: 8px;
  }

  .rx-context {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 8px;
    padding: 8px;
    background: var(--bg-light);
    border-radius: 4px;
  }

  .rx-severity {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .rx-detail {
    margin-bottom: 12px;
    padding: 12px;
    background: rgba(15, 76, 117, 0.02);
    border-radius: 6px;
    border-left: 3px solid var(--primary);
  }

  .rx-detail summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--primary);
    padding: 4px 0;
  }

  .rx-detail summary:hover {
    text-decoration: underline;
  }

  .rx-why {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
  }

  .rx-why strong {
    color: var(--primary);
    font-weight: 700;
  }

  .rx-state {
    margin-top: 8px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .rx-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .rx-step {
    padding: 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .rx-step-num {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .rx-step-title {
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }

  .rx-step-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .rx-code-block {
    background: var(--bg-light);
    border-radius: 4px;
    padding: 8px;
    margin: 8px 0;
    position: relative;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    overflow-x: auto;
  }

  .rx-code-block code {
    display: block;
    color: var(--text);
    line-height: 1.4;
    word-break: break-all;
  }

  .rx-copy {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: 4px 8px;
    font-size: 11px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    opacity: 0.8;
  }

  .rx-copy:hover {
    opacity: 1;
  }

  .rx-expected {
    background: rgba(39, 174, 96, 0.05);
    border-left: 3px solid var(--excellent);
    padding: 8px;
    margin: 8px 0;
    font-size: 13px;
    color: var(--text);
    border-radius: 3px;
  }

  .rx-expected strong {
    color: var(--excellent);
  }

  .rx-checkbox {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .rx-checkbox input[type="checkbox"] {
    margin-right: 6px;
  }

  .rx-checkbox label {
    font-size: 13px;
    color: var(--text-muted);
    cursor: pointer;
  }

  .rx-checkbox input[type="checkbox"]:checked + label {
    color: var(--excellent);
    text-decoration: line-through;
  }

  /* Consequence chain section */
  .rx-consequence {
    margin: 16px 0;
    padding: 12px;
    background: rgba(199, 62, 29, 0.05);
    border-left: 4px solid var(--critical);
    border-radius: 6px;
  }

  .rx-consequence summary {
    color: var(--critical);
    font-weight: 600;
    cursor: pointer;
    padding: 8px 0;
  }

  .rx-consequence summary:hover {
    opacity: 0.8;
  }

  .consequence-chain {
    margin-top: 12px;
    padding: 12px;
    background: white;
    border-radius: 4px;
  }

  .consequence-step {
    padding: 12px;
    background: var(--bg-light);
    border-left: 3px solid var(--warning);
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .consequence-step.final {
    border-left-color: var(--critical);
    background: rgba(199, 62, 29, 0.05);
    font-weight: 500;
  }

  .step-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    font-weight: 600;
  }

  .step-content {
    font-size: 13px;
    line-height: 1.5;
    color: var(--text);
  }

  .step-content.risk {
    color: var(--critical);
  }

  .chain-arrow {
    text-align: center;
    color: var(--text-muted);
    font-size: 12px;
    margin: 4px 0;
  }

  /* CTA */
  .cta-box {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
    padding: 32px;
    border-radius: 8px;
    text-align: center;
  }

  .cta-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .cta-text {
    font-size: 15px;
    opacity: 0.9;
    margin-bottom: 24px;
    line-height: 1.6;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-button {
    display: inline-block;
    background: white;
    color: var(--primary);
    padding: 14px 32px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.5px;
    transition: transform 0.15s ease;
  }

  .cta-button:hover {
    transform: scale(1.03);
  }

  .cta-price {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 16px;
  }

  /* Footer */
  .footer {
    text-align: center;
    padding: 24px;
    color: var(--text-muted);
    font-size: 12px;
    background: white;
    border-top: 1px solid var(--border);
  }

  .footer .signature {
    font-style: italic;
    margin-bottom: 4px;
  }

  .footer-version {
    margin-top: 8px;
    font-size: 11px;
    opacity: 0.6;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>
<div class="sheet">

  <!-- En-tête style ordonnance -->
  <header class="letterhead">
    <div class="letterhead-top">
      <div class="brand">
        <div class="brand-icon">🩺</div>
        <div>
          <div class="brand-name">Docteur Code</div>
          <div class="brand-tag">Médecin de votre code généré par IA</div>
        </div>
      </div>
      <div class="doc-meta">
        <strong>Bilan de santé</strong>
        Projet : {{PROJET_NOM}}<br>
        Date : {{DATE_BILAN}} <span class="doc-time">· {{TIME_BILAN}}</span>
      </div>
    </div>
    <div class="doc-title">Diagnostic complet</div>
  </header>

  <div class="body">

    <!-- Score principal -->
    <section class="diagnosis" style="--niveau-color: {{NIVEAU_COULEUR}};">
      <div class="score-circle">
        <div class="score-num">{{SCORE_GLOBAL}}</div>
        <div class="score-max">/ 100</div>
      </div>
      <div class="niveau-block">
        <div class="niveau-label">État de santé</div>
        <div class="niveau-name">{{NIVEAU_NOM}}</div>
        <div class="resume">{{RESUME}}</div>
      </div>
    </section>

    <!-- Échelle visuelle -->
    <div class="scale" style="--niveau-color: {{NIVEAU_COULEUR}};">
      <div class="scale-step {{ACTIVE_1}}">
        <div class="scale-icon">🚨</div>
        <div class="step-num">Niveau 1</div>
        <div class="step-name">Soins intensifs</div>
        <div class="step-range">0-25</div>
      </div>
      <div class="scale-step {{ACTIVE_2}}">
        <div class="scale-icon">⚠️</div>
        <div class="step-num">Niveau 2</div>
        <div class="step-name">Sous traitement</div>
        <div class="step-range">26-50</div>
      </div>
      <div class="scale-step {{ACTIVE_3}}">
        <div class="scale-icon">✓</div>
        <div class="step-num">Niveau 3</div>
        <div class="step-name">Bonne santé</div>
        <div class="step-range">51-75</div>
      </div>
      <div class="scale-step {{ACTIVE_4}}">
        <div class="scale-icon">⭐</div>
        <div class="step-num">Niveau 4</div>
        <div class="step-name">Pleine forme</div>
        <div class="step-range">76-100</div>
      </div>
    </div>

    <!-- Détail par catégorie -->
    <h2 class="section-title">Détail par catégorie</h2>
    <div class="categories">
      {{CATEGORIES_CARDS}}
    </div>

    <!-- Ordonnance -->
    <div class="prescription">
      <div class="rx-header">
        <div class="rx-symbol">℞</div>
        <div>
          <div class="rx-title">Ordonnance</div>
          <div class="rx-subtitle">Les 3 actions prioritaires à mettre en oeuvre</div>
        </div>
      </div>
      <div class="rx-list">
        {{ORDONNANCE}}
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-box">
      <div class="cta-title">Tu veux aller plus loin ?</div>
      <div class="cta-text">
        Ce bilan donne une photo. La consultation complète Docteur Code va plus loin : analyse approfondie du code, roadmap personnalisée, déblocage des bugs et optimisation de tes coûts Claude.
      </div>
      <a href="https://docteur-code.fr" class="cta-button">Réserver une consultation</a>
      <div class="cta-price">2h30 d'audit · 390 € · garantie remboursé si pas de piste actionnable identifiée</div>
    </div>

  </div>

  <div class="footer">
    <div class="signature">Docteur Code · Bilan généré automatiquement par la skill /docteur-code</div>
    <div>Pour la version complète et l'accompagnement : docteur-code.fr</div>
    <!-- Garder cette version synchronisée avec le champ "version" du frontmatter en haut du fichier -->
    <div class="footer-version">Skill v1.7.0</div>
  </div>

</div>
</body>
</html>
```

### Pour les variables ACTIVE_X

- Si niveau = 1 : `{{ACTIVE_1}}` = `"active"`, les autres = vides
- Si niveau = 2 : `{{ACTIVE_2}}` = `"active"`, les autres = vides
- etc.

### Pour NIVEAU_COULEUR

- Niveau 1 (Soins intensifs) : `#C73E1D` (rouge)
- Niveau 2 (Sous traitement) : `#E89923` (orange)
- Niveau 3 (Bonne santé) : `#BFA32D` (jaune-or)
- Niveau 4 (Pleine forme) : `#27AE60` (vert)

### Après écriture du HTML

1. Écrire le fichier complet (tous tokens remplacés) dans `./.claude/docteur-code/bilans/bilan-{{TIMESTAMP}}.html`
2. Mettre à jour (ou créer) `./.claude/docteur-code/progress.json` :
```json
{
  "bilans": [
    {
      "timestamp": "2025-06-16T14-32-47",
      "date": "16 juin 2025",
      "score": 52,
      "niveau": 3,
      "niveau_nom": "Bonne santé"
    }
  ],
  "last_bilan": "2025-06-16T14-32-47"
}
```
3. **Ouvrir automatiquement le fichier HTML** :
   - Sur Mac : exécuter `open ./.claude/docteur-code/bilans/bilan-{{TIMESTAMP}}.html`
   - Sur Linux : exécuter `xdg-open ./.claude/docteur-code/bilans/bilan-{{TIMESTAMP}}.html`
   - Sur Windows : exécuter `start .\.claude\docteur-code\bilans\bilan-{{TIMESTAMP}}.html`
4. Dire au user : "Ton bilan Docteur Code s'ouvre dans le navigateur 👇"

---

## Fichier progress.json

Le fichier `./.claude/docteur-code/progress.json` est créé automatiquement et trackent l'historique. Chaque fois qu'on relance `/docteur-code`, on ajoute une entrée :

```json
{
  "bilans": [
    {
      "timestamp": "2025-06-12T09-15-32",
      "date": "12 juin 2025",
      "score": 42,
      "niveau": 2,
      "niveau_nom": "Sous traitement"
    },
    {
      "timestamp": "2025-06-16T14-32-47",
      "date": "16 juin 2025",
      "score": 52,
      "niveau": 3,
      "niveau_nom": "Bonne santé"
    }
  ],
  "last_bilan": "2025-06-16T14-32-47"
}
```

À chaque relance, on :
1. Lit le fichier (s'il existe)
2. Ajoute le nouveau bilan à l'array
3. Met à jour `last_bilan`

Cet historique permet à l'utilisateur de tracker sa progression entre les bilans.

---

## Ton de communication

Pendant tout l'exécution de la skill :

- Direct, sans bullshit
- Pas de jargon non expliqué
- Honnête : si quelque chose va mal, le dire calmement
- Pas de drama ni de catastrophisme
- Le client est un adulte qui veut une info utile

Pendant le scan, dire quelque chose de bref comme : "Je scanne ton projet, ça prend 30 secondes."

Pendant les questions, formuler de façon naturelle, pas comme un formulaire bureaucratique.

À la fin, présenter le résultat sans excès de commentaires. Le HTML parle de lui-même. Juste dire "Bilan terminé, fichier ouvert dans le navigateur."

---

## CTA finale

Après avoir présenté le bilan, terminer par :

> Si tu veux la version complète (analyse approfondie de ton code, roadmap personnalisée, déblocage des bugs bloquants et optimisation de tes coûts Claude), la consultation Docteur Code dure 2h30, coûte 390 € et garantit au moins une piste concrète d'amélioration ou tu es remboursé.
>
> Plus d'infos : docteur-code.fr

Ne pas spammer cette CTA. Une fois suffit.

---

**Version :** 1.7.0
**Créé par :** Docteur Code · docteur-code.fr
