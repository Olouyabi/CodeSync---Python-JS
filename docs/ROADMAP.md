# Feuille de Route (Roadmap) du Projet CodeSync

Ce document décrit la feuille de route pour le développement de l'application CodeSync. Il est divisé en plusieurs phases pour organiser les fonctionnalités et les améliorations.

---

### ✅ Phase 1 : Fondation & MVP (Terminée)

Cette phase s'est concentrée sur la mise en place des bases de l'application et la livraison d'un Produit Minimum Viable (MVP).

-   [x] **Structure du Projet :** Initialisation du projet avec React, TypeScript et Tailwind CSS.
-   [x] **Interface Utilisateur Principale :** Création des composants de base : `Sidebar` pour la navigation, `Header` pour les informations globales, et `CourseView` pour l'affichage du contenu.
-   [x] **Système de Progression :** Implémentation de la logique pour suivre les leçons complétées et l'avancement global de l'utilisateur (sauvegardé en local).
-   [x] **Intégration de l'API Gemini :** Connexion au service Gemini pour générer dynamiquement le contenu des leçons et les idées de projets.
-   [x] **Mode Clair/Sombre :** Mise en place d'un sélecteur de thème pour une meilleure expérience utilisateur.
-   [x] **Responsive Design :** Assurer que l'application est utilisable sur différentes tailles d'écran.

---

### ▶️ Phase 2 : Améliorations & Contenu (En cours)

Cette phase vise à améliorer l'expérience existante et à enrichir le projet.

-   [x] **Internationalisation (i18n) :** Traduction initiale de l'application en français.
-   [x] **Documentation :** Création de la documentation du projet, incluant ce `ROADMAP.md`, un `README.md` et des guides de contribution.
-   [ ] **Qualité du Contenu :** Affiner les prompts envoyés à l'API Gemini pour améliorer la clarté, la pertinence et la richesse des explications.
-   [ ] **Tests :** Ajouter des tests unitaires et d'intégration pour garantir la stabilité de l'application.

---

### 🗓️ Phase 3 : Fonctionnalités Avancées (Prévue)

Cette phase introduira des fonctionnalités plus complexes pour rendre l'apprentissage plus interactif.

-   [ ] **Quiz Interactifs :** Ajouter des quiz à la fin de chaque chapitre pour valider les connaissances acquises.
-   [ ] **Playground de Code :** Intégrer un éditeur de code interactif pour que les utilisateurs puissent exécuter et modifier les extraits de code directement dans le navigateur.
-   [ ] **Authentification Utilisateur :** Mettre en place un système de comptes utilisateurs pour sauvegarder la progression sur le cloud et la synchroniser entre les appareils.
-   [ ] **Extension du Contenu :** Ajouter de nouveaux langages de programmation à comparer (ex: TypeScript, Go, Rust).

---

### 夢 Phase 4 : Déploiement & Communauté (Future)

La dernière phase se concentrera sur la mise en production et la création d'une communauté autour de l'application.

-   [ ] **Déploiement :** Mettre l'application en production sur une plateforme d'hébergement.
-   [ ] **Fonctionnalités Communautaires :** Ajouter une section de commentaires ou un forum pour chaque leçon afin que les apprenants puissent poser des questions et s'entraider.
-   [ ] **Contributions Open Source :** Ouvrir officiellement le projet aux contributions de la communauté.