Smart Saha - Frontend (Module Agriculture de Précision)

Bienvenue dans le frontend du projet Smart Saha, développé avec Nuxt 4. Ce module se concentre sur l’agriculture de précision, offrant une interface simple, intuitive et conviviale pour faciliter la navigation et la gestion des cultures, parcelles, tâches et rendements.

Visitez également la plateforme : www.smart-saha.com

Fonctionnalités principales

Interface simple et intuitive pour une navigation facile.

Gestion des cultures : création, consultation, modification et liste.

Gestion des parcelles et parcel-crops : vue détaillée et modification.

Gestion des tâches : liste, création, consultation et édition.

Gestion des rendements : enregistrement, consultation et édition par parcelle.

Dashboard centralisé pour une vue d’ensemble complète.

Composants réutilisables : AuthForm, ContactItem, DetailItem, ContentItem.

Structure du projet
app/
├─ index.vue             # Page d'accueil / Liste des cultures
├─ contact.vue           # Page de contact
├─ login.vue             # Page de connexion
├─ signup.vue            # Page d'inscription
├─ help.vue              # Page d'aide
├─ reset-password.vue    # Page de réinitialisation du mot de passe
├─ app.vue               # Composant racine de l'application

└─ component/
    ├─ AuthForm.vue      # Formulaire de connexion et d'authentification
    ├─ ContactItem.vue   # Affichage d'informations de contact
    ├─ DetailItem.vue    # Vue détaillée d'un élément
    └─ ContentItem.vue   # Composant générique pour afficher du contenu

└─ layouts/
    ├─ dashboard.vue     # Layout pour les pages du tableau de bord
    └─ default.vue       # Layout par défaut pour les pages standard

└─ pages/
    ├─ assitant/
    │   └─ index.vue     # Tableau de bord de l’assistant
    ├─ p/
    │   └─ [id].vue      # Détails d'une parcelle par ID
    ├─ crops/
    │   ├─ index.vue     # Liste des cultures
    │   ├─ create.vue    # Création d'une culture
    │   ├─ show/[id].vue # Détails d'une culture
    │   └─ edit/[id].vue # Modifier une culture
    ├─ parcel-crops/
    │   ├─ index.vue
    │   ├─ create.vue
    │   ├─ show/[id].vue
    │   └─ edit/[id].vue
    ├─ parcels/
    │   ├─ index.vue
    │   ├─ create.vue
    │   ├─ show/[id].vue
    │   └─ edit/[id].vue
    ├─ tasks/
    │   ├─ index.vue
    │   ├─ create.vue
    │   ├─ show/[id].vue
    │   └─ edit/[id].vue
    ├─ yield-records/
    │   ├─ index.vue
    │   ├─ create.vue
    │   ├─ show/[id].vue
    │   └─ edit/[id].vue
    └─ dashboard/
        └─ index.vue     # Tableau de bord principal

public/
# Fichiers statiques et images

Installation
# Cloner le dépôt
git clone https://github.com/Ivontsoa-Gracia/precision-agriculture.git

# Aller dans le dossier du projet
cd precision-agriculture

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

Build pour la production
npm run build
npm run start

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
