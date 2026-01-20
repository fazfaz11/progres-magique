import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '@/hooks/useStudents';
import { useApp } from '@/context/AppContext';
import { subjects } from '@/data/subjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  UserPlus, 
  Trash2, 
  RotateCcw, 
  Edit2, 
  Check, 
  X,
  Users,
  BarChart3
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsTeacherMode } = useApp();
  const { 
    students, 
    getProgress,
    getTotalProgress,
    getTotalCompletedExercises,
    updateStudent, 
    addStudent, 
    removeStudent, 
    resetProgress,
    getStudentsSortedByProgress,
  } = useStudents();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const handleBack = () => {
    setIsTeacherMode(false);
    navigate('/');
  };

  const handleStartEdit = (student: { id: string; firstName: string; lastName: string }) => {
    setEditingId(student.id);
    setEditFirstName(student.firstName);
    setEditLastName(student.lastName);
  };

  const handleSaveEdit = () => {
    if (editingId && editFirstName.trim() && editLastName.trim()) {
      updateStudent(editingId, editFirstName.trim(), editLastName.trim());
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAddStudent = () => {
    if (newFirstName.trim() && newLastName.trim()) {
      addStudent(newFirstName.trim(), newLastName.trim());
      setNewFirstName('');
      setNewLastName('');
    }
  };

  const sortedStudents = getStudentsSortedByProgress();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍🏫</span>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mode Enseignant</h1>
                <p className="text-sm text-muted-foreground">Gestion des élèves et progression</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vue d'ensemble de la classe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-pastel-blue rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-foreground">{students.length}</div>
                <div className="text-sm text-muted-foreground">Élèves</div>
              </div>
              <div className="bg-pastel-green rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-foreground">
                  {students.reduce((sum, s) => sum + getTotalCompletedExercises(s.id), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Exercices terminés</div>
              </div>
              <div className="bg-pastel-yellow rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-foreground">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + getTotalProgress(s.id).percentage, 0) / students.length)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Progression moyenne</div>
              </div>
              <div className="bg-pastel-pink rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-foreground">{subjects.length}</div>
                <div className="text-sm text-muted-foreground">Matières</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Student */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Ajouter un élève
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Prénom"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Nom"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddStudent} disabled={!newFirstName.trim() || !newLastName.trim()}>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des élèves ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedStudents.map((student, index) => {
                const totalProgress = getTotalProgress(student.id);
                const totalExercises = getTotalCompletedExercises(student.id);
                
                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-muted-foreground w-8">
                      #{index + 1}
                    </div>
                    
                    <div className="text-3xl">📓</div>
                    
                    {editingId === student.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <Input
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          placeholder="Prénom"
                          className="flex-1"
                        />
                        <Input
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          placeholder="Nom"
                          className="flex-1"
                        />
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                            <Check className="h-4 w-4 text-primary" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {totalExercises} exercices • {totalProgress.percentage}%
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleStartEdit(student)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Réinitialiser la progression ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Choisissez de réinitialiser toutes les matières ou une seule.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Toutes les matières" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Toutes les matières</SelectItem>
                                  {subjects.map(s => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.icon} {s.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    resetProgress(
                                      student.id, 
                                      selectedSubject === 'all' ? undefined : selectedSubject
                                    );
                                    setSelectedSubject('all');
                                  }}
                                >
                                  Réinitialiser
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cet élève ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Toutes les données de {student.firstName} seront perdues.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeStudent(student.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress by Subject */}
        <Card>
          <CardHeader>
            <CardTitle>Progression par matière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Élève</th>
                    {subjects.map(s => (
                      <th key={s.id} className="text-center py-2 px-1">
                        <span className="text-lg">{s.icon}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map(student => (
                    <tr key={student.id} className="border-b">
                      <td className="py-2 px-2 font-medium">
                        {student.firstName} {student.lastName.charAt(0)}.
                      </td>
                      {subjects.map(s => {
                        const progress = getProgress(student.id, s.id);
                        return (
                          <td key={s.id} className="text-center py-2 px-1">
                            <span className={`inline-block min-w-[40px] px-2 py-1 rounded text-xs font-bold ${
                              progress.percentage === 100 
                                ? 'bg-completed text-primary-foreground' 
                                : progress.percentage > 50 
                                  ? 'bg-pastel-green text-foreground' 
                                  : progress.percentage > 0 
                                    ? 'bg-pastel-yellow text-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                              {progress.percentage}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherDashboardPage;
