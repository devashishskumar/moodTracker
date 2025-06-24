import React, { createContext, useContext, ReactNode } from 'react';
import { useMoodData } from '../hooks/useMoodData';

const MoodDataContext = createContext<ReturnType<typeof useMoodData> | undefined>(undefined);

export const useMoodDataContext = () => {
  const context = useContext(MoodDataContext);
  if (context === undefined) {
    throw new Error('useMoodDataContext must be used within a MoodDataProvider');
  }
  return context;
};

interface MoodDataProviderProps {
  children: ReactNode;
}

export const MoodDataProvider: React.FC<MoodDataProviderProps> = ({ children }) => {
  const moodData = useMoodData();

  return (
    <MoodDataContext.Provider value={moodData}>
      {children}
    </MoodDataContext.Provider>
  );
}; 