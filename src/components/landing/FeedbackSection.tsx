import { useState, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface FeedbackItem {
  id: string;
  message: string;
  author_name: string;
  created_at: string;
}

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
      } else {
        setFeedbackList(data || []);
      }
      setIsLoading(false);
    };

    fetchFeedback();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        (payload) => {
          console.log('New feedback received:', payload);
          setFeedbackList(prev => [payload.new as FeedbackItem, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Please enter your feedback",
        description: "We'd love to hear your thoughts!",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('feedback')
      .insert({
        message: feedback.trim(),
        author_name: authorName.trim() || 'Anonymous'
      });

    if (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it soon."
      });
      setFeedback("");
      setAuthorName("");
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="feedback" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-normal border border-primary/20 mb-4">
              Feedback
            </span>
            <h2 className="section-title mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-secondary" />
              We're Continuously Improving
            </h2>
            <p className="section-subtitle mx-auto">
              Share your ideas, issues, or suggestions to help us build a better system
            </p>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="icon-wrapper shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-normal mb-2 text-foreground/80">
                    Your Name (optional)
                  </label>
                  <input
                    id="author"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name or leave blank for anonymous"
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="feedback" className="block text-sm font-normal mb-2 text-foreground/80">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What features would you like to see? Any issues to report? We're all ears..."
                    className="w-full h-32 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>

          {/* Feedback List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Your Feedback
              <span className="text-sm font-normal text-muted-foreground/70">
                ({feedbackList.length} {feedbackList.length === 1 ? 'comment' : 'comments'})
              </span>
            </h3>
            
            {isLoading ? (
              <div className="glass-card p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading feedback...</p>
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No feedback yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((item) => (
                  <div 
                    key={item.id}
                    className="glass-card p-6 transition-all duration-300 hover:border-primary/30 animate-fade-up"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="font-medium text-foreground">
                            {item.author_name || 'Anonymous'}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.message}
                        </p>
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
