import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I still need Sirvoy?",
    answer: "Yes. Sirvoy manages bookings and channel syncing. Palawan Collective sits on top to manage daily operations — staff, payroll, food orders, inventory, and reporting."
  },
  {
    question: "Will this prevent double bookings?",
    answer: "Yes. Sirvoy keeps availability synced across Booking.com, Agoda, and Airbnb in real time."
  },
  {
    question: "Is this hard to use?",
    answer: "No. Built by a Palawan resort owner for other owners. If you can use the Booking.com extranet, you can use this."
  },
  {
    question: "What data can I see?",
    answer: "Occupancy, revenue, trends, guest demographics, staff hours, expenses, food sales, and overall performance — all in one place."
  },
  {
    question: "Does it work for small resorts?",
    answer: "Yes. Designed for eco-lodges, homestays, and boutique resorts — not hotel chains."
  },
  {
    question: "Can staff use the system?",
    answer: "Yes. Staff clock in/out, view schedules, manage food orders, and chat internally. Owners control access to sensitive data."
  },
  {
    question: "What happens offline?",
    answer: "Booking data stays safe in Sirvoy. BitChat allows staff communication even without signal."
  },
  {
    question: "Do you help with setup?",
    answer: "Yes. We assist with connecting Sirvoy, setting up the dashboard, and onboarding step by step."
  },
  {
    question: "How much does it cost?",
    answer: "Sirvoy starts at ~₱1,100/month. Palawan Collective tools are free during the pilot program. No commissions."
  },
  {
    question: "Who owns my data?",
    answer: "You do. Your booking and operational data remains fully yours. No lock-in."
  }
];

const FAQSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="px-5 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="section-tag mb-3">FAQ</span>
            <h2 className="section-title mb-2">Common Questions</h2>
            <p className="section-subtitle mx-auto">
              Quick answers for Palawan resort owners
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/20 rounded-lg px-4 bg-card/30 data-[state=open]:bg-card/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-sm font-normal text-foreground/90 hover:no-underline hover:text-foreground py-3.5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground/80 leading-relaxed pb-3.5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
