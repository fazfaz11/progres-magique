import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExerciseGrid } from '@/components/ExerciseGrid';
import { ProgressBar } from '@/components/ProgressBar';
import { Confetti } from '@/components/Confetti';
import { useStudents } from '@/hooks/useStudents';
import { getSubjectById } from '@/data/subjects';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExercisesPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentId, subjectId } = useParams<{ studentId: string; subjectId: string }>();
  const { getStudent, getProgress, toggleExercise } = useStudents();
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousPercentage, setPreviousPercentage] = useState(0);

  const student = getStudent(studentId || '');
  const subject = getSubjectById(subjectId || '');

  if (!student || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Page non trouvée</p>
      </div>
    );
  }

  const progress = getProgress(student.id, subject.id);
  const completedExercises = student.completedExercises[subject.id] || [];

  const handleToggleExercise = (exerciseId: string) => {
    const wasCompleted = completedExercises.includes(exerciseId);
    toggleExercise(student.id, subject.id, exerciseId);
    
    // Check if we crossed a 10% milestone
    if (!wasCompleted) {
      const newCompleted = completedExercises.length + 1;
      const total = progress.total;
      const newPercentage = Math.floor((newCompleted / total) * 100);
      const oldPercentage = Math.floor((completedExercises.length / total) * 100);
      
      if (Math.floor(newPercentage / 10) > Math.floor(oldPercentage / 10)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const colorClasses: Record<string, string> = {
    'pastel-pink': 'bg-pastel-pink',
    'pastel-blue': 'bg-pastel-blue',
    'pastel-green': 'bg-pastel-green',
    'pastel-yellow': 'bg-pastel-yellow',
    'pastel-purple': 'bg-pastel-purple',
    'pastel-orange': 'bg-pastel-orange',
    'pastel-cyan': 'bg-pastel-cyan',
    'pastel-rose': 'bg-pastel-rose',
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Confetti isActive={showConfetti} />
      
      {/* Header */}
      <header className={`${colorClasses[subject.color]} border-b border-border sticky top-0 z-10`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/student/${studentId}/subjects`)}
              className="rounded-full bg-card/50 hover:bg-card"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-4xl">{subject.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-foreground">{subject.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {student.firstName} {student.lastName}
                </p>
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-2 bg-card/60 px-4 py-2 rounded-full">
              <span className="font-bold text-primary">{progress.completed}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground">{progress.total}</span>
            </div>
          </div>
          
          {/* Subject Progress */}
          <div className="mt-4">
            <ProgressBar percentage={progress.percentage} showStars={true} size="md" />
          </div>
        </div>
      </header>

      {/* Categories */}
      <main className="container mx-auto px-4 py-6">
        {subject.categories.length > 1 ? (
          <Tabs defaultValue={subject.categories[0].id} className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent mb-6">
              {subject.categories.map((category) => {
                const categoryCompleted = category.exercises.filter(e => 
                  completedExercises.includes(e.id)
                ).length;
                
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex-1 min-w-[150px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span>{category.name}</span>
                    <span className="ml-2 text-xs opacity-75">
                      {categoryCompleted}/{category.exercises.length}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {subject.categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <ExerciseGrid
                  exercises={category.exercises}
                  completedExercises={completedExercises}
                  onToggleExercise={handleToggleExercise}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground">{subject.categories[0].name}</h2>
              <p className="text-sm text-muted-foreground">{subject.categories[0].description}</p>
            </div>
            <ExerciseGrid
              exercises={subject.categories[0].exercises}
              completedExercises={completedExercises}
              onToggleExercise={handleToggleExercise}
            />
          </div>
        )}
      </main>

      {/* Footer Legend */}
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
          <span className="text-xs">Clique sur un numéro pour valider ton exercice</span>
        </div>
      </footer>
    </div>
  );
};

export default ExercisesPage;
