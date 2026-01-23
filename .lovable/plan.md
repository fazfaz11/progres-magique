

# Plan : Mise à jour des couleurs pastels pour les tuiles élèves

## Objectif
Remplacer les couleurs actuelles des tuiles élèves par des couleurs pastels plus douces et harmonieuses, correspondant au modèle "ulis-sparkle-tracker".

## Couleurs pastels proposées

### Pour les fonds de tuiles (cardColors)
| Couleur actuelle | Nouvelle couleur pastel | Code Tailwind |
|------------------|------------------------|---------------|
| bg-pink-300 | Rose pastel | `bg-pink-200` |
| bg-blue-400 | Bleu ciel pastel | `bg-sky-200` |
| bg-orange-300 | Pêche pastel | `bg-orange-200` |
| bg-cyan-300 | Turquoise pastel | `bg-cyan-200` |
| bg-purple-300 | Lavande pastel | `bg-purple-200` |
| bg-green-300 | Menthe pastel | `bg-emerald-200` |
| bg-rose-300 | Rose poudré | `bg-rose-200` |
| bg-amber-300 | Jaune pastel | `bg-amber-200` |

### Pour les avatars (avatarColors)
Des couleurs légèrement plus vives pour le contraste avec le fond pastel :
- `bg-rose-400` - Rose vif
- `bg-emerald-400` - Vert émeraude
- `bg-sky-400` - Bleu ciel
- `bg-lime-400` - Vert lime
- `bg-violet-400` - Violet
- `bg-orange-400` - Orange
- `bg-cyan-400` - Cyan
- `bg-pink-400` - Rose vif

## Modification technique

### Fichier : `src/pages/HomePage.tsx`

**Lignes 10-19** - Remplacer le tableau `cardColors` :
```typescript
const cardColors = [
  'bg-pink-200',
  'bg-sky-200',
  'bg-orange-200',
  'bg-cyan-200',
  'bg-purple-200',
  'bg-emerald-200',
  'bg-rose-200',
  'bg-amber-200',
];
```

**Lignes 22-31** - Ajuster le tableau `avatarColors` si nécessaire :
```typescript
const avatarColors = [
  'bg-rose-400',
  'bg-emerald-400',
  'bg-sky-400',
  'bg-lime-400',
  'bg-violet-400',
  'bg-orange-400',
  'bg-cyan-400',
  'bg-pink-400',
];
```

## Rendu visuel attendu
- Tuiles avec des fonds doux et apaisants
- Meilleur contraste avec les avatars colorés
- Harmonie visuelle avec le contour épais noir (`border-4 border-gray-800`)
- Les trophées et textes restent bien lisibles sur les fonds pastels

