# FitTrack — MVP Bêta v0.1

Application web PWA de suivi des performances en musculation.
Stack : **Next.js 14 · TypeScript · Tailwind CSS · Prisma · SQLite · NextAuth v5**

---

## Lancement en local (1 minute)

### Prérequis
- Node.js ≥ 18  → `node --version`
- npm ≥ 9       → `npm --version`

### 1. Installer les dépendances

```bash
cd fittrack
npm install
```

### 2. Configurer l'environnement

Le fichier `.env` est déjà prêt pour le développement local (SQLite).
**Pour la production**, génère un vrai secret :

```bash
openssl rand -base64 32
# Colle la valeur dans .env → AUTH_SECRET="..."
```

### 3. Créer la base de données et seeder les exercices

```bash
npm run db:push    # Crée le schéma SQLite (fichier prisma/dev.db)
npm run db:seed    # Insère les 50 exercices de base
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre **http://localhost:3000** dans ton navigateur.

---

## Commandes disponibles

| Commande            | Description                                |
|---------------------|--------------------------------------------|
| `npm run dev`       | Lance le serveur en mode développement     |
| `npm run build`     | Build de production                        |
| `npm run start`     | Lance le build de production               |
| `npm run db:push`   | Applique le schéma Prisma à la DB          |
| `npm run db:seed`   | Insère les 50 exercices de base            |
| `npm run db:studio` | Ouvre Prisma Studio (UI de la base)        |
| `npm run setup`     | Tout en une commande : install + db + seed |

> **Astuce** : Pour explorer la base de données visuellement, lance `npm run db:studio` → ouvre http://localhost:5555

---

## Architecture du projet

```
fittrack/
├── app/
│   ├── (auth)/           # Pages login & register (public)
│   ├── (dashboard)/      # Pages protégées (auth requise)
│   │   ├── dashboard/    # Page d'accueil
│   │   ├── exercises/    # Bibliothèque d'exercices
│   │   ├── workout/      # Démarrer / Séance active
│   │   ├── history/      # Historique des séances
│   │   └── stats/        # Records personnels
│   └── api/              # Route handlers (REST)
│       ├── auth/         # NextAuth endpoints
│       ├── register/     # Création de compte
│       ├── exercises/    # CRUD exercices
│       ├── workouts/     # CRUD séances + sets
│       └── stats/        # PRs et statistiques
├── components/
│   ├── layout/           # BottomNav, TopBar
│   ├── ui/               # Button, Card, Badge
│   ├── exercises/        # ExerciseLibrary
│   └── workout/          # ActiveWorkout, HistoryList, StartWorkout
├── lib/
│   ├── db.ts             # Singleton Prisma Client
│   ├── auth.ts           # Configuration NextAuth
│   └── utils.ts          # Helpers (formatDate, calc1RM, labels...)
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   └── seed.ts           # 50 exercices de base
├── auth.ts               # Export NextAuth handlers
├── middleware.ts          # Protection des routes
└── .env                  # Variables d'environnement (local)
```

---

## Fonctionnalités MVP (v0.1)

### ✅ Implémentées
- **Authentification** — Inscription / Connexion (email + mot de passe bcrypt)
- **Bibliothèque d'exercices** — 50 exercices, double filtre (groupe musculaire + équipement), recherche, fiche détaillée, ajout d'exercice personnalisé
- **Journal d'entraînement** — Démarrer une séance libre, ajouter des exercices, logger séries/poids/reps, suggestion de charge, timer de repos, terminer et sauvegarder
- **Historique** — Liste des séances passées avec détail (volume, durée, muscles travaillés)
- **Records personnels** — Affichage automatique du PR par exercice avec estimation 1RM (formule d'Epley)
- **Dashboard** — Vue d'ensemble : séances de la semaine, dernier PR, séances récentes

### 🔜 V2 (prochaines itérations)
- Suivi corporel (poids, mensurations, photos)
- Programmes d'entraînement structurés
- Graphiques d'évolution (recharts intégré, à connecter)
- Mode hors-ligne PWA (Workbox)
- Google OAuth
- Notifications de rappel
- Export CSV/PDF

---

## Décisions d'architecture

| Décision | Justification |
|----------|---------------|
| **SQLite en local** | Zéro configuration, DB embarquée. Switch vers PostgreSQL en 1 ligne pour la prod. |
| **NextAuth v5 JWT** | Sessions stateless, compatible serverless (Vercel). |
| **bcrypt cost=12** | Bon équilibre sécurité/performance pour l'auth (≈250ms sur machine standard). |
| **Server Components** | Dashboard, historique et stats chargés côté serveur — pas de waterfall API. |
| **Client Components** | Limités aux écrans interactifs (journal actif, filtres exercices). |
| **Validation Zod** | Validation identique client + serveur, pas de divergence. |

---

## Variables d'environnement

| Variable          | Description                          | Défaut local              |
|-------------------|--------------------------------------|---------------------------|
| `DATABASE_URL`    | URL de la base de données            | `file:./dev.db` (SQLite)  |
| `AUTH_SECRET`     | Secret de chiffrement JWT NextAuth   | **À changer en prod !**   |
| `NEXTAUTH_URL`    | URL de l'application                 | `http://localhost:3000`   |

---

## Milestone 1 — Livré ✅

- Code source complet et fonctionnel
- Migrations Prisma (SQLite local → PostgreSQL prod)
- 50 exercices seedés en base
- URL de test : **http://localhost:3000**

**Prochaine étape** : Milestone 2 — Suivi corporel + graphiques + mode hors-ligne PWA
