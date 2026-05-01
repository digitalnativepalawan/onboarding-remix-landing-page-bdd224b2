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
    <section id="feedback" className="section-padding">
      <div className="page-container max-w-3xl">
        <div className="text-center">
          <span className="section-tag">{t("feedback.tag")}</span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-[#F0EDE8]">
            {t("feedback.title")}
          </h2>
          <p className="text-base text-[#888888] mt-4">
            {t("feedback.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 mt-10">
          <div className="space-y-4">
            <div>
              <label htmlFor="author" className="text-sm font-medium text-[#F0EDE8] mb-2 block">
                {t("feedback.nameLabel")}
              </label>
              <input
                id="author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t("feedback.namePlaceholder")}
                className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-[4px] px-4 py-3 text-sm text-[#F0EDE8] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#FF4D2E]/40 focus:border-[#FF4D2E]/50 transition-all duration-200 min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="feedback" className="text-sm font-medium text-[#F0EDE8] mb-2 block">
                {t("feedback.feedbackLabel")}
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t("feedback.messagePlaceholder")}
                rows={4}
                className="w-full resize-y bg-[#1a1a1a] border border-white/[0.08] rounded-[4px] px-4 py-3 text-sm text-[#F0EDE8] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#FF4D2E]/40 focus:border-[#FF4D2E]/50 transition-all duration-200 min-h-[44px]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto mt-5 inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[4px] bg-[#FF4D2E] hover:bg-[#e6432a] text-white text-sm font-medium shadow-lg shadow-[#FF4D2E]/15 transition-all duration-200 disabled:opacity-50 min-h-[44px]"
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
          <h3 className="text-sm font-medium text-[#F0EDE8] mb-4 font-display">
            {t("feedback.recentTitle")} ({feedbackList.length})
          </h3>
          {isLoading ? (
            <div className="glass-card p-6 text-center">
              <div className="w-5 h-5 border-2 border-[#FF4D2E]/30 border-t-[#FF4D2E] rounded-full animate-spin mx-auto" />
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-[#888888]">{t("feedback.noFeedback")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.slice(0, 5).map((item) => (
                <div key={item.id} className="glass-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#FF4D2E]/10 border border-[#FF4D2E]/25 flex items-center justify-center text-[#FF4D2E] shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-[#F0EDE8] truncate">
                        {item.author_name || t("feedback.anonymous")}
                      </span>
                    </div>
                    <span className="text-xs text-[#555555] flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {format(new Date(item.created_at), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-[#888888] mt-2 leading-relaxed">{item.message}</p>
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
