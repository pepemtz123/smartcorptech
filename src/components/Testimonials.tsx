import { Star } from "lucide-react";

const testimonials = [
  { quote: "We installed Smart Film in our conference room and it's a game changer. We get the open office feel but instant privacy for sensitive meetings.", author: "Sarah Jenkins", role: "Office Manager, TechFlow Inc.", rating: 5, timeAgo: "2 weeks ago", initial: "S", color: "bg-blue-500" },
  { quote: "Amazing product. We didn't want curtains blocking our view of the city. This was the perfect solution for our living room floor-to-ceiling windows.", author: "Michael Ross", role: "Homeowner", rating: 5, timeAgo: "1 month ago", initial: "M", color: "bg-red-500" },
  { quote: "The installation was quick and professional. The team explained everything clearly. Highly recommend Smart Corp for any medical clinic.", author: "Dr. Emily Chen", role: "Dermatology Center", rating: 5, timeAgo: "3 weeks ago", initial: "E", color: "bg-green-500" }
];

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col">
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-medium text-lg flex-shrink-0`}>{t.initial}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm">{t.author}</div>
              <div className="text-xs text-gray-500">{t.timeAgo}</div>
            </div>
          </div>
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-gray-200 text-gray-200'}`} />
            ))}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed flex-grow">{t.quote}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">{t.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
