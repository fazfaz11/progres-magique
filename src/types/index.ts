export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  completedExercises: Record<string, string[]>; // subjectId -> exerciseIds[]
}

export interface Exercise {
  id: string;
  label: string;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  categories: ExerciseCategory[];
}

export type SubjectId = 
  | 'francais' 
  | 'informatique' 
  | 'geometrie' 
  | 'operations' 
  | 'problemes' 
  | 'grandeurs-mesures' 
  | 'heure-duree' 
  | 'monnaie';
