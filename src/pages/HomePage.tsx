import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '@/hooks/useStudents';
import { useApp } from '@/context/AppContext';
import { Settings, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pastelColors = [
  'bg-section-pink',
  'bg-section-blue',
  'bg-section-green',
  'bg-section-yellow',
  'bg-section-purple',
  'bg-section-orange',
  'bg-section-cyan',
  'bg-section-rose',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStudentId, setIsTeacherMode } = useApp();
  const { getStudentsSortedByProgress, getTotalCompletedExercises, getStudentRank } = useStudents();

  const sortedStudents = getStudentsSortedByProgress();

  const handleStudentClick = (studentId: string) => {
    setCurrentStudentId(studentId);
    navigate(`/student/${studentId}/subjects`);
  };

  const handleTeacherMode = () => {
    setIsTeacherMode(true);
    navigate('/teacher');
  };

  const getTrophyColor = (rank: number) => {
    if (rank === 1) return 'text-gold';
    if (rank === 2) return 'text-silver';
    if (rank === 3) return 'text-bronze';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-background font-display">
      {/* Header */}
      <header className="bg-card border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📊</span>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase">SUIVI DES PROGRÈS ULIS</h1>
                <p className="text-sm font-medium text-gray-400">Clique sur ton prénom pour commencer</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {sortedStudents.map((student, index) => {
            const { rank, isExAequo } = getStudentRank(student.id);
            const totalExercises = getTotalCompletedExercises(student.id);
            const colorIndex = (student.firstName.charCodeAt(0) + student.lastName.charCodeAt(0)) % pastelColors.length;
            
            return (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                className={`student-card ${pastelColors[colorIndex]}/50 animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Trophy with rank */}
                  <div className="relative">
                    <Trophy className={`w-10 h-10 ${getTrophyColor(rank)} drop-shadow-lg`} fill="currentColor" />
                    <span className="absolute -bottom-1 -right-1 bg-card rounded-full px-1.5 text-xs font-black text-foreground border border-border shadow-sm">
                      {rank}
                    </span>
                  </div>
                  
                  {isExAequo && (
                    <span className="text-[10px] font-bold text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                      ex æquo
                    </span>
                  )}
                  
                  {/* Notebook icon */}
                  <div className="text-3xl">📓</div>
                  
                  {/* Name */}
                  <div className="text-center">
                    <h3 className="text-lg font-black text-foreground">{student.firstName}</h3>
                    <p className="text-sm font-medium text-gray-500">{student.lastName}</p>
                  </div>
                  
                  {/* Exercise count */}
                  <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full">
                    <span className="text-lg">✅</span>
                    <span className="font-black text-foreground">{totalExercises}</span>
                    <span className="text-xs text-gray-500">exercices</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-100 py-3">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-completed" />
            <span className="font-bold uppercase text-xs">TERMINÉ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white border border-gray-200" />
            <span className="font-bold uppercase text-xs">À FAIRE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
