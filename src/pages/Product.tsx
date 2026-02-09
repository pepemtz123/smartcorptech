import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import CTA from "@/components/CTA";
import SEO from "@/components/SEO";
import { Check, Shield, Zap, Layers } from "lucide-react";

export default function Product() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="PDLC Smart Film Technology | Technical Specs" description="Learn about our Polymer Dispersed Liquid Crystal (PDLC) technology. Switchable privacy film specifications, UV protection, and energy efficiency details." />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Smart Film Technology</h1>
            <p className="text-xl text-slate-300 max-w-2xl">The advanced PDLC technology that turns ordinary glass into intelligent privacy glass.</p>
          </div>
        </div>
        <Section background="white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">What is PDLC Smart Film?</h2>
              <p className="text-lg text-slate-600 leading-relaxed">Polymer Dispersed Liquid Crystal (PDLC) film is a high-tech layer that can be applied to any glass surface. It contains liquid crystal molecules that align when an electrical current is passed through them, allowing light to pass through (transparent).</p>
              <p className="text-lg text-slate-600 leading-relaxed">When the power is turned off, the crystals scatter randomly, diffusing light and instantly turning the glass opaque (frosted) for complete privacy.</p>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center">
              <div className="text-center space-y-4">
                <Layers className="h-16 w-16 text-primary mx-auto" />
                <p className="font-semibold text-slate-500">Cross-Section Diagram</p>
                <div className="flex gap-2 justify-center text-xs text-slate-400"><span>PET Layer</span> &bull; <span>ITO Coating</span> &bull; <span>PDLC Layer</span></div>
              </div>
            </div>
          </div>
        </Section>
        <Section background="gray">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Technical Specifications</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <Zap className="h-8 w-8 text-primary mb-4" /><h3 className="text-xl font-bold mb-2">Power Consumption</h3>
              <p className="text-slate-600">Very low energy usage. Approximately 5 watts per square meter when on (transparent).</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <Shield className="h-8 w-8 text-primary mb-4" /><h3 className="text-xl font-bold mb-2">UV Protection</h3>
              <p className="text-slate-600">Blocks 99% of harmful UV rays in both on and off states, protecting interiors.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <Check className="h-8 w-8 text-primary mb-4" /><h3 className="text-xl font-bold mb-2">Switching Speed</h3>
              <p className="text-slate-600">Instant transition. Less than 100 milliseconds to switch between states.</p>
            </div>
          </div>
        </Section>
        <Section background="white"><CTA title="Upgrade Your Glass Today" subtitle="Get a custom quote for your project size and requirements." /></Section>
      </main>
      <Footer />
    </div>
  );
}
