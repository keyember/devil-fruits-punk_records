# Devil Fruits × Punk Records

<p align="center">
  <img src="https://placehold.co/820x200/010409/00ff41?text=DEVIL+FRUITS+x+PUNK+RECORDS+v0.1&font=Roboto+Mono" alt="Header" width="820"/>
  <br/>
  <code style="color: #00ff41; background: #000; padding: 4px 12px; border: 1px solid #00ff41;">> WELCOME DR. VEGAPUNK — ACCESS LEVEL: STELLA</code>
</p>

**Devil Fruits × Punk Records** est une petite application full-stack inspirée de l'univers de **One Piece** (arc Egghead / Punk Records).  
Elle propose un terminal rétro-CRT style Vegapunk pour consulter une base de données de **Fruits du Démon** (Akuma no Mi), avec un design immersif "moniteur scientifique de Punk Records".

Preview disponible ici -> https://fruits.oudinallan.dev/

## Fonctionnalités actuelles (v0.1)

- Import initial des Fruits du Démon via l’API OnePiece (français)
- Liste filtrable par type (Paramecia / Logia / Zoan)
- Affichage détaillé avec effet de "chargement Punk Records"
- Interface immersive type terminal CRT avec scanlines + glitch + beam
- Sidebar de navigation avec highlight sur fruit sélectionné

## Stack technique

| Couche       | Technologie                                   | Remarques                                 |
|--------------|---------------------------------------------  |-------------------------------------------|
| Frontend     | React 19, Vite, TypeScript, Tailwind CSS 4    | Framer Motion pour animations             |
| Backend      | Node.js, Express, Prisma, PostgreSQL          | Adaptateur PrismaPg pour compatibilité    |
| Données      | API https://api.api-onepiece.com/v2/fruits/fr | Seed via script seed.ts                   |
| Style        | scanlines.css (CRT effect custom)             | Vignette, beam animé, phosphor flicker    |
| Déploiement  | Non configuré (local pour l'instant)          | Vercel / Railway / Fly.io recommandés     |

## Installation & Lancement

### Prérequis

- Node.js ≥ 20
- PostgreSQL (local ou hébergé – ex: Supabase, Neon, Railway)
- pnpm (fortement recommandé)

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/keyember/devil-fruits-punk_records.git
cd devil-fruits-punk_records
Backend
Bashcd backend
pnpm install

# Copier .env.example → .env et remplir DATABASE_URL
cp .env.example .env

# Appliquer le schéma + migrations
pnpm prisma migrate dev --name init

# Peupler la base (aspiration API)
pnpm tsx seed.ts
# ou : pnpm seed  (si script ajouté dans package.json)

# Lancer le serveur API
pnpm dev
# → http://localhost:3000/api/fruits
Frontend
Bashcd ../frontend
pnpm install
pnpm dev
# → http://localhost:5173
```

## Structure du projet
```
textdevil-fruits-punk_records/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts
│   │   ├── seed.ts
│   │   └── index.ts (test connexion)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TerminalLayout.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── assets/...
│   ├── public/
│   └── package.json
├── .env.example
└── README.md
```

## Prochaines étapes / idées

- Recherche texte + filtre avancé (rareté, utilisateur…)
- Page détail plus riche (images HD, timeline utilisateur, bounty formatée)
- Authentification simple + favoris
- Mode sombre / thèmes (Marine, Pirate, Revolution…)
- Quiz "Quel fruit es-tu ?"
- API publique documentée (OpenAPI/Swagger)
- Meilleure gestion des erreurs + loading states
- Déploiement frontend + backend (Vercel + Railway / Neon)

## Crédits & Légal

Données des Fruits du Démon : [API OnePiece](https://api.api-onepiece.com/v2/fruits/fr) (merci aux mainteneurs !)<br>
One Piece © Eiichiro Oda / Shueisha / Toei Animation<br>
Projet fan-made – non affilié / non commercial<br>
<br>
MIT License © 2026 keyember<br>
「キーエンバー」 nakama !

### Ouvert aux PR / suggestions / corrections / ajouts de features.
