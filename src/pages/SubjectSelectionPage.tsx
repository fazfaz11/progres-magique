import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProgressBar } from '@/components/ProgressBar';
import { useStudents } from '@/hooks/useStudents';
import { subjects } from '@/data/subjects';
import { ArrowLeft, User } from 'lucide-react';

const subjectColors: Record<string, { bg: string; hoverBg: string; textColor: string }> = {
  'francais': { bg: 'bg-section-pink/40', hoverBg: 'hover:bg-section-pink/60', textColor: 'text-pink-700' },
  'informatique': { bg: 'bg-section-blue/40', hoverBg: 'hover:bg-section-blue/60', textColor: 'text-cyan-700' },
  'geometrie': { bg: 'bg-section-purple/40', hoverBg: 'hover:bg-section-purple/60', textColor: 'text-purple-700' },
  'operations': { bg: 'bg-section-yellow/40', hoverBg: 'hover:bg-section-yellow/60', textColor: 'text-yellow-700' },
  'problemes': { bg: 'bg-section-green/40', hoverBg: 'hover:bg-section-green/60', textColor: 'text-green-700' },
  'grandeurs-mesures': { bg: 'bg-section-orange/40', hoverBg: 'hover:bg-section-orange/60', textColor: 'text-orange-700' },
  'heure-duree': { bg: 'bg-section-cyan/40', hoverBg: 'hover:bg-section-cyan/60', textColor: 'text-cyan-700' },
  'monnaie': { bg: 'bg-section-rose/40', hoverBg: 'hover:bg-section-rose/60', textColor: 'text-rose-700' },
};

const SubjectSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const { getStudent, getProgress, getTotalProgress } = useStudents();

  const student = getStudent(studentId || '');
  
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Élève non trouvé</p>
      </div>
    );
  }

  const totalProgress = getTotalProgress(student.id);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/student/${studentId}/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-background font-display pb-20">
      {/* Header */}
      <header className="bg-card border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-sm">Retour</span>
            </button>
            
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-completed flex items-center justify-center text-white font-black text-xl">
                {student.firstName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-sm font-medium text-gray-400">Choisis une matière</p>
              </div>
            </div>
          </div>
          
          {/* Global Progress */}
          <div className="mt-4 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">PROGRESSION GLOBALE</span>
              <span className="text-sm font-black text-primary">{totalProgress.percentage}%</span>
            </div>
            <ProgressBar percentage={totalProgress.percentage} showStars={true} size="md" />
          </div>
        </div>
      </header>

      {/* Subjects Grid */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {subjects.map((subject, index) => {
            const progress = getProgress(student.id, subject.id);
            const colors = subjectColors[subject.id] || { 
              bg: 'bg-section-purple/40', 
              hoverBg: 'hover:bg-section-purple/60', 
              textColor: 'text-purple-700' 
            };
            
            return (
              <div 
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colors.bg} ${colors.hoverBg} animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col items-center gap-4">
                  <span className="text-5xl">{subject.icon}</span>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-black text-foreground uppercase">{subject.name}</h3>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                      {progress.completed} / {progress.total} exercices
                    </p>
                  </div>
                  
                  <div className="w-full">
                    <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-completed rounded-full transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className={`text-center text-lg font-black mt-2 ${colors.textColor}`}>
                      {progress.percentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SubjectSelectionPage;
