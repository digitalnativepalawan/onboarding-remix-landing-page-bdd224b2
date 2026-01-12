import { useState, useEffect } from "react";
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
      
      // First try to get FAQs in the current language
      const { data: localizedData, error: localizedError } = await supabase
        .from("faqs")
        .select("*")
        .eq("language", language)
        .order("display_order", { ascending: true });

      if (!localizedError && localizedData && localizedData.length > 0) {
        setFaqs(localizedData);
        return;
      }

      // Fallback to English if no FAQs found for current language
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

      // If nothing found, set empty array
      setFaqs([]);
    };
    fetchFaqs();
  }, [language]);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="px-5 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-tag mb-3">{t("faq.tag")}</span>
            <h2 className="section-title mb-2">{t("faq.title")}</h2>
            <p className="section-subtitle mx-auto">{t("faq.subtitle")}</p>
          </div>

          {isUsingFallback && (
            <p className="text-xs text-muted-foreground/70 text-center mb-4 italic">
              {t("faq.fallbackNotice")}
            </p>
          )}

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`} className="border border-border/20 rounded-lg px-4 bg-card/30 data-[state=open]:bg-card/50 transition-colors">
                <AccordionTrigger className="text-left text-sm font-normal text-foreground/90 hover:no-underline hover:text-foreground py-3.5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground/80 leading-relaxed pb-3.5 whitespace-pre-line">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
