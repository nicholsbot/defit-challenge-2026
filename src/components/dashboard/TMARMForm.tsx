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

const tmarmSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  duration: z.number({ required_error: 'Duration is required' })
    .positive('Duration must be greater than 0')
    .max(180, 'Duration seems unrealistic (max 3 hours)'),
  description: z.string().optional(),
});

type TMARMFormValues = z.infer<typeof tmarmSchema>;

export function TMARMForm() {
  const { addTMARMLog } = useWorkout();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TMARMFormValues>({
    resolver: zodResolver(tmarmSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (data: TMARMFormValues) => {
    setIsSubmitting(true);
    try {
      await addTMARMLog({
        date: data.date,
        duration: data.duration,
        description: data.description,
      });

      toast({
        title: 'TMAR-M logged!',
        description: `${data.duration} minutes added to your total.`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log TMAR-M. Please try again.',
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the activity: yoga, stretching, meditation, mobility work..."
                  className="bg-secondary resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">TMAR-M Activities:</strong> Tactical Mobility, 
            Active Recovery, and Mindfulness. Include yoga, stretching, foam rolling, meditation, 
            breathing exercises, and mobility work.
          </p>
        </div>

        <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Logging...' : 'Log TMAR-M'}
        </Button>
      </form>
    </Form>
  );
}
