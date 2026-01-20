import React from 'react';

interface TrophyBadgeProps {
  rank: number;
  isExAequo?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrophyBadge: React.FC<TrophyBadgeProps> = ({ 
  rank, 
  isExAequo = false,
  size = 'md' 
}) => {
  const getTrophyColor = () => {
    if (rank === 1) return 'text-gold';
    if (rank === 2) return 'text-silver';
    if (rank === 3) return 'text-bronze';
    return 'text-muted-foreground';
  };

  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${sizes[size]} ${getTrophyColor()} drop-shadow-lg animate-float`}>
        🏆
        <span className="absolute -bottom-1 -right-1 bg-card rounded-full px-1.5 text-xs font-bold text-foreground border border-border">
          {rank}
        </span>
      </div>
      {isExAequo && (
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          ex æquo
        </span>
      )}
    </div>
  );
};
