import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExerciseTile } from '@/components/ExerciseTile';
import { ProgressBar } from '@/components/ProgressBar';
import { Confetti } from '@/components/Confetti';
import { useStudents } from '@/hooks/useStudents';
import { getSubjectById } from '@/data/subjects';
import { ArrowLeft, Info } from 'lucide-react';
import { useState } from 'react';

const sectionColors: Record<string, { bg: string; headerBg: string; textColor: string }> = {
  'transpositions': { bg: 'bg-section-pink/30', headerBg: 'bg-section-pink/50', textColor: 'text-pink-700' },
  'jeux-lecture-s': { bg: 'bg-section-purple/30', headerBg: 'bg-section-purple/50', textColor: 'text-purple-700' },
  'jeux-lecture-l': { bg: 'bg-section-blue/20', headerBg: 'bg-section-blue/40', textColor: 'text-cyan-700' },
  'jeux-lecture-p': { bg: 'bg-section-violet/20', headerBg: 'bg-section-violet/40', textColor: 'text-violet-700' },
  'lecture-verifix': { bg: 'bg-section-green/30', headerBg: 'bg-section-green/50', textColor: 'text-green-700' },
  'recherche-internet': { bg: 'bg-section-purple/30', headerBg: 'bg-section-purple/50', textColor: 'text-purple-700' },
  'defis-word': { bg: 'bg-section-blue/20', headerBg: 'bg-section-blue/40', textColor: 'text-cyan-700' },
  'defis-diaporama': { bg: 'bg-section-violet/20', headerBg: 'bg-section-violet/40', textColor: 'text-violet-700' },
  'reproduction-couleurs': { bg: 'bg-section-pink/30', headerBg: 'bg-section-pink/50', textColor: 'text-pink-700' },
  'reproduction-regle': { bg: 'bg-section-blue/20', headerBg: 'bg-section-blue/40', textColor: 'text-cyan-700' },
  'additions': { bg: 'bg-section-green/30', headerBg: 'bg-section-green/50', textColor: 'text-green-700' },
  'soustractions': { bg: 'bg-section-orange/30', headerBg: 'bg-section-orange/50', textColor: 'text-orange-700' },
  'multiplications': { bg: 'bg-section-purple/30', headerBg: 'bg-section-purple/50', textColor: 'text-purple-700' },
  'divisions': { bg: 'bg-section-blue/20', headerBg: 'bg-section-blue/40', textColor: 'text-cyan-700' },
  'problemes-main': { bg: 'bg-section-yellow/30', headerBg: 'bg-section-yellow/50', textColor: 'text-yellow-700' },
  'masses': { bg: 'bg-section-orange/30', headerBg: 'bg-section-orange/50', textColor: 'text-orange-700' },
  'longueurs': { bg: 'bg-section-green/30', headerBg: 'bg-section-green/50', textColor: 'text-green-700' },
  'capacites': { bg: 'bg-section-blue/20', headerBg: 'bg-section-blue/40', textColor: 'text-cyan-700' },
  'heure-main': { bg: 'bg-section-cyan/30', headerBg: 'bg-section-cyan/50', textColor: 'text-cyan-700' },
  'je-rends-monnaie': { bg: 'bg-section-pink/30', headerBg: 'bg-section-pink/50', textColor: 'text-pink-700' },
  'soldes-1-etoile': { bg: 'bg-section-blue/20', headerBg: 'bg-section-blue/40', textColor: 'text-blue-700' },
  'soldes-2-etoiles': { bg: 'bg-section-orange/30', headerBg: 'bg-section-orange/50', textColor: 'text-orange-700' },
  'promo': { bg: 'bg-section-purple/30', headerBg: 'bg-section-purple/50', textColor: 'text-purple-700' },
};

const ExercisesPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentId, subjectId } = useParams<{ studentId: string; subjectId: string }>();
  const { getStudent, getProgress, toggleExercise } = useStudents();
  const [showConfetti, setShowConfetti] = useState(false);

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

  const getCategoryCompleted = (categoryId: string) => {
    const category = subject.categories.find(c => c.id === categoryId);
    if (!category) return 0;
    return category.exercises.filter(e => completedExercises.includes(e.id)).length;
  };

  return (
    <div className="h-screen flex flex-col bg-background font-display overflow-hidden">
      <Confetti isActive={showConfetti} />
      
      {/* Header */}
      <header className="bg-card border-b border-gray-100 px-6 py-4 shadow-sm flex-shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(`/student/${studentId}/subjects`)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 font-bold" />
              <span className="font-bold uppercase tracking-wider text-sm">Retour</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase leading-none">AUTONOMIE</h1>
              <h2 className="text-primary text-xl font-black tracking-tight uppercase leading-none">{subject.name}</h2>
            </div>
          </div>
          
          <div className="flex-grow max-w-2xl mx-12">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Progression Globale</span>
            </div>
            <ProgressBar percentage={progress.percentage} showStars={true} size="md" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase">Élève</p>
              <p className="text-sm font-black text-foreground">{student.firstName} {student.lastName.charAt(0)}.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-completed border-2 border-white shadow-sm flex items-center justify-center text-white font-black">
              {student.firstName.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Grid of Categories */}
      <main 
        className="flex-1 w-full mx-auto grid min-h-0" 
        style={{ 
          gridTemplateColumns: `repeat(${subject.categories.length}, 1fr)`,
          maxWidth: subject.categories.length <= 3 ? '1440px' : '100%'
        }}
      >
        {subject.categories.map((category, index) => {
          const colors = sectionColors[category.id] || { 
            bg: 'bg-section-purple/30', 
            headerBg: 'bg-section-purple/50', 
            textColor: 'text-purple-700' 
          };
          const categoryCompleted = getCategoryCompleted(category.id);
          
          return (
            <section 
              key={category.id} 
              className={`flex flex-col min-h-0 ${index < subject.categories.length - 1 ? 'border-r border-black/5' : ''} ${colors.bg}`}
            >
              <div className={`section-header flex-shrink-0 ${colors.headerBg}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{category.name}</h3>
                  <span className={`bg-white/50 px-3 py-1 rounded-full text-xs font-black ${colors.textColor}`}>
                    {categoryCompleted}/{category.exercises.length}
                  </span>
                </div>
                <p className={`text-xs font-bold uppercase opacity-60 ${colors.textColor}`}>{category.description}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {category.exercises.map((exercise) => (
                    <ExerciseTile
                      key={exercise.id}
                      id={exercise.id}
                      label={exercise.label}
                      isCompleted={completedExercises.includes(exercise.id)}
                      onToggle={() => handleToggleExercise(exercise.id)}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default ExercisesPage;
