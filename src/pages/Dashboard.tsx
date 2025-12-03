import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardioForm } from '@/components/dashboard/CardioForm';
import { StrengthForm } from '@/components/dashboard/StrengthForm';
import { HIITForm } from '@/components/dashboard/HIITForm';
import { TMARMForm } from '@/components/dashboard/TMARMForm';
import { ProgressSummary } from '@/components/dashboard/ProgressSummary';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import { Clock, Dumbbell, Flame, Heart, BarChart3, ArrowLeft } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <main className="min-h-screen bg-background texture-canvas">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="container px-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            Workout <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Log your workouts and track progress toward the 10-week challenge minimums.
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="pb-16">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Forms */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-6 bg-secondary/50 p-1 rounded-xl">
                  <TabsTrigger 
                    value="summary" 
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Summary</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cardio"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">Cardio</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="strength"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span className="hidden sm:inline">Strength</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hiit"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                  >
                    <Flame className="w-4 h-4" />
                    <span className="hidden sm:inline">HIIT</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tmarm"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">TMAR-M</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-0">
                  <ProgressSummary />
                </TabsContent>

                <TabsContent value="cardio" className="mt-0">
                  <div className="glass rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold">Log Cardio</h2>
                        <p className="text-sm text-muted-foreground">Run, ruck, bike, swim, or row</p>
                      </div>
                    </div>
                    <CardioForm />
                  </div>
                </TabsContent>

                <TabsContent value="strength" className="mt-0">
                  <div className="glass rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold">Log Strength</h2>
                        <p className="text-sm text-muted-foreground">Weightlifting and resistance training</p>
                      </div>
                    </div>
                    <StrengthForm />
                  </div>
                </TabsContent>

                <TabsContent value="hiit" className="mt-0">
                  <div className="glass rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold">Log HIIT</h2>
                        <p className="text-sm text-muted-foreground">High-intensity interval training</p>
                      </div>
                    </div>
                    <HIITForm />
                  </div>
                </TabsContent>

                <TabsContent value="tmarm" className="mt-0">
                  <div className="glass rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold">Log TMAR-M</h2>
                        <p className="text-sm text-muted-foreground">Tactical Mobility, Active Recovery & Mindfulness</p>
                      </div>
                    </div>
                    <TMARMForm />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel - Quick Stats (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ProgressSummary />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Contract Documentation (for developers) */}
      {/* 
        Backend API Endpoints:
        
        POST /api/logs/cardio
        Body: { date, type, distance, distanceUnit, notes? }
        Response: { id, ...log, createdAt }
        
        POST /api/logs/strength  
        Body: { date, exerciseName, sets, repsPerSet, weightPerRep, notes? }
        Response: { id, ...log, totalWeight, createdAt }
        
        POST /api/logs/hiit
        Body: { date, duration, description? }
        Response: { id, ...log, createdAt }
        
        POST /api/logs/tmarm
        Body: { date, duration, description? }
        Response: { id, ...log, createdAt }
        
        GET /api/logs/summary
        Response: { cardioMiles, strengthLbs, hiitMinutes, tmarmMinutes, logs[] }
        
        GET /api/logs?type=cardio|strength|hiit|tmarm&startDate=&endDate=
        Response: { logs[] }
        
        DELETE /api/logs/:id
        Response: { success: boolean }
        
        Admin Endpoints:
        GET /api/admin/logs/flagged
        PUT /api/admin/logs/:id/verify
        PUT /api/admin/logs/:id/reject
        GET /api/admin/export?format=csv|json
      */}

      <Footer />
    </main>
  );
}

export default function Dashboard() {
  return (
    <WorkoutProvider>
      <DashboardContent />
    </WorkoutProvider>
  );
}
