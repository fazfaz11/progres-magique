import React from 'react';
import { Star } from 'lucide-react';

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
      {showStars && (
        <div className="flex justify-end gap-1 mb-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < starCount 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-200'
              }`}
              style={index < starCount ? { animationDelay: `${index * 0.1}s` } : {}}
            />
          ))}
        </div>
      )}
      <div className={`relative w-full ${heights[size]} bg-gray-100 rounded-full overflow-hidden border border-black/5 p-0.5`}>
        <div 
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
