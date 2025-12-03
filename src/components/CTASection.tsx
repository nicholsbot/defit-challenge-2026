import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container px-4 relative">
        <div className="glass rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary flex items-center justify-center glow-primary animate-float">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Content */}
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready to Transform Your <span className="text-gradient">Fitness?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of athletes who have already transformed their bodies and lives. 
            Your journey to peak fitness starts with a single step.
          </p>

          {/* CTA */}
          <Button variant="hero" size="lg">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 7-day free trial</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
