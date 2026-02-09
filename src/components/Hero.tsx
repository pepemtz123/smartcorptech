import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, BadgeDollarSign, Award } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden min-h-[90vh] md:min-h-[85vh] flex items-center">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/1000003163_(1)_1765981808858.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl lg:leading-tight">
            Privacy on Demand. <br/>
            <span className="text-primary">Instantly.</span>
          </h1>
          
          <div className="space-y-4">
            <p className="text-lg text-white/90 leading-relaxed max-w-lg">
              Transform any glass into smart privacy glass with the click of a button. No more blinds, no more curtains — just seamless, instant control over your space.
            </p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 inline-block">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-green-400" /> Professional Installation</span>
              <span className="flex items-center gap-1.5"><BadgeDollarSign className="h-4 w-4 text-green-400" /> Money-Back Guarantee</span>
              <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-green-400" /> Warranty Backed</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/quote">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>Installed by professionals for offices, clinics, and homes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
