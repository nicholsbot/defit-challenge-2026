import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Flame, Dumbbell, Timer, Heart } from "lucide-react";

const eventCategories = [
  {
    icon: Clock,
    title: "Cardio Events",
    description: "Running, rucking, cycling, swimming, rowing",
    minima: "Minimum 20 minutes continuous activity",
    scoring: "1 point per minute (max 60 pts/session)",
    color: "text-primary",
  },
  {
    icon: Dumbbell,
    title: "Strength Training",
    description: "Weightlifting, calisthenics, resistance training",
    minima: "Minimum 30 minutes per session",
    scoring: "1.5 points per minute (max 75 pts/session)",
    color: "text-primary",
  },
  {
    icon: Flame,
    title: "HIIT / Metabolic",
    description: "High-intensity intervals, circuit training, CrossFit-style",
    minima: "Minimum 15 minutes of work",
    scoring: "2 points per minute (max 60 pts/session)",
    color: "text-primary",
  },
  {
    icon: Timer,
    title: "TMAR-M Events",
    description: "Tactical Movement Assessment drills",
    minima: "Complete standardized events",
    scoring: "Bonus points based on performance tier",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Recovery / Mobility",
    description: "Yoga, stretching, active recovery, foam rolling",
    minima: "Minimum 20 minutes per session",
    scoring: "0.5 points per minute (max 30 pts/session)",
    color: "text-primary",
  },
];

const Rules = () => {
  return (
    <main className="min-h-screen bg-background texture-canvas">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rules & <span className="text-gradient">Scoring</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Understanding the challenge structure, event categories, and how points are calculated.
            </p>
            <Button variant="hero" size="lg" className="gap-2">
              <FileText className="w-5 h-5" />
              Download Full Rules PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Challenge <span className="text-gradient">Overview</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-gradient">12 Weeks</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Challenge Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-gradient">5 Days/Week</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Recommended Training</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-gradient">Weekly Logs</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Submission Deadline</div>
              </div>
            </div>
            <p className="text-muted-foreground text-center">
              Participants log their workouts weekly. Points accumulate throughout the challenge period. 
              Final standings are validated by USARC representatives.
            </p>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Event <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Points are awarded based on activity type, duration, and intensity.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {eventCategories.map((category) => (
              <div key={category.title} className="glass rounded-2xl p-6 card-hover">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <category.icon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">{category.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{category.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-foreground/80">
                        <strong className="text-primary">Minimum:</strong> {category.minima}
                      </span>
                      <span className="text-foreground/80">
                        <strong className="text-primary">Scoring:</strong> {category.scoring}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Algorithm */}
      <section className="py-16">
        <div className="container px-4">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Scoring <span className="text-gradient">Algorithm</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Weekly Score = </strong> 
                Sum of all session points + Consistency Bonus + Variety Bonus
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-foreground">Consistency Bonus:</strong> +50 points for logging 5+ days in a week</li>
                <li><strong className="text-foreground">Variety Bonus:</strong> +25 points for completing 3+ different event types</li>
                <li><strong className="text-foreground">Streak Multiplier:</strong> 1.1x multiplier for consecutive weeks of 5+ days</li>
              </ul>
              <p className="text-sm italic">
                Note: All logs are subject to verification. Flagged entries may require proof submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Age/Gender Categories */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Competition <span className="text-gradient">Categories</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Age Groups</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 17-21 years</li>
                <li>• 22-26 years</li>
                <li>• 27-31 years</li>
                <li>• 32-36 years</li>
                <li>• 37-41 years</li>
                <li>• 42-46 years</li>
                <li>• 47-51 years</li>
                <li>• 52+ years</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Gender Categories</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Male</li>
                <li>• Female</li>
              </ul>
              <h3 className="text-xl font-bold text-foreground mt-6 mb-4">Overall Standings</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Combined Leaderboard</li>
                <li>• Age Group Leaderboard</li>
                <li>• Gender Leaderboard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Rules;
