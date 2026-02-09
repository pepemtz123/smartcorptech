import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "gray" | "pattern" | "black";
}

export default function Section({ children, className, background = "white" }: SectionProps) {
  const bgStyles = {
    white: "bg-white",
    gray: "bg-slate-50",
    black: "bg-slate-900",
    pattern: "bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
  };

  return (
    <section className={cn("py-16 md:py-24", bgStyles[background], className)}>
      <div className="container mx-auto px-4 md:px-6">
        {children}
      </div>
    </section>
  );
}
