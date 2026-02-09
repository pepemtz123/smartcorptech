import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import Section from "@/components/Section";
import SEO from "@/components/SEO";
import { Phone, Mail, MapPin, ShieldCheck, BadgeDollarSign, Award } from "lucide-react";

export default function Quote() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Get a Free Quote | Smart Film Installation" description="Request a free, no-obligation quote for your smart film project. Professional installation, money-back guarantee, and warranty backed." />
      <Navbar />
      <main className="flex-grow bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8"><QuoteForm /></div>
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-primary pt-1"><Phone className="h-5 w-5" /></div>
                    <div><p className="text-sm font-medium text-slate-500">Phone</p><a href="tel:+12109960797" className="text-slate-900 font-semibold hover:text-primary transition-colors block">+1 (210) 996-0797</a><p className="text-xs text-slate-400">24/7 AI Receptionist</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-primary pt-1"><Mail className="h-5 w-5" /></div>
                    <div><p className="text-sm font-medium text-slate-500">Email</p><a href="mailto:letstalk@smartcorptechnologies.com" className="text-slate-900 font-semibold hover:text-primary transition-colors">letstalk@smartcorptechnologies.com</a></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-primary pt-1"><MapPin className="h-5 w-5" /></div>
                    <div><p className="text-sm font-medium text-slate-500">Servicing</p><p className="text-slate-900 font-semibold">San Antonio, TX</p><p className="text-slate-600">and surrounding areas</p></div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Our Promise</h3>
                <ul className="space-y-4 text-blue-100">
                  <li className="flex items-center gap-3 font-medium"><ShieldCheck className="h-5 w-5 text-green-300 shrink-0" />Professional Installation</li>
                  <li className="flex items-center gap-3 font-medium"><BadgeDollarSign className="h-5 w-5 text-green-300 shrink-0" />Money-Back Guarantee</li>
                  <li className="flex items-center gap-3 font-medium"><Award className="h-5 w-5 text-green-300 shrink-0" />Warranty Backed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
