import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/types';
import { initialStudents } from '@/data/initialStudents';
import { subjects, getTotalExercisesForSubject } from '@/data/subjects';

const STORAGE_KEY = 'ulis-progress-students';

// Déclaration du type pour le bridge Electron
declare global {
  interface Window {
    electronStorage?: {
      saveStudents: (students: Student[]) => Promise<boolean>;
      loadStudents: () => Promise<Student[] | null>;
    };
  }
}

// Fonction pour charger les données (Electron ou localStorage)
const loadStudentsData = async (): Promise<Student[]> => {
  // Mode Electron
  if (window.electronStorage) {
    try {
      const data = await window.electronStorage.loadStudents();
      if (data) return data;
    } catch (error) {
      console.error('Erreur chargement Electron:', error);
    }
    return initialStudents;
  }
  
  // Mode navigateur (fallback localStorage)
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialStudents;
    }
  }
  return initialStudents;
};

// Fonction pour sauvegarder les données (Electron ou localStorage)
const saveStudentsData = async (students: Student[]): Promise<void> => {
  // Mode Electron
  if (window.electronStorage) {
    try {
      await window.electronStorage.saveStudents(students);
    } catch (error) {
      console.error('Erreur sauvegarde Electron:', error);
    }
    return;
  }
  
  // Mode navigateur (fallback localStorage)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isLoaded, setIsLoaded] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    loadStudentsData().then(data => {
      setStudents(data);
      setIsLoaded(true);
    });
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (isLoaded) {
      saveStudentsData(students);
    }
  }, [students, isLoaded]);

  const getStudent = useCallback((id: string): Student | undefined => {
    return students.find(s => s.id === id);
  }, [students]);

  const toggleExercise = useCallback((studentId: string, subjectId: string, exerciseId: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      
      const subjectExercises = student.completedExercises[subjectId] || [];
      const isCompleted = subjectExercises.includes(exerciseId);
      
      return {
        ...student,
        completedExercises: {
          ...student.completedExercises,
          [subjectId]: isCompleted
            ? subjectExercises.filter(id => id !== exerciseId)
            : [...subjectExercises, exerciseId],
        },
      };
    }));
  }, []);

  const getProgress = useCallback((studentId: string, subjectId: string): { completed: number; total: number; percentage: number } => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = student.completedExercises[subjectId]?.length || 0;
    const total = getTotalExercisesForSubject(subjectId);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  }, [students]);

  const getTotalProgress = useCallback((studentId: string): { completed: number; total: number; percentage: number } => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { completed: 0, total: 0, percentage: 0 };
    
    let totalCompleted = 0;
    let totalExercises = 0;
    
    subjects.forEach(subject => {
      totalCompleted += student.completedExercises[subject.id]?.length || 0;
      totalExercises += getTotalExercisesForSubject(subject.id);
    });
    
    const percentage = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
    
    return { completed: totalCompleted, total: totalExercises, percentage };
  }, [students]);

  const getTotalCompletedExercises = useCallback((studentId: string): number => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;
    
    return Object.values(student.completedExercises).reduce((sum, exercises) => sum + exercises.length, 0);
  }, [students]);

  const resetProgress = useCallback((studentId: string, subjectId?: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      
      if (subjectId) {
        const { [subjectId]: _, ...rest } = student.completedExercises;
        return { ...student, completedExercises: rest };
      }
      
      return { ...student, completedExercises: {} };
    }));
  }, []);

  const updateStudent = useCallback((studentId: string, firstName: string, lastName: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, firstName, lastName } : student
    ));
  }, []);

  const addStudent = useCallback((firstName: string, lastName: string) => {
    const newId = String(Math.max(...students.map(s => parseInt(s.id)), 0) + 1);
    setStudents(prev => [...prev, { id: newId, firstName, lastName, completedExercises: {} }]);
  }, [students]);

  const removeStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  const getStudentsSortedByProgress = useCallback(() => {
    return [...students].sort((a, b) => {
      const aTotal = getTotalCompletedExercises(a.id);
      const bTotal = getTotalCompletedExercises(b.id);
      return bTotal - aTotal;
    });
  }, [students, getTotalCompletedExercises]);

  const getStudentRank = useCallback((studentId: string): { rank: number; isExAequo: boolean } => {
    const sorted = getStudentsSortedByProgress();
    const studentTotal = getTotalCompletedExercises(studentId);
    
    let rank = 1;
    let currentRankTotal = getTotalCompletedExercises(sorted[0]?.id);
    
    for (let i = 0; i < sorted.length; i++) {
      const total = getTotalCompletedExercises(sorted[i].id);
      if (total < currentRankTotal) {
        rank = i + 1;
        currentRankTotal = total;
      }
      if (sorted[i].id === studentId) {
        const sameRankCount = sorted.filter(s => getTotalCompletedExercises(s.id) === studentTotal).length;
        return { rank, isExAequo: sameRankCount > 1 };
      }
    }
    
    return { rank: sorted.length, isExAequo: false };
  }, [getStudentsSortedByProgress, getTotalCompletedExercises]);

  return {
    students,
    isLoaded,
    getStudent,
    toggleExercise,
    getProgress,
    getTotalProgress,
    getTotalCompletedExercises,
    resetProgress,
    updateStudent,
    addStudent,
    removeStudent,
    getStudentsSortedByProgress,
    getStudentRank,
  };
};
