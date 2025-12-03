import { CheckCircle, Clock, Dumbbell, Flame, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useWorkout } from '@/contexts/WorkoutContext';
import { CHALLENGE_MINIMUMS } from '@/types/workout';

interface ProgressCardProps {
  title: string;
  icon: React.ElementType;
  current: number;
  minimum: number;
  unit: string;
  isComplete: boolean;
  percentage: number;
}

function ProgressCard({ title, icon: Icon, current, minimum, unit, isComplete, percentage }: ProgressCardProps) {
  return (
    <div className={`glass rounded-2xl p-6 ${isComplete ? 'border-primary/50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isComplete ? 'bg-primary/20' : 'bg-primary/10'
          }`}>
            <Icon className={`w-5 h-5 ${isComplete ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="font-heading font-bold text-foreground uppercase tracking-wide">{title}</h3>
        </div>
        {isComplete && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase">Complete</span>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-heading font-bold text-gradient">
            {current.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </span>
          <span className="text-muted-foreground">/ {minimum.toLocaleString()} {unit}</span>
        </div>
      </div>

      <Progress value={percentage} className="h-3" />
      
      <p className="text-sm text-muted-foreground mt-2">
        {percentage.toFixed(0)}% complete
        {!isComplete && ` • ${(minimum - current).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit} remaining`}
      </p>
    </div>
  );
}

export function ProgressSummary() {
  const { totals, getProgressPercentage, isComplete, cardioLogs, strengthLogs, hiitLogs, tmarmLogs } = useWorkout();

  const totalLogs = cardioLogs.length + strengthLogs.length + hiitLogs.length + tmarmLogs.length;
  
  const categoriesComplete = [
    isComplete('cardioMiles'),
    isComplete('strengthLbs'),
    isComplete('hiitMinutes'),
    isComplete('tmarmMinutes'),
  ].filter(Boolean).length;

  const overallPercentage = (
    getProgressPercentage('cardioMiles') +
    getProgressPercentage('strengthLbs') +
    getProgressPercentage('hiitMinutes') +
    getProgressPercentage('tmarmMinutes')
  ) / 4;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Challenge <span className="text-gradient">Progress</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-gradient">{totalLogs}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Logs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-gradient">{categoriesComplete}/4</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-gradient">{overallPercentage.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Overall</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-gradient">
              {categoriesComplete === 4 ? '🏆' : '⏳'}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Status</div>
          </div>
        </div>

        <Progress value={overallPercentage} className="h-4" />
        
        {categoriesComplete === 4 ? (
          <p className="text-center text-primary font-bold mt-4 uppercase tracking-wide">
            Challenge Complete! Awaiting USARC Validation.
          </p>
        ) : (
          <p className="text-center text-muted-foreground mt-4 text-sm">
            Complete all four categories to finish the challenge
          </p>
        )}
      </div>

      {/* Individual Category Progress */}
      <div className="grid md:grid-cols-2 gap-4">
        <ProgressCard
          title="Cardio"
          icon={Clock}
          current={totals.cardioMiles}
          minimum={CHALLENGE_MINIMUMS.cardioMiles}
          unit="mi"
          isComplete={isComplete('cardioMiles')}
          percentage={getProgressPercentage('cardioMiles')}
        />
        
        <ProgressCard
          title="Strength"
          icon={Dumbbell}
          current={totals.strengthLbs}
          minimum={CHALLENGE_MINIMUMS.strengthLbs}
          unit="lbs"
          isComplete={isComplete('strengthLbs')}
          percentage={getProgressPercentage('strengthLbs')}
        />
        
        <ProgressCard
          title="HIIT"
          icon={Flame}
          current={totals.hiitMinutes}
          minimum={CHALLENGE_MINIMUMS.hiitMinutes}
          unit="min"
          isComplete={isComplete('hiitMinutes')}
          percentage={getProgressPercentage('hiitMinutes')}
        />
        
        <ProgressCard
          title="TMAR-M"
          icon={Heart}
          current={totals.tmarmMinutes}
          minimum={CHALLENGE_MINIMUMS.tmarmMinutes}
          unit="min"
          isComplete={isComplete('tmarmMinutes')}
          percentage={getProgressPercentage('tmarmMinutes')}
        />
      </div>

      {/* Data Integrity Notice */}
      <div className="glass rounded-xl p-4 border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Integrity Based:</strong> All data is self-reported 
          and subject to USARC verification. Maintain comprehensive records of your workouts 
          to support the validation process.
        </p>
      </div>
    </div>
  );
}
