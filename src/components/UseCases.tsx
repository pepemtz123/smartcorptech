import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const cases = [
  {
    title: "Corporate Offices",
    description: "Instant privacy for conference rooms and executive offices without blocking light. Enhance focus and confidentiality.",
    image: "/assets/generated/sleek_open_plan_office.png",
    alt: "Corporate office using smart film privacy glass",
    link: "/smart-film"
  },
  {
    title: "Medical Clinics",
    description: "Hygienic, wipe-clean privacy for patient rooms. Replaces dusty curtains with instant switchable glass.",
    image: "/assets/generated/modern_medical_clinic_with_glass_partitions.png",
    alt: "Medical clinic with smart glass partitions",
    link: "/smart-film"
  },
  {
    title: "Luxury Residential",
    description: "Maintain your view while ensuring privacy on demand. Perfect for bathroom windows and street-facing glass.",
    image: "/assets/generated/luxury_living_room_with_large_windows.png",
    alt: "Luxury residential living room with smart glass windows",
    link: "/smart-film"
  }
];

export default function UseCases() {
  return (
    <div className="space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
          Smart Film Solutions for Every Industry
        </h2>
        <p className="text-lg text-slate-600">
          Versatile privacy solutions that enhance design, functionality, and security.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {cases.map((item, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100 flex flex-col h-full hover:shadow-xl transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
              <img 
                src={item.image} 
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">{item.description}</p>
              <Link href={item.link} className="inline-flex items-center text-primary font-semibold hover:underline mt-auto">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
