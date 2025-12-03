import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { 
  CardioLog, 
  StrengthLog, 
  HIITLog, 
  TMARMLog, 
  WorkoutTotals,
  CHALLENGE_MINIMUMS,
  CardioType,
} from '@/types/workout';

interface WorkoutContextType {
  cardioLogs: CardioLog[];
  strengthLogs: StrengthLog[];
  hiitLogs: HIITLog[];
  tmarmLogs: TMARMLog[];
  totals: WorkoutTotals;
  loading: boolean;
  addCardioLog: (log: Omit<CardioLog, 'id' | 'createdAt'>) => Promise<void>;
  addStrengthLog: (log: Omit<StrengthLog, 'id' | 'createdAt'>) => Promise<void>;
  addHIITLog: (log: Omit<HIITLog, 'id' | 'createdAt'>) => Promise<void>;
  addTMARMLog: (log: Omit<TMARMLog, 'id' | 'createdAt'>) => Promise<void>;
  getProgressPercentage: (category: keyof WorkoutTotals) => number;
  isComplete: (category: keyof WorkoutTotals) => boolean;
  refreshLogs: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);
  const [strengthLogs, setStrengthLogs] = useState<StrengthLog[]>([]);
  const [hiitLogs, setHIITLogs] = useState<HIITLog[]>([]);
  const [tmarmLogs, setTMARMLogs] = useState<TMARMLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshLogs = async () => {
    if (!user) {
      setCardioLogs([]);
      setStrengthLogs([]);
      setHIITLogs([]);
      setTMARMLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [cardioRes, strengthRes, hiitRes, tmarmRes] = await Promise.all([
        supabase.from('cardio_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('strength_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('hiit_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('tmarm_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      ]);

      if (cardioRes.data) {
        setCardioLogs(cardioRes.data.map(row => ({
          id: row.id,
          date: new Date(row.date),
          type: row.cardio_type as CardioType,
          distance: Number(row.distance),
          distanceUnit: row.distance_unit as 'miles' | 'meters',
          notes: row.notes || undefined,
          verified: row.verified,
          createdAt: new Date(row.created_at),
        })));
      }

      if (strengthRes.data) {
        setStrengthLogs(strengthRes.data.map(row => ({
          id: row.id,
          date: new Date(row.date),
          exerciseName: row.exercise_name,
          sets: row.sets,
          repsPerSet: row.reps_per_set,
          weightPerRep: Number(row.weight_per_rep),
          totalWeight: Number(row.total_weight),
          notes: row.notes || undefined,
          verified: row.verified,
          createdAt: new Date(row.created_at),
        })));
      }

      if (hiitRes.data) {
        setHIITLogs(hiitRes.data.map(row => ({
          id: row.id,
          date: new Date(row.date),
          duration: row.duration,
          description: row.description || undefined,
          verified: row.verified,
          createdAt: new Date(row.created_at),
        })));
      }

      if (tmarmRes.data) {
        setTMARMLogs(tmarmRes.data.map(row => ({
          id: row.id,
          date: new Date(row.date),
          duration: row.duration,
          description: row.description || undefined,
          verified: row.verified,
          createdAt: new Date(row.created_at),
        })));
      }
    } catch (error) {
      console.error('Error fetching workout logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLogs();
  }, [user]);

  // Calculate totals
  const totals: WorkoutTotals = {
    cardioMiles: cardioLogs.reduce((sum, log) => sum + log.distance, 0),
    strengthLbs: strengthLogs.reduce((sum, log) => sum + log.totalWeight, 0),
    hiitMinutes: hiitLogs.reduce((sum, log) => sum + log.duration, 0),
    tmarmMinutes: tmarmLogs.reduce((sum, log) => sum + log.duration, 0),
  };

  const addCardioLog = async (log: Omit<CardioLog, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase.from('cardio_logs').insert({
      user_id: user.id,
      date: log.date.toISOString().split('T')[0],
      cardio_type: log.type,
      distance: log.distance,
      distance_unit: log.distanceUnit,
      notes: log.notes || null,
    });

    if (error) throw error;
    await refreshLogs();
  };

  const addStrengthLog = async (log: Omit<StrengthLog, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase.from('strength_logs').insert({
      user_id: user.id,
      date: log.date.toISOString().split('T')[0],
      exercise_name: log.exerciseName,
      sets: log.sets,
      reps_per_set: log.repsPerSet,
      weight_per_rep: log.weightPerRep,
      total_weight: log.totalWeight,
      notes: log.notes || null,
    });

    if (error) throw error;
    await refreshLogs();
  };

  const addHIITLog = async (log: Omit<HIITLog, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase.from('hiit_logs').insert({
      user_id: user.id,
      date: log.date.toISOString().split('T')[0],
      duration: log.duration,
      description: log.description || null,
    });

    if (error) throw error;
    await refreshLogs();
  };

  const addTMARMLog = async (log: Omit<TMARMLog, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase.from('tmarm_logs').insert({
      user_id: user.id,
      date: log.date.toISOString().split('T')[0],
      duration: log.duration,
      description: log.description || null,
    });

    if (error) throw error;
    await refreshLogs();
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
      loading,
      addCardioLog,
      addStrengthLog,
      addHIITLog,
      addTMARMLog,
      getProgressPercentage,
      isComplete,
      refreshLogs,
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
