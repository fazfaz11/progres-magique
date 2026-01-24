

# Plan : Configuration PWA complète avec vite-plugin-pwa

## Objectif
Transformer l'application en une PWA complète qui fonctionne 100% hors-ligne et s'installe facilement sur le PC de la classe.

## Ce que ça va permettre
- L'application fonctionnera sans connexion internet
- Un bouton "Installer" apparaîtra automatiquement dans le navigateur
- L'application s'ouvrira comme une vraie application (sans barre d'adresse)
- Toutes les données des élèves seront sauvegardées localement

## Étapes d'installation sur le PC de la classe

Une fois configuré, voici comment installer l'application :

1. Ouvrir Chrome ou Edge sur le PC
2. Aller sur l'URL publiée de l'application
3. Cliquer sur l'icône "Installer" dans la barre d'adresse (ou le menu ⋮ > "Installer l'application")
4. L'application apparaît sur le bureau comme une vraie application
5. Elle fonctionne ensuite sans internet !

---

## Modifications techniques

### 1. Installer la dépendance vite-plugin-pwa

**Fichier : `package.json`**

Ajouter dans les devDependencies :
```json
"vite-plugin-pwa": "^0.20.0"
```

### 2. Configurer Vite avec le plugin PWA

**Fichier : `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "SUIVI DES PROGRÈS ULIS",
        short_name: "Progrès ULIS",
        description: "Application de suivi des progrès pour les élèves ULIS",
        start_url: "/",
        display: "standalone",
        background_color: "#f8fafc",
        theme_color: "#22c55e",
        orientation: "any",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

### 3. Enregistrer le Service Worker dans l'application

**Fichier : `src/main.tsx`**

Ajouter l'enregistrement du service worker :
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Enregistrement du Service Worker pour le mode hors-ligne
const updateSW = registerSW({
  onNeedRefresh() {
    // Optionnel : afficher un message de mise à jour disponible
    console.log('Nouvelle version disponible');
  },
  onOfflineReady() {
    console.log('Application prête pour le mode hors-ligne');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 4. Ajouter les types TypeScript pour vite-plugin-pwa

**Fichier : `src/vite-env.d.ts`**

Ajouter la déclaration de types :
```typescript
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
```

### 5. Nettoyer le manifest manuel (optionnel)

Le fichier `public/manifest.json` peut être supprimé car le manifest sera généré automatiquement par vite-plugin-pwa.

Mettre à jour `index.html` pour retirer la référence manuelle au manifest (sera ajoutée automatiquement) :

**Fichier : `index.html`**

Retirer cette ligne :
```html
<link rel="manifest" href="/manifest.json" />
```

---

## Résumé des fichiers modifiés

| Fichier | Action |
|---------|--------|
| `package.json` | Ajouter `vite-plugin-pwa` |
| `vite.config.ts` | Configurer le plugin PWA complet |
| `src/main.tsx` | Enregistrer le Service Worker |
| `src/vite-env.d.ts` | Ajouter les types TypeScript |
| `index.html` | Nettoyer la référence au manifest |
| `public/manifest.json` | Supprimer (optionnel) |

## Fonctionnement après installation

```text
+-------------------+     +------------------+     +-------------------+
|   Première        |     |   Service        |     |   Utilisation     |
|   visite          | --> |   Worker         | --> |   hors-ligne      |
|   (avec internet) |     |   installé       |     |   (sans internet) |
+-------------------+     +------------------+     +-------------------+
                                   |
                                   v
                          +------------------+
                          |   Données        |
                          |   localStorage   |
                          |   (élèves)       |
                          +------------------+
```

L'application sera entièrement fonctionnelle sans connexion internet après la première visite !

