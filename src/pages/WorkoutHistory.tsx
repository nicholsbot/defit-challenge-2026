import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutProvider, useWorkout } from '@/contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Clock, 
  Dumbbell, 
  Flame, 
  Heart, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { CARDIO_TYPE_LABELS } from '@/types/workout';

type ActivityType = 'all' | 'cardio' | 'strength' | 'hiit' | 'tmarm';
type StatusFilter = 'all' | 'pending' | 'verified';
type SortField = 'date' | 'type';
type SortOrder = 'asc' | 'desc';

interface UnifiedLog {
  id: string;
  date: Date;
  activityType: ActivityType;
  details: string;
  subtype?: string;
  verified: boolean;
  createdAt: Date;
}

function WorkoutHistoryContent() {
  const { user, loading: authLoading } = useAuth();
  const { cardioLogs, strengthLogs, hiitLogs, tmarmLogs, loading: workoutLoading } = useWorkout();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [typeFilter, setTypeFilter] = useState<ActivityType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  
  const highlightRef = useRef<HTMLTableRowElement | null>(null);
  const mobileHighlightRef = useRef<HTMLDivElement | null>(null);

  // Handle highlight params from notifications
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    const highlightType = searchParams.get('type');
    
    if (highlightId && highlightType) {
      setHighlightedId(highlightId);
      
      // Set filter to show the highlighted log type
      if (['cardio', 'strength', 'hiit', 'tmarm'].includes(highlightType)) {
        setTypeFilter(highlightType as ActivityType);
      }
      
      // Clear highlight after 5 seconds
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Scroll to highlighted element
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        if (highlightRef.current) {
          highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (mobileHighlightRef.current) {
          mobileHighlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightedId, typeFilter]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Unify all logs into a single array
  const unifiedLogs = useMemo((): UnifiedLog[] => {
    const logs: UnifiedLog[] = [];

    cardioLogs.forEach(log => {
      logs.push({
        id: log.id,
        date: log.date,
        activityType: 'cardio',
        details: `${log.distance.toFixed(2)} miles`,
        subtype: CARDIO_TYPE_LABELS[log.type],
        verified: log.verified || false,
        createdAt: log.createdAt,
      });
    });

    strengthLogs.forEach(log => {
      logs.push({
        id: log.id,
        date: log.date,
        activityType: 'strength',
        details: `${log.totalWeight.toLocaleString()} lbs (${log.exerciseName})`,
        subtype: log.exerciseName,
        verified: log.verified || false,
        createdAt: log.createdAt,
      });
    });

    hiitLogs.forEach(log => {
      logs.push({
        id: log.id,
        date: log.date,
        activityType: 'hiit',
        details: `${log.duration} minutes`,
        subtype: log.description || 'HIIT Session',
        verified: log.verified || false,
        createdAt: log.createdAt,
      });
    });

    tmarmLogs.forEach(log => {
      logs.push({
        id: log.id,
        date: log.date,
        activityType: 'tmarm',
        details: `${log.duration} minutes`,
        subtype: log.description || 'TMAR-M Session',
        verified: log.verified || false,
        createdAt: log.createdAt,
      });
    });

    return logs;
  }, [cardioLogs, strengthLogs, hiitLogs, tmarmLogs]);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let result = [...unifiedLogs];

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(log => log.activityType === typeFilter);
    }

    // Apply status filter
    if (statusFilter === 'pending') {
      result = result.filter(log => !log.verified);
    } else if (statusFilter === 'verified') {
      result = result.filter(log => log.verified);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortField === 'type') {
        comparison = a.activityType.localeCompare(b.activityType);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [unifiedLogs, typeFilter, statusFilter, sortField, sortOrder]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'cardio': return <Clock className="w-4 h-4" />;
      case 'strength': return <Dumbbell className="w-4 h-4" />;
      case 'hiit': return <Flame className="w-4 h-4" />;
      case 'tmarm': return <Heart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityLabel = (type: ActivityType) => {
    switch (type) {
      case 'cardio': return 'Cardio';
      case 'strength': return 'Strength';
      case 'hiit': return 'HIIT';
      case 'tmarm': return 'TMAR-M';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const isHighlighted = (logId: string) => logId === highlightedId;

  if (authLoading || workoutLoading) {
    return (
      <main className="min-h-screen bg-background texture-canvas flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background texture-canvas">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="container px-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            Workout <span className="text-gradient">History</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            View all your logged workouts and their verification status.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-4">
        <div className="container px-4">
          <div className="glass rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
              
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ActivityType)}>
                <SelectTrigger className="w-[140px] bg-secondary">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="tmarm">TMAR-M</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[140px] bg-secondary">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto text-sm text-muted-foreground">
                {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Table */}
      <section className="pb-16">
        <div className="container px-4">
          <div className="glass rounded-2xl overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-heading font-bold mb-2">No Workouts Found</h3>
                <p className="text-muted-foreground mb-4">
                  {unifiedLogs.length === 0 
                    ? "You haven't logged any workouts yet."
                    : "No workouts match your current filters."}
                </p>
                {unifiedLogs.length === 0 && (
                  <Button asChild variant="hero">
                    <Link to="/dashboard">Log Your First Workout</Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead 
                          className="cursor-pointer hover:text-foreground transition-colors"
                          onClick={() => toggleSort('date')}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-foreground transition-colors"
                          onClick={() => toggleSort('type')}
                        >
                          <div className="flex items-center gap-2">
                            Activity Type
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead>Subtype / Exercise</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow 
                          key={`${log.activityType}-${log.id}`}
                          ref={isHighlighted(log.id) ? highlightRef : null}
                          className={`border-border transition-all duration-300 ${
                            !log.verified ? 'bg-amber-500/5' : ''
                          } ${
                            isHighlighted(log.id) 
                              ? 'ring-2 ring-primary bg-primary/10 animate-pulse' 
                              : ''
                          }`}
                        >
                          <TableCell className="font-medium">
                            {format(log.date, 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                {getActivityIcon(log.activityType)}
                              </div>
                              {getActivityLabel(log.activityType)}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {log.subtype}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.details}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(log.verified)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-border">
                  {filteredLogs.map((log) => (
                    <div 
                      key={`${log.activityType}-${log.id}`}
                      ref={isHighlighted(log.id) ? mobileHighlightRef : null}
                      className={`p-4 transition-all duration-300 ${
                        !log.verified ? 'bg-amber-500/5' : ''
                      } ${
                        isHighlighted(log.id) 
                          ? 'ring-2 ring-primary bg-primary/10 animate-pulse' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getActivityIcon(log.activityType)}
                          </div>
                          <div>
                            <p className="font-heading font-bold">{getActivityLabel(log.activityType)}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(log.date, 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(log.verified)}
                      </div>
                      <div className="ml-[52px]">
                        <p className="text-sm text-muted-foreground mb-1">{log.subtype}</p>
                        <p className="font-mono text-sm text-primary">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function WorkoutHistory() {
  return (
    <WorkoutProvider>
      <WorkoutHistoryContent />
    </WorkoutProvider>
  );
}
