import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export default function CTA({
  title = "Ready to Transform Your Space?",
  subtitle = "Get a free quote today. Fast turnaround and professional installation available.",
  buttonText = "Get a Free Quote",
  secondaryButtonText = "See How It Works"
}: CTAProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-24 text-center shadow-xl mx-4 md:mx-0">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,#2563EB,45%,#1d4ed8,55%,#2563EB)] opacity-50" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">{title}</h2>
        <p className="text-blue-100 text-lg md:text-xl">{subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/quote">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold text-primary hover:text-primary/90">
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:text-white">
              {secondaryButtonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
