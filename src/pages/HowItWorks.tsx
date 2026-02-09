import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import SEO from "@/components/SEO";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="How It Works | Smart Film Installation Process" description="Our simple 5-step process from consultation to professional installation. Learn how we transform your glass with switchable privacy film." />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">How It Works</h1>
            <p className="text-xl text-slate-300 max-w-2xl">From consultation to installation, we handle everything to ensure a perfect result.</p>
          </div>
        </div>
        <Section background="white"><HowItWorksSteps /></Section>
        <Section background="gray">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about Smart Film technology and installation.</p>
          </div>
          <FAQ />
        </Section>
        <Section background="white"><CTA buttonText="Start Your Project" /></Section>
      </main>
      <Footer />
    </div>
  );
}
