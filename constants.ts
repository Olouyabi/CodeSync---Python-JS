import type { Chapter } from './types';

export const COURSE_STRUCTURE: Chapter[] = [
  {
    id: 'ch1',
    title: 'Introduction & Configuration',
    lessons: [
      { id: 'l1-1', title: 'Que sont Python & JavaScript ?' },
      { id: 'l1-2', title: 'Configurer votre environnement' },
      { id: 'l1-3', title: 'Premier Programme : Hello World' },
    ],
  },
  {
    id: 'ch2',
    title: 'Fondamentaux',
    lessons: [
      { id: 'l2-1', title: 'Variables et Types de Données' },
      { id: 'l2-2', title: 'Opérateurs de Base' },
      { id: 'l2-3', title: 'Commentaires et Entrées/Sorties' },
      { id: 'l2-4', title: 'Conversion de Type' },
    ],
  },
  {
    id: 'ch3',
    title: 'Structures de Contrôle',
    lessons: [
      { id: 'l3-1', title: 'Instructions Conditionnelles (if/else)' },
      { id: 'l3-2', title: 'Boucles For' },
      { id: 'l3-3', title: 'Boucles While' },
      { id: 'l3-4', title: 'Break et Continue' },
    ],
  },
  {
    id: 'ch4',
    title: 'Structures de Données',
    lessons: [
      { id: 'l4-1', title: 'Listes (Tableaux en JS)' },
      { id: 'l4-2', title: 'Tuples (et alternatives JS)' },
      { id: 'l4-3', title: 'Dictionnaires (Objets en JS)' },
      { id: 'l4-4', title: 'Ensembles (Sets)' },
    ],
  },
  {
    id: 'ch5',
    title: 'Fonctions',
    lessons: [
      { id: 'l5-1', title: 'Définir et Appeler des Fonctions' },
      { id: 'l5-2', title: 'Paramètres et Arguments' },
      { id: 'l5-3', title: 'Valeurs de Retour' },
      { id: 'l5-4', title: 'Portée : Locale et Globale' },
      { id: 'l5-5', title: 'Fonctions Anonymes (Lambda/Fléchées)' },
    ],
  },
  {
    id: 'ch6',
    title: 'Sujets Avancés',
    lessons: [
      { id: 'l6-1', title: 'Programmation Orientée Objet (Classes)' },
      { id: 'l6-2', title: 'Modules et Importations' },
      { id: 'l6-3', title: 'Gestion des Erreurs (Try/Catch)' },
      { id: 'l6-4', title: 'Programmation Asynchrone (Async/Await)' },
    ],
  },
  {
    id: 'ch7',
    title: 'Prochaines Étapes',
    lessons: [
      { id: 'l7-1', title: 'Idées de Projets' },
    ],
  },
];