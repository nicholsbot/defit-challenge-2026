import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Dumbbell, Flame, Heart, CheckCircle, AlertCircle } from "lucide-react";

const eventCategories = [
  {
    icon: Clock,
    title: "Cardio",
    description: "Running, rucking, cycling, swimming, rowing, and other sustained aerobic activities",
    requirements: "Required event category",
    note: "Combining cardio events to establish required totals within this category is permitted",
    color: "text-primary",
  },
  {
    icon: Dumbbell,
    title: "Strength & Resistance",
    description: "Weightlifting, calisthenics, resistance training, and functional strength work",
    requirements: "Required event category",
    note: "Focus on compound movements and progressive overload",
    color: "text-primary",
  },
  {
    icon: Flame,
    title: "High-Intensity Interval Training (HIIT)",
    description: "Circuit training, metabolic conditioning, CrossFit-style workouts, and interval sprints",
    requirements: "Required event category",
    note: "High effort intervals with structured rest periods",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "TMAR-M",
    description: "Tactical Mobility Active Recovery and Mindfulness - yoga, stretching, mobility work, meditation",
    requirements: "Required event category",
    note: "Supports the spiritual readiness domain and physical recovery",
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
              Understanding the challenge structure, required events, and how scores are calculated and validated.
            </p>
            <Button variant="hero" size="lg" className="gap-2">
              <FileText className="w-5 h-5" />
              Download Full Rules PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Challenge Overview */}
      <section className="py-16">
        <div className="container px-4">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Challenge <span className="text-gradient">Timeline</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-gradient">12 Jan 2026</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Start Date</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-gradient">10 Weeks</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-gradient">22 Mar 2026</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">End Date</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Events */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Required <span className="text-gradient">Events</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Participants must complete activities in all four event categories throughout the challenge.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {eventCategories.map((category) => (
              <div key={category.title} className="glass rounded-2xl p-6 card-hover">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <category.icon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wide">
                        Required
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                    <div className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{category.note}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Verification */}
      <section className="py-16">
        <div className="container px-4">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Data <span className="text-gradient">Verification</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Integrity Based:</strong> Data verification is 
                  integrity based and entered by individual Soldiers on this website.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <strong className="text-foreground">USARC Validation:</strong> Designated personnel 
                  within the United States Army Reserve Command (USARC) will validate and calculate the scores.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Record Keeping:</strong> Throughout the challenge, 
                  participants should maintain comprehensive records of their workouts. Accurate 
                  record-keeping supports efficient validation and the integrity of data when the 
                  verification process is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring */}
      <section className="py-16">
        <div className="container px-4">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Scoring <span className="text-gradient">Algorithm</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                A scoring algorithm posted to the DEFIT website will rank individuals, teams, and units.
                The algorithm considers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Completion of all required event categories</li>
                <li>Duration and intensity of activities logged</li>
                <li>Consistency throughout the 10-week challenge</li>
                <li>Bonus points for exceeding minimum requirements</li>
              </ul>
              <p className="text-sm italic border-l-2 border-primary/50 pl-4 mt-6">
                Detailed scoring breakdown and point values will be published prior to the challenge start date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Competition <span className="text-gradient">Levels</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Individual</h3>
              <p className="text-muted-foreground text-sm">
                Soldiers compete individually to demonstrate personal fitness excellence and commitment.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Team</h3>
              <p className="text-muted-foreground text-sm">
                Small groups combine their scores to compete as a unified team.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Unit</h3>
              <p className="text-muted-foreground text-sm">
                Small, medium, and large units compete in size-appropriate brackets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Rules;
