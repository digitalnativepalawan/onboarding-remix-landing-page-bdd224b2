import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I still need Sirvoy, or does Palawan Collective replace it?",
    answer: "Sirvoy manages your bookings and channel syncing (Booking.com, Agoda, Airbnb). Palawan Collective sits on top of Sirvoy to manage daily operations like staff, payroll, food orders, tours, transport, inventory, and reporting."
  },
  {
    question: "Will this stop double bookings on Booking.com, Agoda, and Airbnb?",
    answer: "Yes. Sirvoy keeps availability synced across platforms in real time. Palawan Collective uses that live booking data across the rest of your operations."
  },
  {
    question: "I'm not techy — is this hard to use?",
    answer: "No. This system was built by a local Palawan resort owner for other owners. If you can use the Booking.com extranet, you can use this dashboard."
  },
  {
    question: "Can I still log in directly to Booking.com, Agoda, or Airbnb?",
    answer: "Yes. Nothing changes with your OTA accounts. You simply stop doing everything manually because updates flow through Sirvoy automatically."
  },
  {
    question: "What kind of data can I actually see?",
    answer: "Occupancy, revenue, booking trends, guest demographics, last year vs this year comparisons, staff hours, expenses, food sales, and overall operational performance — all in one dashboard."
  },
  {
    question: "Does this work for small resorts, eco-lodges, or homestays?",
    answer: "Yes. It is designed specifically for small to mid-size accommodations common in Palawan, not large hotel chains."
  },
  {
    question: "Can my staff use this system too?",
    answer: "Yes. Staff can clock in and out, view schedules, manage food orders, and communicate internally, while owners control access to sensitive data."
  },
  {
    question: "What happens if the internet goes down?",
    answer: "Booking data stays safe in Sirvoy. For operations, offline Bluetooth messaging (BitChat) allows staff to communicate even without signal."
  },
  {
    question: "Do you help with setup and onboarding?",
    answer: "Yes. This is a Palawan pilot program. We assist with connecting Sirvoy, setting up the dashboard, and onboarding step by step."
  },
  {
    question: "Is this system only for Palawan?",
    answer: "The pilot launch is for Palawan, but the platform is built to scale across Southeast Asia."
  },
  {
    question: "How much does Sirvoy cost, and what do I pay for Palawan Collective?",
    answer: "Sirvoy offers a 14-day free trial. After that, pricing starts around USD $20 (≈ PHP ₱1,100) per month for Starter plans and around USD $73 (≈ PHP ₱4,000) per month for Pro plans for small resorts. You pay Sirvoy directly. All Palawan Collective dashboard tools are free during the Palawan pilot program."
  },
  {
    question: "Which booking platforms does Sirvoy support?",
    answer: "Sirvoy directly supports Booking.com, Agoda, Expedia Group, and Airbnb. Other platforms like Vrbo may sync availability via calendar (iCal). Platforms like Trip.com may have limited or indirect support."
  },
  {
    question: "Will this affect my ranking on Booking.com or Agoda?",
    answer: "No. Accurate availability and fewer errors often improve performance."
  },
  {
    question: "Who owns my data?",
    answer: "You do. Your booking and operational data remains yours."
  },
  {
    question: "What if I stop using Palawan Collective later?",
    answer: "Your bookings remain fully managed in Sirvoy. There is no lock-in."
  },
  {
    question: "Can this handle walk-ins, cash payments, or manual bookings?",
    answer: "Yes. Walk-ins, cash payments, and phone bookings can be recorded so reports stay accurate."
  },
  {
    question: "Do you take commissions on bookings, food, or tours?",
    answer: "No. Sirvoy charges a flat monthly fee. Palawan Collective does not take commissions during the pilot."
  },
  {
    question: "Why was this built specifically for Palawan?",
    answer: "Because global hotel software is not designed for island resorts with seasonal staff, weak signal, mixed payments, and hands-on owners."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-background relative">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border/50" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              Clear answers for accommodation owners and resort managers in Palawan.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/30 rounded-lg px-4 bg-muted/20 data-[state=open]:bg-muted/40 transition-colors"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-normal text-foreground/90 hover:no-underline hover:text-foreground py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground font-light leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
    </section>
  );
};

export default FAQSection;
