import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, User, Building2, Users, Save, CheckCircle2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UnitCategory = Database['public']['Enums']['unit_category'];

const unitCategoryOptions: { value: UnitCategory; label: string; description: string }[] = [
  { value: 'veterans', label: 'Veteran', description: 'Honorably discharged military service member' },
  { value: 'government', label: 'Government Employee', description: 'Current federal, state, or local government employee' },
  { value: 'military_family', label: 'Military Family', description: 'Spouse or dependent of active duty or reserve member' },
  { value: 'civilian', label: 'Civilian', description: 'General public participant' },
  { value: 'other', label: 'Other', description: 'Other affiliation not listed above' },
];

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  unit: z.string().max(100, 'Unit name must be less than 100 characters').optional().or(z.literal('')),
  unit_category: z.enum(['veterans', 'government', 'military_family', 'civilian', 'other']).nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      unit: '',
      unit_category: null,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, unit, unit_category')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          form.reset({
            full_name: data.full_name || '',
            unit: data.unit || '',
            unit_category: data.unit_category,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          unit: values.unit || null,
          unit_category: values.unit_category,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setLastSaved(new Date());
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background texture-canvas flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

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
            Profile <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Update your personal information and unit affiliation.
          </p>
        </div>
      </section>

      {/* Profile Form */}
      <section className="pb-16">
        <div className="container px-4">
          <div className="max-w-2xl">
            {/* Profile Summary Card */}
            <div className="glass rounded-2xl p-6 mb-8 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold">
                    {form.watch('full_name') || 'Your Name'}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {form.watch('unit') && (
                    <p className="text-sm text-primary mt-1">
                      {form.watch('unit')} • {unitCategoryOptions.find(c => c.value === form.watch('unit_category'))?.label || 'Uncategorized'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="bg-secondary/50 border-border"
                          />
                        </FormControl>
                        <FormDescription>
                          This name will appear on leaderboards and challenge records.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Unit */}
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          Unit / Organization
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 311th Signal Command, VA Hospital"
                            {...field}
                            className="bg-secondary/50 border-border"
                          />
                        </FormControl>
                        <FormDescription>
                          Your Army Reserve unit, government agency, or organization name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Unit Category */}
                  <FormField
                    control={form.control}
                    name="unit_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          Participant Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-secondary/50 border-border">
                              <SelectValue placeholder="Select your category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border">
                            {unitCategoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the category that best describes your affiliation:
                          <ul className="mt-2 space-y-1 text-xs">
                            {unitCategoryOptions.map((option) => (
                              <li key={option.value} className="flex gap-2">
                                <span className="font-medium text-foreground">{option.label}:</span>
                                <span>{option.description}</span>
                              </li>
                            ))}
                          </ul>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      {lastSaved && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          Last saved: {lastSaved.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={saving || !form.formState.isDirty}
                      className="min-w-[140px]"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Info Notice */}
            <div className="glass rounded-2xl p-6 mt-8 border border-primary/20">
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">Privacy Notice:</strong> Your profile information
                is used for challenge participation and leaderboard display. Unit affiliation data
                helps aggregate team statistics for unit-level competitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
