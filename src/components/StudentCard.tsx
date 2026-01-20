import React from 'react';
import { TrophyBadge } from './TrophyBadge';

interface StudentCardProps {
  firstName: string;
  lastName: string;
  totalExercises: number;
  rank: number;
  isExAequo: boolean;
  onClick: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  firstName,
  lastName,
  totalExercises,
  rank,
  isExAequo,
  onClick,
}) => {
  const pastelColors = [
    'bg-pastel-pink',
    'bg-pastel-blue',
    'bg-pastel-green',
    'bg-pastel-yellow',
    'bg-pastel-purple',
    'bg-pastel-orange',
    'bg-pastel-cyan',
    'bg-pastel-rose',
  ];
  
  const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % pastelColors.length;

  return (
    <div
      onClick={onClick}
      className={`student-card ${pastelColors[colorIndex]} animate-slide-up cursor-pointer`}
    >
      <div className="flex flex-col items-center gap-3">
        <TrophyBadge rank={rank} isExAequo={isExAequo} />
        
        <div className="text-4xl">📓</div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">{firstName}</h3>
          <p className="text-sm font-medium text-muted-foreground">{lastName}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card/60 px-3 py-1.5 rounded-full">
          <span className="text-lg">✅</span>
          <span className="font-bold text-foreground">{totalExercises}</span>
          <span className="text-sm text-muted-foreground">exercices</span>
        </div>
      </div>
    </div>
  );
};
