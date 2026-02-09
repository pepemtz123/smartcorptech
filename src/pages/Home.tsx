import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import FeatureGrid from "@/components/FeatureGrid";
import UseCases from "@/components/UseCases";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Smart Film & Privacy Glass Installation" description="Transform clear glass into privacy glass instantly. Smart Corp provides premium PDLC switchable film for offices, homes, and medical facilities. Professional installation available." />
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">
        <Hero />
        <Section background="black">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-heading font-bold text-slate-900">Why Choose Smart Film?</h2>
            <FeatureGrid />
          </div>
        </Section>
        <Section background="gray"><UseCases /></Section>
        <Section background="white">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.youtube.com/embed/O8f-ebxRrsg?autoplay=1&mute=1&loop=1&playlist=O8f-ebxRrsg&controls=1&rel=0"
                title="Smart Film Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">See the Difference</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">Experience the magic of switchable privacy. Our film applies directly to your existing glass, transforming it from clear to frosted in less than a second.</p>
            <Link href="/smart-film"><Button variant="outline" size="lg" className="w-full sm:w-auto">Learn About the Tech<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </Section>
        <Section background="gray">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Simple 5-Step Process</h2>
            <p className="text-lg text-slate-600">From quote to installation, we make upgrading your glass easy and stress-free.</p>
          </div>
          <HowItWorksSteps />
        </Section>
        <Section background="white">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Trusted by Businesses & Homeowners</h2>
          </div>
          <Testimonials />
        </Section>
        <Section background="white" className="pb-0"><CTA /></Section>
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
