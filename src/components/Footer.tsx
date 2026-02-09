import { Link } from "wouter";
import { Instagram, Linkedin, Twitter, Facebook, ShieldCheck, BadgeDollarSign, Award, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/assets/sctlogo_1765682792645.png" alt="Smart Corp Technologies" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Professional Smart Film Installation. Transforming spaces with privacy on demand.
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-600 font-medium">
               <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-600" /><span>Professional Installation</span></div>
               <div className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4 text-green-600" /><span>Money-Back Guarantee</span></div>
               <div className="flex items-center gap-2"><Award className="h-4 w-4 text-green-600" /><span>Warranty Backed</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/smart-film" className="hover:text-primary transition-colors">Smart Film</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Get a Free Quote</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-4">Service Areas</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>San Antonio</li>
              <li>Surrounding Areas</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+12109960797" className="hover:text-primary font-semibold">+1 (210) 996-0797</a>
              </li>
              <li><a href="mailto:letstalk@smartcorptechnologies.com" className="hover:text-primary">letstalk@smartcorptechnologies.com</a></li>
              <li className="pt-2 flex gap-4">
                <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Smart Corp Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
