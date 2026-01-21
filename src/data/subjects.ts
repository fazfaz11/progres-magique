import { Subject, Exercise, ExerciseCategory } from '@/types';

// Helper to generate exercise ranges with separate id and label
const generateExercises = (idPrefix: string, start: number, end: number, labelPrefix?: string): Exercise[] => {
  const exercises: Exercise[] = [];
  const displayPrefix = labelPrefix || idPrefix;
  for (let i = start; i <= end; i++) {
    exercises.push({ id: `${idPrefix}${i}`, label: `${displayPrefix}${i}` });
  }
  return exercises;
};

const generateLetterExercises = (idPrefix: string, start: number, end: number, letters: string[], labelPrefix?: string): Exercise[] => {
  const exercises: Exercise[] = [];
  const displayPrefix = labelPrefix || idPrefix;
  for (let i = start; i <= end; i++) {
    for (const letter of letters) {
      exercises.push({ id: `${idPrefix}${i}${letter}`, label: `${displayPrefix}${i}${letter}` });
    }
  }
  return exercises;
};

export const subjects: Subject[] = [
  {
    id: 'francais',
    name: 'Français',
    icon: '📚',
    color: 'pastel-pink',
    categories: [
      {
        id: 'transpositions',
        name: 'Transpositions',
        description: 'Exercices de transposition',
        exercises: generateExercises('TRANSPO-', 1, 168, 'T'),
      },
      {
        id: 'jeux-lecture-s',
        name: 'Jeux de lecture S',
        description: 'Série S',
        exercises: generateExercises('S', 1, 35),
      },
      {
        id: 'jeux-lecture-l',
        name: 'Jeux de lecture L',
        description: 'Série L',
        exercises: generateExercises('L', 1, 20),
      },
      {
        id: 'jeux-lecture-p',
        name: 'Jeux de lecture P',
        description: 'Série P',
        exercises: generateExercises('P', 1, 20),
      },
      {
        id: 'lecture-verifix',
        name: 'Lecture VERIFIX',
        description: 'Exercices VERIFIX',
        exercises: generateExercises('VERIFIX-', 1, 60, 'V'),
      },
    ],
  },
  {
    id: 'informatique',
    name: 'Informatique',
    icon: '💻',
    color: 'pastel-blue',
    categories: [
      {
        id: 'recherche-internet',
        name: 'Recherche Internet',
        description: 'Trouver des informations en ligne',
        exercises: generateExercises('INTERNET-', 1, 72, 'I'),
      },
      {
        id: 'defis-word',
        name: 'Défis Copie WORD',
        description: 'Traitement de texte et mise en forme',
        exercises: generateExercises('WORD-', 1, 120, 'W'),
      },
      {
        id: 'defis-diaporama',
        name: 'Défis Diaporama',
        description: 'Présentations et diapos',
        exercises: generateExercises('DIAPO-', 1, 120, 'Di'),
      },
    ],
  },
  {
    id: 'geometrie',
    name: 'Géométrie',
    icon: '📐',
    color: 'pastel-purple',
    categories: [
      {
        id: 'reproduction-couleurs',
        name: 'Reproduction Couleurs',
        description: 'Reproduction avec couleurs',
        exercises: generateExercises('RCOU-', 1, 80, 'RC'),
      },
      {
        id: 'reproduction-regle',
        name: 'Reproduction Règle',
        description: 'Reproduction avec la règle',
        exercises: generateExercises('RREG-', 1, 101, 'RR'),
      },
    ],
  },
  {
    id: 'operations',
    name: 'Opérations',
    icon: '➕',
    color: 'pastel-yellow',
    categories: [
      {
        id: 'additions',
        name: 'Additions',
        description: '100 additions',
        exercises: generateExercises('A', 1, 100),
      },
      {
        id: 'soustractions',
        name: 'Soustractions',
        description: '100 soustractions',
        exercises: generateExercises('S', 1, 100).map(e => ({ ...e, id: `OP-${e.id}`, label: e.label })),
      },
      {
        id: 'multiplications',
        name: 'Multiplications',
        description: '100 multiplications',
        exercises: generateExercises('M', 1, 100).map(e => ({ ...e, id: `OP-${e.id}`, label: e.label })),
      },
      {
        id: 'divisions',
        name: 'Divisions',
        description: '100 divisions',
        exercises: generateExercises('D', 1, 100),
      },
    ],
  },
  {
    id: 'problemes',
    name: 'Problèmes',
    icon: '🧩',
    color: 'pastel-green',
    categories: [
      {
        id: 'problemes-main',
        name: 'Problèmes',
        description: '120 problèmes à résoudre',
        exercises: generateExercises('PROB-', 1, 120, 'Pb'),
      },
    ],
  },
  {
    id: 'grandeurs-mesures',
    name: 'Grandeurs et Mesures',
    icon: '📏',
    color: 'pastel-orange',
    categories: [
      {
        id: 'masses',
        name: 'Masses',
        description: '60 numéros × 4 exercices',
        exercises: generateLetterExercises('M', 1, 60, ['a', 'b', 'c', 'd']),
      },
      {
        id: 'longueurs',
        name: 'Longueurs',
        description: '60 numéros × 6 exercices',
        exercises: generateLetterExercises('L', 1, 60, ['a', 'b', 'c', 'd', 'e', 'f']),
      },
      {
        id: 'capacites',
        name: 'Capacités',
        description: '60 numéros × 2 exercices',
        exercises: generateLetterExercises('C', 1, 60, ['a', 'b']),
      },
    ],
  },
  {
    id: 'heure-duree',
    name: 'Heure et Durée',
    icon: '🕐',
    color: 'pastel-cyan',
    categories: [
      {
        id: 'heure-main',
        name: 'Heure et Durée',
        description: '60 numéros × 2 exercices',
        exercises: generateLetterExercises('H', 1, 60, ['a', 'b']),
      },
    ],
  },
  {
    id: 'monnaie',
    name: 'Monnaie',
    icon: '💰',
    color: 'pastel-rose',
    categories: [
      {
        id: 'je-rends-monnaie',
        name: 'Je rends la monnaie',
        description: '124 exercices',
        exercises: generateExercises('J', 1, 124),
      },
      {
        id: 'soldes-1-etoile',
        name: 'Soldes ⭐',
        description: 'Niveau 1 étoile bleue - 92 exercices',
        exercises: generateExercises('⭐', 1, 92),
      },
      {
        id: 'soldes-2-etoiles',
        name: 'Soldes ⭐⭐',
        description: 'Niveau 2 étoiles orange - 92 exercices',
        exercises: generateExercises('⭐⭐', 1, 92),
      },
      {
        id: 'promo',
        name: 'Promo',
        description: '224 exercices',
        exercises: generateExercises('%', 1, 224),
      },
    ],
  },
];

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find(s => s.id === id);
};

export const getTotalExercisesForSubject = (subjectId: string): number => {
  const subject = getSubjectById(subjectId);
  if (!subject) return 0;
  return subject.categories.reduce((total, cat) => total + cat.exercises.length, 0);
};

export const getAllExerciseIdsForSubject = (subjectId: string): string[] => {
  const subject = getSubjectById(subjectId);
  if (!subject) return [];
  return subject.categories.flatMap(cat => cat.exercises.map(e => e.id));
};
