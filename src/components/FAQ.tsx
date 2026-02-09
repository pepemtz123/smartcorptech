import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "How does Smart Film work?", answer: "Smart Film uses Polymer Dispersed Liquid Crystal (PDLC) technology. When electricity is applied, the liquid crystals align to allow light to pass through (transparent). When the power is off, the crystals scatter, making the glass opaque (frosted) for privacy." },
  { question: "Can it be installed on existing glass?", answer: "Yes! Our adhesive Smart Film is designed to be retrofitted onto existing glass windows, partitions, and doors. It's a non-invasive installation process." },
  { question: "Does it block light when opaque?", answer: "No, it does not block light. It diffuses it. You still get about 98% of natural light coming through, but you can't see through it. It provides privacy without making the room dark." },
  { question: "Is it difficult to operate?", answer: "Not at all. It works just like a light switch. We can install a wall switch, a remote control, or even integrate it with smart home systems like Alexa or Google Home." },
  { question: "How long does it last?", answer: "Our Smart Film is rated for over 80,000 hours of 'on' time (transparent state). In a typical use case, this translates to 15+ years of reliable operation." },
  { question: "What about maintenance?", answer: "Maintenance is easy. You can clean the film just like regular glass using a soft cloth and non-abrasive glass cleaner. Avoid harsh chemicals and sharp objects." }
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-200">
            <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-primary transition-colors">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
