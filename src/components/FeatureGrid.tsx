interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  { title: "Instant Privacy", description: "Go from transparent to opaque in milliseconds with a simple switch or remote control." },
  { title: "UV Protection", description: "Blocks 99% of harmful UV rays, protecting your furniture and flooring from fading." },
  { title: "Energy Efficient", description: "Reduces heat gain in summer and heat loss in winter, lowering your energy bills." },
  { title: "Durable & Safe", description: "Acts as a safety film, holding glass together if shattered and adding security." },
  { title: "Retrofit Ready", description: "Can be applied to existing glass surfaces. No need to replace your windows." },
  { title: "Fast Installation", description: "Professional installation typically completed in 1-2 days with minimal disruption." }
];

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <div key={idx} className="text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
