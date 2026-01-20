import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentCard } from '@/components/StudentCard';
import { useStudents } from '@/hooks/useStudents';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📊</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SUIVI DES PROGRÈS ULIS</h1>
                <p className="text-sm text-muted-foreground">Clique sur ton prénom pour commencer</p>
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
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {sortedStudents.map((student, index) => {
            const { rank, isExAequo } = getStudentRank(student.id);
            const totalExercises = getTotalCompletedExercises(student.id);
            
            return (
              <StudentCard
                key={student.id}
                firstName={student.firstName}
                lastName={student.lastName}
                totalExercises={totalExercises}
                rank={rank}
                isExAequo={isExAequo}
                onClick={() => handleStudentClick(student.id)}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-completed" />
            <span>TERMINÉ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted border border-border" />
            <span>À FAIRE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
