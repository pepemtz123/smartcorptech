import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Smart Film", href: "/smart-film" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Gallery", href: "/gallery" },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    // Double-click → go to login  
    if (tapCountRef.current >= 2) {
      tapCountRef.current = 0;
      navigate("/login");
    } else {
      tapTimerRef.current = setTimeout(() => {
        if (tapCountRef.current > 0 && tapCountRef.current < 2) {
          navigate("/");
        }
        tapCountRef.current = 0;
      }, 400);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <button onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0">
          <img src="/assets/sctlogo_1765682792645.png" alt="Smart Corp Technologies" className="h-16 w-auto object-contain" />
        </button>

        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <div className="hidden lg:flex flex-col items-end text-right text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Call now for a quote</span>
            <a href="tel:+12109960797" className="hover:text-primary transition-colors">+1 (210) 996-0797</a>
          </div>
          <Link href="/quote">
            <Button>Get a Free Quote</Button>
          </Link>
        </div>

        <button
          className="flex md:hidden p-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t bg-white px-4 py-6 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px w-full bg-gray-100 my-2" />
            <a href="tel:+12109960797" className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
              <Phone className="h-4 w-4" />
              <span>Call now for a quote: (210) 996-0797</span>
            </a>
            <Link href="/quote" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-2">
                Get a Free Quote
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
