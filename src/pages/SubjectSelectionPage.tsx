import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubjectCard } from '@/components/SubjectCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useStudents } from '@/hooks/useStudents';
import { subjects } from '@/data/subjects';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';

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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">Choisis une matière</p>
              </div>
            </div>
          </div>
          
          {/* Global Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">PROGRESSION GLOBALE</span>
              <span className="text-sm font-bold text-primary">{totalProgress.percentage}%</span>
            </div>
            <ProgressBar percentage={totalProgress.percentage} showStars={true} size="md" />
          </div>
        </div>
      </header>

      {/* Subjects Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {subjects.map((subject, index) => {
            const progress = getProgress(student.id, subject.id);
            
            return (
              <div key={subject.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <SubjectCard
                  name={subject.name}
                  icon={subject.icon}
                  color={subject.color}
                  completed={progress.completed}
                  total={progress.total}
                  percentage={progress.percentage}
                  onClick={() => handleSubjectClick(subject.id)}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SubjectSelectionPage;
