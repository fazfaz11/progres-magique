import React from 'react';
import { ProgressBar } from './ProgressBar';

interface SubjectCardProps {
  name: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
  percentage: number;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  name,
  icon,
  color,
  completed,
  total,
  percentage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`subject-card bg-${color} animate-slide-up cursor-pointer`}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="text-5xl">{icon}</span>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {completed} / {total} exercices
          </p>
        </div>
        
        <div className="w-full">
          <ProgressBar percentage={percentage} size="sm" showStars={false} />
          <p className="text-center text-lg font-bold mt-2 text-primary">
            {percentage}%
          </p>
        </div>
      </div>
    </div>
  );
};
