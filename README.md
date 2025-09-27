# Smart Saha - Frontend (Module Agriculture de Précision)

Bienvenue dans le frontend du projet **Smart Saha**, développé avec **Nuxt 4**.  
Ce module se concentre sur l’**agriculture de précision**, offrant une interface **simple, intuitive et conviviale** pour faciliter la navigation et la gestion des cultures, parcelles, tâches et rendements.

Visitez également la plateforme : [www.smart-saha.com](https://www.smart-saha.com)

---

## Fonctionnalités principales

- **Interface simple et intuitive** pour une navigation facile.  
- **Gestion des cultures** : création, consultation, modification et liste.  
- **Gestion des parcelles et parcel-crops** : vue détaillée et modification.  
- **Gestion des tâches** : liste, création, consultation et édition.  
- **Gestion des rendements** : enregistrement, consultation et édition par parcelle.  
- **Dashboard centralisé** pour une vue d’ensemble complète.  
- **Composants réutilisables** : `AuthForm`, `ContactItem`, `DetailItem`, `ContentItem`.  

---

## Structure du projet

```plaintext
app/
├─ index.vue             
├─ contact.vue           
├─ login.vue             
├─ signup.vue            
├─ help.vue              
├─ reset-password.vue    
└─ app.vue              

component/
├─ AuthForm.vue          
├─ ContactItem.vue       
├─ DetailItem.vue        
└─ ContentItem.vue      

layouts/
├─ dashboard.vue        
└─ default.vue          

pages/
├─ assistant/
│  └─ index.vue          
├─ p/
│  └─ [id].vue           
├─ crops/
│  ├─ index.vue          
│  ├─ create.vue         
│  ├─ show/[id].vue      
│  └─ edit/[id].vue     
├─ parcel-crops/
│  ├─ index.vue
│  ├─ create.vue
│  ├─ show/[id].vue
│  └─ edit/[id].vue
├─ parcels/
│  ├─ index.vue
│  ├─ create.vue
│  ├─ show/[id].vue
│  └─ edit/[id].vue
├─ tasks/
│  ├─ index.vue
│  ├─ create.vue
│  ├─ show/[id].vue
│  └─ edit/[id].vue
├─ yield-records/
│  ├─ index.vue
│  ├─ create.vue
│  ├─ show/[id].vue
│  └─ edit/[id].vue
└─ dashboard/
   └─ index.vue          

public/
# Fichiers statiques et images

```
# Cloner le dépôt
git clone https://github.com/Ivontsoa-Gracia/precision-agriculture.git

# Aller dans le dossier du projet
cd precision-agriculture

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

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
