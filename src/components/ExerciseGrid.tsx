import React from 'react';
import { ExerciseTile } from './ExerciseTile';
import { Exercise } from '@/types';

interface ExerciseGridProps {
  exercises: Exercise[];
  completedExercises: string[];
  onToggleExercise: (exerciseId: string) => void;
}

export const ExerciseGrid: React.FC<ExerciseGridProps> = ({
  exercises,
  completedExercises,
  onToggleExercise,
}) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
      {exercises.map((exercise) => (
        <ExerciseTile
          key={exercise.id}
          id={exercise.id}
          label={exercise.label}
          isCompleted={completedExercises.includes(exercise.id)}
          onToggle={() => onToggleExercise(exercise.id)}
        />
      ))}
    </div>
  );
};
