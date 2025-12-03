import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useWorkout } from '@/contexts/WorkoutContext';

const strengthSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  exerciseName: z.string().min(1, 'Exercise name is required').max(100),
  sets: z.number({ required_error: 'Sets is required' })
    .int('Must be a whole number')
    .positive('Must be at least 1')
    .max(50, 'Sets seems unrealistic'),
  repsPerSet: z.number({ required_error: 'Reps is required' })
    .int('Must be a whole number')
    .positive('Must be at least 1')
    .max(500, 'Reps seems unrealistic'),
  weightPerRep: z.number({ required_error: 'Weight is required' })
    .positive('Weight must be greater than 0')
    .max(2000, 'Weight seems unrealistic'),
  notes: z.string().optional(),
});

type StrengthFormValues = z.infer<typeof strengthSchema>;

export function StrengthForm() {
  const { addStrengthLog } = useWorkout();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StrengthFormValues>({
    resolver: zodResolver(strengthSchema),
    defaultValues: {
      exerciseName: '',
      notes: '',
    },
  });

  const watchedValues = form.watch(['sets', 'repsPerSet', 'weightPerRep']);
  const calculatedTotal = (watchedValues[0] || 0) * (watchedValues[1] || 0) * (watchedValues[2] || 0);

  const onSubmit = async (data: StrengthFormValues) => {
    setIsSubmitting(true);
    try {
      const totalWeight = data.sets * data.repsPerSet * data.weightPerRep;

      await addStrengthLog({
        date: data.date,
        exerciseName: data.exerciseName,
        sets: data.sets,
        repsPerSet: data.repsPerSet,
        weightPerRep: data.weightPerRep,
        totalWeight,
        notes: data.notes,
      });

      toast({
        title: 'Strength logged!',
        description: `${totalWeight.toLocaleString()} lbs added to your total.`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log strength. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : 'Select date'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exerciseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Bench Press, Deadlift, Squats"
                  className="bg-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="sets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-secondary"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repsPerSet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reps/Set</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-secondary"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weightPerRep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (lbs)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="0"
                    className="bg-secondary"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {calculatedTotal > 0 && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">Total Weight Lifted</p>
            <p className="text-2xl font-heading font-bold text-gradient">
              {calculatedTotal.toLocaleString()} lbs
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about this workout..."
                  className="bg-secondary resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Logging...' : 'Log Strength'}
        </Button>
      </form>
    </Form>
  );
}
