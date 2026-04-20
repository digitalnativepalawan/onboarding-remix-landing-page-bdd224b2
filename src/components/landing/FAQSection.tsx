import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation, useLocale } from "@/contexts/LocaleContext";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  language: string;
}

const FAQSection = () => {
  const { t } = useTranslation();
  const { language } = useLocale();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsUsingFallback(false);

      const { data: localizedData, error: localizedError } = await supabase
        .from("faqs")
        .select("*")
        .eq("language", language)
        .order("display_order", { ascending: true });

      if (!localizedError && localizedData && localizedData.length > 0) {
        setFaqs(localizedData);
        return;
      }

      if (language !== "en") {
        const { data: englishData, error: englishError } = await supabase
          .from("faqs")
          .select("*")
          .eq("language", "en")
          .order("display_order", { ascending: true });

        if (!englishError && englishData && englishData.length > 0) {
          setFaqs(englishData);
          setIsUsingFallback(true);
          return;
        }
      }

      setFaqs([]);
    };
    fetchFaqs();
  }, [language]);

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-burgundy">
              {t("faq.tag")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white mt-3">
              {t("faq.title")}
            </h2>
            <p className="text-base text-[#A1A1AA] mt-4 max-w-sm">
              {t("faq.subtitle")}
            </p>
            <a
              href="https://wa.me/639474443597"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:gap-2 transition-all text-sm font-medium text-burgundy mt-6"
            >
              Still have questions?
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7">
            {isUsingFallback && (
              <p className="text-xs text-[#A1A1AA] mb-4 italic">
                {t("faq.fallbackNotice")}
              </p>
            )}

            <Accordion type="single" collapsible className="border-t border-white/5">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${index}`}
                  className="border-b border-white/5"
                >
                  <AccordionTrigger className="py-5 text-base md:text-lg font-medium text-white hover:text-burgundy hover:no-underline transition-colors text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pt-0 text-sm md:text-base text-[#A1A1AA] leading-relaxed max-w-prose whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
