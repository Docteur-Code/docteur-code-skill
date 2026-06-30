# Dr. Code — Design System

**Univers visuel :** Billboard américain années 50 — rétro, kitsch assumé, expert mais sans jugement.

---

## Palette de couleurs

| Nom | Hex | Usage |
|---|---|---|
| `cream` | `#EDE4D0` | Fond principal, arrière-plan papier |
| `cream-deep` | `#E2D6BC` | Fond secondaire, variante chaude |
| `paper-line` | `#D8C9A8` | Séparateurs, bordures légères |
| `navy` | `#1E3A52` | Titres principaux, sections sombres, CTA secondaire |
| `navy-deep` | `#15293A` | Variante navy plus sombre |
| `navy-ink` | `#122231` | Texte corps, bordures épaisses, ombres portées |
| `red` | `#B5392C` | CTA principal, accents forts, highlights |
| `red-deep` | `#93281D` | Ombre portée rouge, survol bouton rouge |
| `gold` | `#D8A33B` | Accent kitsch : questions clés, détails starburst |
| `white-warm` | `#FAF4E6` | Fond de carte, texte sur rouge/navy |
| `frame` | `#14171C` | Cadre billboard, noir profond |

### Combinaisons validées pour LinkedIn

| Fond | Texte | Accent | Usage |
|---|---|---|---|
| `navy` (#1E3A52) | `cream` (#EDE4D0) | `gold` (#D8A33B) | Post sombre premium |
| `cream` (#EDE4D0) | `navy-ink` (#122231) | `red` (#B5392C) | Post clair signature |
| `red` (#B5392C) | `white-warm` (#FAF4E6) | `cream` (#EDE4D0) | Alerte / mise en avant |
| `white-warm` (#FAF4E6) | `navy-ink` (#122231) | `navy` (#1E3A52) | Carte contenu |

---

## Typographie

### Polices (Google Fonts)

```
https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Anton&family=Kaushan+Script&family=Bitter:ital,wght@0,400;0,700;1,400&display=swap
```

| Famille | Google Fonts | Rôle | Caractère |
|---|---|---|---|
| **Alfa Slab One** | `Alfa Slab One` | Grands titres "sign painter" | Impact, rétro, billboard |
| **Anton** | `Anton` | Labels condensés, bandeaux, boutons | Capitales, compact, fort |
| **Kaushan Script** | `Kaushan Script` | Accents manuscrits (eyebrow) | Script cursif, chaleureux |
| **Bitter** | `Bitter` | Corps de texte | Slab serif vintage, lisible |

### Hiérarchie typographique

| Élément | Police | Taille | Style |
|---|---|---|---|
| H1 billboard | Alfa Slab One | `clamp(2.8rem, 7vw, 5.5rem)` | Majuscules, tracking 0.06em |
| Section title | Alfa Slab One | `clamp(2.2rem, 6vw, 4.2rem)` | Tracking 0.06em, word-spacing 0.1em |
| Eyebrow / tag | Kaushan Script | `clamp(1.5rem, 3.2vw, 2.2rem)` | Couleur red, rotation -3deg |
| Labels / boutons | Anton | `1.15rem–1.4rem` | UPPERCASE, letter-spacing 1px |
| Corps de texte | Bitter | `clamp(1.05rem, 2vw, 1.3rem)` | line-height 1.6 |
| Numéros déco | Alfa Slab One | `2.6rem` | Couleur red, text-stroke navy-ink |

### Sur LinkedIn (Canva / Figma)

- **Titre principal :** Alfa Slab One, blanc chaud ou cream sur navy / rouge
- **Sous-titre / label :** Anton, UPPERCASE, spacing 1-2px
- **Intro manuscrite :** Kaushan Script (télécharger via Google Fonts) pour les tags type "sans jugement"
- **Corps :** Bitter Regular ou fallback Georgia

---

## Effets visuels signature

### Ombre portée dure (hard shadow)
Caractéristique billboard années 50 — pas de flou, décalage net.

```
box-shadow: 6px 6px 0 #122231   ← navy-ink (standard)
box-shadow: 6px 6px 0 #93281D   ← red-deep (variante rouge)
box-shadow: 3px 3px 0 #122231   ← version petite
```

Sur LinkedIn : simuler avec une ombre de couleur pleine, 0 blur, décalage 4–8px.

### Bordure épaisse
```
border: 3px solid #122231
border-radius: 4px
```

### Texture papier
Grain subtil SVG + radial-gradient blanc en haut. À émuler dans Canva avec un overlay noise 5% opacité.

### Zigzag / bandeau dentelé
Séparateur de sections : triangles alternés `#1E3A52` sur fond transparent.
Reproduire dans Canva avec une forme en dents de scie ou un motif de triangles.

### Sparkle / étoile 8 branches
Forme clip-path en étoile 8 branches. Couleurs : navy, red, ou gold.

### Starburst badge
Badge burst 24 branches, rotation -8deg, fond navy ou red, texte cream, accent gold.
Taille standard : 150×150px.

---

## Éléments de marque

### Nom
**Docteur Code** — toujours avec le "D" et le "C" majuscules. Jamais "Dr Code" sans accent.

### Tagline / positionnement
> "Votre code mérite un vrai bilan de santé."

> "Sans jugement." ← accent de ton récurrent

### Ton
- Expert mais accessible
- Médical/diagnostic (bilan, santé, traitement, suivi)
- Rétro kitsch assumé — pas corporate, pas austère
- Français, marché FR

### Icônes de catégories diagnostiques
⚙️ Setup Claude Code · 🔒 Sécurité · 🏗️ Architecture · 🧪 Tests & qualité · 🚀 Déploiement · 📁 Gestion de projet · 🐛 Bugs courants

---

## Formats LinkedIn

### Post carré (1:1)
- **1080 × 1080 px** (recommandé)
- Zone sûre : marges 80px de chaque côté
- Structure type : fond `navy` ou `cream` · titre Alfa Slab One · tag Kaushan Script · ombre portée sur éléments clés

### Post portrait (4:5)
- **1080 × 1350 px**
- Idéal pour les listes (7 catégories, étapes de parcours)

### Bannière profil LinkedIn
- **1584 × 396 px**
- Zone sûre : 200px en bas (recoupé sur mobile), 80px sur les côtés
- Structure : fond `navy` · nom en Alfa Slab One cream · tagline en Kaushan Script gold

### Document LinkedIn (carousel)
- **1080 × 1080 px** ou **1080 × 1350 px** par slide
- Première slide : couverture avec starburst badge
- Slides suivantes : fond cream, carte blanche avec ombre dure, titre Anton

---

## Palette LinkedIn — hex à copier-coller

```
Cream clair   #EDE4D0
Navy           #1E3A52
Navy foncé    #122231
Rouge          #B5392C
Or / Gold      #D8A33B
Blanc chaud   #FAF4E6
```
