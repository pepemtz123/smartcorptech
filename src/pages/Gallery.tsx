import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import GalleryGrid from "@/components/GalleryGrid";
import CTA from "@/components/CTA";
import SEO from "@/components/SEO";

export default function Gallery() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Project Gallery | Smart Film Installations" description="View our portfolio of smart film installations in offices, medical clinics, and luxury residences. See the privacy transformation." />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Project Gallery</h1>
            <p className="text-xl text-slate-300 max-w-2xl">See how Smart Film transforms offices, clinics, and homes.</p>
          </div>
        </div>
        <Section background="white"><GalleryGrid /></Section>
        <Section background="gray"><CTA title="Inspired by what you see?" subtitle="Let's bring this modern privacy solution to your space." buttonText="Get a Quote" /></Section>
      </main>
      <Footer />
    </div>
  );
}
