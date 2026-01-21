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
        className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold transition-all duration-200 select-none cursor-pointer text-[10px] leading-tight text-center p-1 border-2 ${
          isCompleted 
            ? 'bg-completed text-white border-completed-dark shadow-inner border-b-4' 
            : 'bg-white text-gray-700 border-gray-300 border-b-4 border-b-gray-400 hover:border-primary hover:border-b-primary-dark active:translate-y-0.5 active:border-b-2'
        }`}
      >
        <span className="break-words hyphens-auto overflow-hidden">{label}</span>
      </button>
      
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="text-2xl animate-bounce-in">🎉</span>
        </div>
      )}
    </div>
  );
};
