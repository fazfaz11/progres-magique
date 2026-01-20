import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showStars?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  showStars = true,
  size = 'md' 
}) => {
  const starCount = Math.floor(percentage / 10);
  const heights = { sm: 'h-2', md: 'h-4', lg: 'h-6' };
  
  return (
    <div className="w-full">
      <div className={`relative w-full ${heights[size]} bg-muted rounded-full overflow-hidden`}>
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showStars && (
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <span
              key={index}
              className={`progress-star ${
                index < starCount 
                  ? 'progress-star-filled animate-star-pop' 
                  : 'progress-star-empty'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
