# Newproject Headless — React + WordPress

Projet front **Next.js / React** (Faust) connecté au back-office **WordPress** et à la **base de données** WordPress.

---

## Vue d’ensemble

| Rôle | Techno | Où | Comment le lancer |
|------|--------|-----|-------------------|
| **Back-office** | WordPress (Local) | `newproject` (Local) | Application **Local** par Flywheel |
| **Front** | Next.js / React | `newproject-headless` | Ligne de commande : `npm run dev:next` |
| **Base de données** | MySQL / MariaDB | Gérée par **Local** | Démarre avec le site Local |

---

## 1. Back-office (WordPress)

Le back-office est servi par **Local** (Flywheel), pas par WAMP.

- **Ouvrir l’app** : lancer **Local** sur ta machine.
- **Démarrer le site** : dans Local, démarrer le site **newproject** (ou celui configuré pour ce projet).
- **URL du back-office** : **http://newproject.local/wp-admin**
- **API GraphQL** : **http://newproject.local/graphql**

Aucune ligne de commande n’est nécessaire pour le back-office : tout se fait via l’interface Local.

---

## 2. Base de données

La base de données WordPress est gérée par **Local** :

- Elle démarre et s’arrête avec le site dans Local.
- Les contenus (articles, pages, ACF, etc.) sont stockés dans cette base.
- Le front ne se connecte **pas** directement à la BDD : il passe par l’API GraphQL du back-office.

Tu n’as rien à lancer à part le site dans Local pour que la BDD soit disponible.

---

## 3. Front (Next.js / React)

Le front doit être lancé **en ligne de commande**.

### Prérequis

- **Node.js** installé (ex. v18 ou v20).
- Projet cloné et dépendances installées une fois : `npm install`.

### Lancer le front en local

Dans un terminal (PowerShell ou CMD), depuis la racine du projet front :

```powershell
cd c:\wamp64\www\newproject-headless
npm run dev:next
```

- Le serveur Next.js démarre.
- **URL du front** : **http://localhost:3000**

À garder en tête :

- Il faut laisser ce terminal ouvert tant que tu travailles sur le front.
- Arrêt du serveur : **Ctrl+C** dans le terminal.
- Le back-office (Local) doit être démarré pour que le front puisse charger les données via GraphQL.

### Fichier d’environnement local

Le fichier **`.env.local`** à la racine de `newproject-headless` doit contenir au minimum :

```env
# URL du WordPress (sans slash final) — celle donnée par Local
NEXT_PUBLIC_WORDPRESS_URL=http://newproject.local

# Clé trouvée dans WordPress : Réglages → Headless (plugin FaustWP)
FAUST_SECRET_KEY=votre-cle-secrete

# URL du front en local
NEXT_PUBLIC_URL=http://localhost:3000
```

Sans ce fichier (ou avec une mauvaise URL / clé), le front ne pourra pas communiquer correctement avec le back-office.

---

## 4. Ordre de lancement recommandé

1. **Local** : lancer l’app et démarrer le site **newproject** (back-office + BDD).
2. **Terminal** : `cd c:\wamp64\www\newproject-headless` puis `npm run dev:next` (front).
3. **Navigateur** : ouvrir **http://localhost:3000** pour le front et **http://newproject.local/wp-admin** pour le back-office.

---

## 5. Récap des URLs en local

| Rôle | URL |
|------|-----|
| **Back-office (admin WordPress)** | http://newproject.local/wp-admin |
| **API GraphQL** | http://newproject.local/graphql |
| **Front (site public)** | http://localhost:3000 |

---

## 6. Exporter la production vers le local

Pour récupérer tout le contenu en prod (base de données + médias) et l’importer en local (Local + BDD) : voir le guide **[EXPORT-PROD-VERS-LOCAL.md](./EXPORT-PROD-VERS-LOCAL.md)** (export BDD, import dans Local, remplacement des URLs prod → local, uploads).

---

## 7. Quand la ligne de commande est obligatoire

- **Lancer le front** : toujours en ligne de commande avec `npm run dev:next`.
- **Installer les dépendances** : `npm install` (une fois ou après un `git pull`).
- **Mettre à jour Browserslist** (si demandé) : `npx update-browserslist-db@latest`.

Le **back-office** et la **base de données** ne nécessitent **pas** de ligne de commande : tout passe par **Local**.

---

## Pour aller plus loin

- [Faust.js](https://faustjs.org)
- [WPGraphQL](https://www.wpgraphql.com)
- [WP Engine Atlas](https://wpengine.com/atlas/)

### Contributor License Agreement

Les contributeurs externes aux produits WP Engine doivent avoir signé le [CLA](https://wpeng.in/cla/) avant que leurs contributions soient acceptées.
