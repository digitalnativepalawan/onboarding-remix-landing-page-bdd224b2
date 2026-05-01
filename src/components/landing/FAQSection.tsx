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
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

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
    <section id="faq" className="section-padding">
      <div className="page-container max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="section-tag">{t("faq.tag")}</span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-[#F0EDE8]">
            Common Questions
          </h2>
          <p className="text-base text-[#888888] mt-4">
            {t("faq.subtitle")}
          </p>
        </div>

        {isUsingFallback && (
          <p className="text-xs text-[#888888] mb-4 italic">
            {t("faq.fallbackNotice")}
          </p>
        )}

        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="border-t border-white/[0.08]"
        >
          {faqs.map((faq, index) => {
            const itemValue = `item-${index}`;
            const isActive = openItem === itemValue;
            return (
              <AccordionItem
                key={faq.id}
                value={itemValue}
                className={`border-b border-white/[0.08] transition-all duration-200 ${
                  isActive ? "border-l-[3px] border-l-[#FF4D2E] pl-4" : "border-l-[3px] border-l-transparent pl-4"
                }`}
              >
                <AccordionTrigger
                  className={`py-5 text-base font-medium hover:no-underline transition-colors duration-200 text-left min-h-[44px] ${
                    isActive ? "text-[#FF4D2E]" : "text-[#F0EDE8] hover:text-[#FF4D2E]"
                  }`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0 text-sm text-[#888888] leading-relaxed max-w-prose whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="text-center mt-10">
          <a
            href="https://wa.me/639474443597"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:gap-2 transition-all text-sm font-medium text-[#FF4D2E] min-h-[44px]"
          >
            Still have questions?
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
