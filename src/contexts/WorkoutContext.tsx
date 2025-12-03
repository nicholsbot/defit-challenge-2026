import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CardioLog, 
  StrengthLog, 
  HIITLog, 
  TMARMLog, 
  WorkoutTotals,
  CHALLENGE_MINIMUMS 
} from '@/types/workout';

interface WorkoutContextType {
  cardioLogs: CardioLog[];
  strengthLogs: StrengthLog[];
  hiitLogs: HIITLog[];
  tmarmLogs: TMARMLog[];
  totals: WorkoutTotals;
  addCardioLog: (log: CardioLog) => void;
  addStrengthLog: (log: StrengthLog) => void;
  addHIITLog: (log: HIITLog) => void;
  addTMARMLog: (log: TMARMLog) => void;
  getProgressPercentage: (category: keyof WorkoutTotals) => number;
  isComplete: (category: keyof WorkoutTotals) => boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEY = 'defit_workout_logs';

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);
  const [strengthLogs, setStrengthLogs] = useState<StrengthLog[]>([]);
  const [hiitLogs, setHIITLogs] = useState<HIITLog[]>([]);
  const [tmarmLogs, setTMARMLogs] = useState<TMARMLog[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setCardioLogs(data.cardioLogs || []);
        setStrengthLogs(data.strengthLogs || []);
        setHIITLogs(data.hiitLogs || []);
        setTMARMLogs(data.tmarmLogs || []);
      } catch (e) {
        console.error('Failed to load workout logs:', e);
      }
    }
  }, []);

  // Save to localStorage whenever logs change
  useEffect(() => {
    const data = { cardioLogs, strengthLogs, hiitLogs, tmarmLogs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [cardioLogs, strengthLogs, hiitLogs, tmarmLogs]);

  // Calculate totals
  const totals: WorkoutTotals = {
    cardioMiles: cardioLogs.reduce((sum, log) => sum + log.distance, 0),
    strengthLbs: strengthLogs.reduce((sum, log) => sum + log.totalWeight, 0),
    hiitMinutes: hiitLogs.reduce((sum, log) => sum + log.duration, 0),
    tmarmMinutes: tmarmLogs.reduce((sum, log) => sum + log.duration, 0),
  };

  const addCardioLog = (log: CardioLog) => {
    setCardioLogs(prev => [...prev, log]);
    // TODO: POST /api/logs/cardio
  };

  const addStrengthLog = (log: StrengthLog) => {
    setStrengthLogs(prev => [...prev, log]);
    // TODO: POST /api/logs/strength
  };

  const addHIITLog = (log: HIITLog) => {
    setHIITLogs(prev => [...prev, log]);
    // TODO: POST /api/logs/hiit
  };

  const addTMARMLog = (log: TMARMLog) => {
    setTMARMLogs(prev => [...prev, log]);
    // TODO: POST /api/logs/tmarm
  };

  const getProgressPercentage = (category: keyof WorkoutTotals): number => {
    const current = totals[category];
    const minimum = CHALLENGE_MINIMUMS[category];
    return Math.min((current / minimum) * 100, 100);
  };

  const isComplete = (category: keyof WorkoutTotals): boolean => {
    return totals[category] >= CHALLENGE_MINIMUMS[category];
  };

  return (
    <WorkoutContext.Provider value={{
      cardioLogs,
      strengthLogs,
      hiitLogs,
      tmarmLogs,
      totals,
      addCardioLog,
      addStrengthLog,
      addHIITLog,
      addTMARMLog,
      getProgressPercentage,
      isComplete,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
