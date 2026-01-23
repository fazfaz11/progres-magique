import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '@/hooks/useStudents';
import { useApp } from '@/context/AppContext';
import { Settings, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/Confetti';

// Background colors for cards
const cardColors = [
  'bg-pink-200',
  'bg-sky-200',
  'bg-orange-200',
  'bg-cyan-200',
  'bg-purple-200',
  'bg-emerald-200',
  'bg-rose-200',
  'bg-amber-200',
];

// Avatar colors - bright and distinct
const avatarColors = [
  'bg-rose-400',
  'bg-emerald-400',
  'bg-sky-400',
  'bg-lime-400',
  'bg-violet-400',
  'bg-orange-400',
  'bg-cyan-400',
  'bg-pink-400',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStudentId, setIsTeacherMode } = useApp();
  const { getStudentsSortedByProgress, getTotalProgress, getStudentRank } = useStudents();
  const [showConfetti, setShowConfetti] = useState(false);

  const sortedStudents = getStudentsSortedByProgress();

  // Check if any student in top 3 has progress - trigger confetti on page load
  useEffect(() => {
    const hasTop3Progress = sortedStudents.some((student) => {
      const { rank } = getStudentRank(student.id);
      const { completed } = getTotalProgress(student.id);
      return rank <= 3 && completed > 0;
    });
    
    if (hasTop3Progress) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStudentClick = (studentId: string) => {
    setCurrentStudentId(studentId);
    navigate(`/student/${studentId}/subjects`);
  };

  const handleTeacherMode = () => {
    setIsTeacherMode(true);
    navigate('/teacher');
  };

  const getTrophyEmoji = (rank: number) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getTrophyBgColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400';
    if (rank === 2) return 'bg-gray-300';
    if (rank === 3) return 'bg-amber-600';
    return '';
  };

  return (
    <div className="min-h-screen bg-background font-display">
      <Confetti isActive={showConfetti} />
      
      {/* Header */}
      <header className="bg-card border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📊</span>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase">SUIVI DES PROGRÈS ULIS</h1>
                <p className="text-sm font-medium text-muted-foreground">Sélectionnez votre prénom pour commencer</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleTeacherMode}
              className="rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Students Grid */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {sortedStudents.map((student, index) => {
            const { rank, isExAequo } = getStudentRank(student.id);
            const { completed, total } = getTotalProgress(student.id);
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const starsCount = Math.floor(percentage / 10);
            
            const cardColorIndex = (student.firstName.charCodeAt(0) + student.lastName.charCodeAt(0)) % cardColors.length;
            const avatarColorIndex = (student.firstName.charCodeAt(0) * 2 + student.lastName.charCodeAt(0)) % avatarColors.length;
            
            const trophyEmoji = getTrophyEmoji(rank);
            const showTrophy = rank <= 3;
            
            return (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${cardColors[cardColorIndex]} animate-slide-up border-4 border-gray-800`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Trophy badge for top 3 - only if they have completed exercises */}
                {showTrophy && completed > 0 && (
                  <div className={`absolute -top-4 -left-4 w-20 h-20 rounded-full ${getTrophyBgColor(rank)} flex items-center justify-center shadow-xl border-4 border-white z-10`}>
                    <span className="text-4xl">{trophyEmoji}</span>
                    <span className="absolute -bottom-1 -right-1 bg-white text-lg font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200">
                      {rank}
                    </span>
                  </div>
                )}
                
                {/* Book icon */}
                <div className="flex justify-center mb-2">
                  <BookOpen className="w-5 h-5 text-fuchsia-500" />
                </div>
                
                {/* Avatar circle */}
                <div className="flex justify-center mb-3">
                  <div className={`w-16 h-16 rounded-full ${avatarColors[avatarColorIndex]} flex items-center justify-center text-white text-2xl font-black shadow-lg border-4 border-white/50`}>
                    {student.firstName.charAt(0)}
                  </div>
                </div>
                
                {/* Name with badge background */}
                <div className="text-center mb-3">
                  <div className="inline-block bg-blue-600/90 px-4 py-1 rounded shadow-sm">
                    <h3 className="text-xl font-black text-white">{student.firstName}</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-1">{student.lastName.charAt(0)}</p>
                </div>
                
                {/* Progress section */}
                <div className="space-y-2">
                  {/* Exercise count and percentage */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-800">{completed}/{total} exercices</span>
                    <span className="font-black text-blue-700">{percentage}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                  
                  {/* Stars row */}
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < starsCount ? 'text-yellow-400' : 'text-gray-400/50'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Ex aequo label */}
                {isExAequo && rank <= 3 && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-bold text-white bg-gray-600/80 px-1.5 py-0.5 rounded">
                      ex æquo
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
