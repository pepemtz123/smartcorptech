import { Search, Ruler, ClipboardCheck, Wrench, Sparkles } from "lucide-react";

const steps = [
  { icon: Search, title: "1. Consultation", description: "We review your space and recommend the ideal smart film solution." },
  { icon: Ruler, title: "2. Measurement", description: "Our technicians take precise measurements for a custom fit." },
  { icon: ClipboardCheck, title: "3. Fabrication", description: "Your custom smart film is precision-cut to your exact specifications." },
  { icon: Wrench, title: "4. Installation", description: "Certified installers apply the film and connect electrical components professionally." },
  { icon: Sparkles, title: "5. Activation", description: "We power up the system, demonstrate use, and you enjoy instant privacy." }
];

export default function HowItWorksSteps() {
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-200" />
      <div className="space-y-12">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex gap-6 md:gap-12 group">
            <div className="relative z-10 shrink-0">
              <div className="h-14 w-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <step.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="pt-2 max-w-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
