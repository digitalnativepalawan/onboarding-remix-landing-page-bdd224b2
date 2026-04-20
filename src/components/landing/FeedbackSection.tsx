import { useState, useEffect } from "react";
import { Send, User, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useTranslation } from "@/contexts/LocaleContext";

interface FeedbackItem {
  id: string;
  message: string;
  author_name: string;
  created_at: string;
}

const FeedbackSection = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
      if (!error) setFeedbackList(data || []);
      setIsLoading(false);
    };
    fetchFeedback();

    const channel = supabase.channel('feedback-changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedback' }, (payload) => {
      setFeedbackList(prev => [payload.new as FeedbackItem, ...prev]);
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({ title: t("feedback.emptyValidation"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('feedback').insert({ message: feedback.trim(), author_name: authorName.trim() || t("feedback.anonymous") });
    if (error) {
      toast({ title: t("feedback.errorTitle"), variant: "destructive" });
    } else {
      toast({ title: t("feedback.successTitle") });
      setFeedback("");
      setAuthorName("");
    }
    setIsSubmitting(false);
  };

  return (
    <section id="feedback" className="py-20 md:py-28 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-burgundy">
            {t("feedback.tag")}
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-3">
            {t("feedback.title")}
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] mt-4">
            {t("feedback.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-white/5 rounded-2xl p-6 md:p-8 mt-10">
          <div className="space-y-4">
            <div>
              <label htmlFor="author" className="text-sm font-medium text-white mb-2 block">
                {t("feedback.nameLabel")}
              </label>
              <input
                id="author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t("feedback.namePlaceholder")}
                className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-burgundy/40 focus:border-burgundy/50 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="feedback" className="text-sm font-medium text-white mb-2 block">
                {t("feedback.feedbackLabel")}
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t("feedback.messagePlaceholder")}
                className="w-full min-h-[120px] resize-y bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-burgundy/40 focus:border-burgundy/50 transition-all duration-200"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-5 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-burgundy hover:bg-burgundy/90 text-white text-sm font-medium shadow-lg shadow-burgundy/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t("feedback.submitButton")}
              </>
            )}
          </button>
        </form>

        <div className="mt-10">
          <h3 className="text-sm font-medium text-white mb-4">
            {t("feedback.recentTitle")} ({feedbackList.length})
          </h3>
          {isLoading ? (
            <div className="bg-card/50 border border-white/5 rounded-xl p-6 text-center">
              <div className="w-5 h-5 border-2 border-burgundy/30 border-t-burgundy rounded-full animate-spin mx-auto" />
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="bg-card/50 border border-white/5 rounded-xl p-6 text-center">
              <p className="text-sm text-[#A1A1AA]">{t("feedback.noFeedback")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.slice(0, 5).map((item) => (
                <div key={item.id} className="bg-card/50 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-burgundy/15 border border-burgundy/25 flex items-center justify-center text-burgundy shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-white truncate">
                        {item.author_name || t("feedback.anonymous")}
                      </span>
                    </div>
                    <span className="text-xs text-[#71717A] flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {format(new Date(item.created_at), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
