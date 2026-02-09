import { Loader2 } from "lucide-react";

const galleryImages = [
  { id: 1, url: "/assets/IMG-20260111-WA0002_1768183742012.jpg", alt: "Smart Film On/Off Demo - Residential Patio Door" },
  { id: 2, url: "/assets/IMG-20260111-WA0003_1768183741996.jpg", alt: "Luxury Living Room - Frosted vs Transparent Privacy Glass" },
  { id: 3, url: "/assets/IMG-20260111-WA0004_1768183741982.jpg", alt: "Modern Living Room - Transparent vs Opaque Smart Film" },
  { id: 4, url: "/assets/IMG-20260111-WA0001_1768183742022.jpg", alt: "Commercial Window Installation - Heat Reduction Glass" },
  { id: 5, url: "/assets/IMG-20260111-WA0000_1768183742033.jpg", alt: "Video Display Window - Private Jet Advertisement" },
  { id: 6, url: "/assets/IMG-20260111-WA0005_1768183741930.jpg", alt: "Aviation Hangar - Professional Smart Film Installation" },
];

export default function GalleryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {galleryImages.map((img) => (
        <div key={img.id} className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden group">
          <img
            src={img.url}
            alt={img.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e2e8f0' width='400' height='400'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-medium border border-white/50 px-4 py-2 rounded-full text-center text-sm">{img.alt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
