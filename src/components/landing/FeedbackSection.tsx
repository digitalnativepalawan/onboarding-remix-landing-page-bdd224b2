import { useState, useEffect } from "react";
import { MessageSquare, Send, User, Clock } from "lucide-react";
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
    <section id="feedback" className="py-12 sm:py-16 md:py-20 bg-muted/20">
      <div className="px-5 sm:px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <span className="section-tag mb-3">{t("feedback.tag")}</span>
            <h2 className="section-title mb-2">{t("feedback.title")}</h2>
            <p className="section-subtitle mx-auto">{t("feedback.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-5 mb-6">
            <div className="space-y-3">
              <div>
                <label htmlFor="author" className="block text-xs text-white/80 mb-1.5">{t("feedback.nameLabel")}</label>
                <input id="author" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder={t("feedback.namePlaceholder")} className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/30 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
              </div>
              <div>
                <label htmlFor="feedback" className="block text-xs text-white/80 mb-1.5">{t("feedback.feedbackLabel")}</label>
                <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t("feedback.messagePlaceholder")} className="w-full h-24 px-3 py-2 rounded-lg bg-muted/50 border border-border/30 text-sm text-white placeholder:text-white/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm transition-all hover:opacity-90 disabled:opacity-50">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Send className="w-4 h-4" />{t("feedback.submitButton")}</>}
            </button>
          </form>

          <div>
            <h3 className="text-xs text-white/70 mb-3 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" />{t("feedback.recentTitle")} ({feedbackList.length})</h3>
            {isLoading ? (
              <div className="glass-card p-6 text-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
            ) : feedbackList.length === 0 ? (
              <div className="glass-card p-6 text-center"><p className="text-xs text-white/60">{t("feedback.noFeedback")}</p></div>
            ) : (
              <div className="space-y-2">
                {feedbackList.slice(0, 5).map((item) => (
                  <div key={item.id} className="glass-card p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><User className="w-3.5 h-3.5" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs text-white">{item.author_name || t("feedback.anonymous")}</span>
                            <span className="text-[0.65rem] text-white/60 flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(item.created_at), 'MMM d')}</span>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
