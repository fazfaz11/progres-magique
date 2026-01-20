import React, { useState, useEffect } from 'react';

interface ExerciseTileProps {
  id: string;
  label: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ExerciseTile: React.FC<ExerciseTileProps> = ({
  label,
  isCompleted,
  onToggle,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(isCompleted);

  useEffect(() => {
    if (isCompleted && !wasCompleted) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 1000);
      return () => clearTimeout(timer);
    }
    setWasCompleted(isCompleted);
  }, [isCompleted, wasCompleted]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`exercise-tile w-full aspect-square text-sm md:text-base ${
          isCompleted ? 'exercise-tile-completed' : ''
        }`}
      >
        {label}
        {isCompleted && (
          <span className="absolute top-1 right-1 text-xs">✓</span>
        )}
      </button>
      
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="text-2xl animate-bounce-in">🎉</span>
        </div>
      )}
    </div>
  );
};
