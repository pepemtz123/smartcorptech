import { Link } from "wouter";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden animate-in slide-in-from-bottom-full duration-500">
      <div className="flex gap-3 items-center">
        <a href="tel:+12109960797" className="flex-shrink-0">
          <Button variant="outline" size="sm" className="h-10 px-4 border-primary text-primary hover:bg-primary/5">
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
        </a>
        <Link href="/quote" className="flex-grow">
          <Button size="sm" className="w-full h-10 font-semibold shadow-md">
            Get a Free Quote
          </Button>
        </Link>
      </div>
    </div>
  );
}
