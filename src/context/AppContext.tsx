import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentStudentId: string | null;
  setCurrentStudentId: (id: string | null) => void;
  isTeacherMode: boolean;
  setIsTeacherMode: (mode: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  return (
    <AppContext.Provider value={{
      currentStudentId,
      setCurrentStudentId,
      isTeacherMode,
      setIsTeacherMode,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
