# SMB AI

Prototype d'une plateforme de cours d'intelligence artificielle pour débutants.

## Installation

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
npm install
npm run dev
```

Ouvrir l'adresse locale indiquée par Vite (habituellement http://localhost:5173).

## Construire le site

```bash
npm run build
npm run preview
```

Le dossier `dist/` est généré pour un hébergement statique.

## Structure

```text
index.html              Point d'entrée HTML
src/main.js             Affichage, navigation, connexion de démonstration
src/style.css           Styles et responsive
src/config.js           Configuration et compte de démonstration
src/data/courses.js     Liste éditable des neuf niveaux
public/                 Images et autres ressources publiques (à ajouter)
```

## Connexion de démonstration

- Utilisateur : `smb-ai`
- Mot de passe : `123456`

**Important :** cette connexion est simulée dans le navigateur, les identifiants figurent dans `src/config.js` et sont visibles par les visiteurs. Elle ne protège pas le contenu, les fichiers, ni les données. Ne pas y placer de contenus privés ni la considérer comme une authentification réelle. La session temporaire utilise `sessionStorage` et la progression utilise `localStorage`. Aucun backend, aucune administration, aucune base d'utilisateurs.

Pour une vraie protection à l'avenir, remplacer cette démonstration par une authentification et un contrôle d'accès côté serveur.

## Ajouter des cours

Modifier `src/data/courses.js`. Le premier niveau contient quatre intitulés de leçons provisoires ; les huit autres niveaux sont annoncés comme à venir. Les contenus pédagogiques complets seront ajoutés progressivement.

## Licence

Aucune licence définie pour le moment.
