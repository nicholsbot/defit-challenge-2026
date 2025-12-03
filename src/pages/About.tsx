import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Heart, Brain, Users, Target } from "lucide-react";

const h2fDomains = [
  {
    icon: Target,
    title: "Physical Readiness",
    description: "Build strength, endurance, and combat-ready fitness through structured training protocols.",
  },
  {
    icon: Brain,
    title: "Mental Readiness",
    description: "Develop mental toughness, focus, and resilience to overcome any challenge.",
  },
  {
    icon: Heart,
    title: "Spiritual Readiness",
    description: "Strengthen purpose, values, and the warrior mindset that drives mission success.",
  },
  {
    icon: Shield,
    title: "Sleep & Recovery",
    description: "Optimize recovery protocols to maintain peak performance and prevent injury.",
  },
  {
    icon: Users,
    title: "Nutrition",
    description: "Fuel your body with proper nutrition strategies for sustained energy and performance.",
  },
];

const About = () => {
  return (
    <main className="min-h-screen bg-background texture-canvas">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              What is <span className="text-gradient">DEFIT?</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              The Double Eagle Fitness Challenge is a comprehensive fitness program designed 
              to enhance physical and mental readiness for Army Reserve Soldiers and units.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Our <span className="text-gradient">Mission</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Reserve Ready. Unit Strong.</strong> The Double Eagle 
                Challenge exists to build a culture of fitness excellence within the Army Reserve community.
              </p>
              <p>
                Aligned with the Army's Holistic Health and Fitness (H2F) philosophy, we focus on developing 
                the complete Soldier—physically, mentally, and spiritually ready to answer the nation's call.
              </p>
              <p>
                Through structured challenges, friendly competition, and community support, we motivate 
                Soldiers to maintain year-round fitness, not just during drill weekends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H2F Domains */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              The Five <span className="text-gradient">H2F Domains</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our program is built on the Army's Holistic Health and Fitness framework, 
              addressing all five domains of Soldier readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {h2fDomains.map((domain) => (
              <div key={domain.title} className="glass rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <domain.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{domain.title}</h3>
                <p className="text-muted-foreground text-sm">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-heading font-bold text-gradient mb-2">Discipline</div>
                <p className="text-muted-foreground text-sm">Consistent effort over time</p>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-heading font-bold text-gradient mb-2">Community</div>
                <p className="text-muted-foreground text-sm">Stronger together</p>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-heading font-bold text-gradient mb-2">Excellence</div>
                <p className="text-muted-foreground text-sm">Army standard, always</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
