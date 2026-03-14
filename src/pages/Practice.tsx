import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flag, SkipForward, Pause, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const QuizArena3D = lazy(() => import("../components/3d/QuizArena3D"));

interface Question {
  id: string;
  subject: string;
  chapter: string;
  text: string;
  options: string[];
  correct: number;
}

const Practice = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const userExamType = profile?.exam_type || "A/L";
  const userStream = profile?.stream || "Science";

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would have a 'questions' table.
        // For now, we simulate fetching filtered questions or use a fallback.
        // I'll fetch subjects first to show subject-specific "real" feel.
        
        const { data: subjectData } = await supabase
          .from("subjects")
          .select("id, name_en, slug")
          .eq("exam_type", userExamType)
          .contains("streams", [userStream]);

        // Mocking real-feeling questions based on the user's actual subjects
        const activeSubject = subjectData?.[0]?.name_en || (userExamType === "O/L" ? "Mathematics" : "Physics");
        
        const dynamicQuestions: Question[] = [
          {
            id: "1",
            subject: activeSubject,
            chapter: "Fundamentals",
            text: userExamType === "O/L" 
              ? "What is the value of 5 + 3 * 2?" 
              : `A complex problem in ${activeSubject} requires understanding of...`,
            options: userExamType === "O/L" ? ["A) 11", "B) 16", "C) 13", "D) 10"] : ["Option A", "Option B", "Option C", "Option D"],
            correct: 0,
          },
          // Adding more to simulate a real set
          {
            id: "2",
            subject: activeSubject,
            chapter: "Basics",
            text: `Which of these is a key concept in ${userExamType} ${activeSubject}?`,
            options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
            correct: 1,
          }
        ];

        setQuestions(dynamicQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchQuestions();
    }
  }, [profile, userExamType, userStream]);

  const question = questions[currentQ];

  useEffect(() => {
    if (submitted || finished || !question) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleAutoSubmit();
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQ, submitted, finished, question]);

  const handleAutoSubmit = () => {
    if (!submitted) handleSubmit(-1);
  };

  const handleSubmit = useCallback((idx: number) => {
    if (submitted || !question) return;
    setSelected(idx);
    setSubmitted(true);
    if (idx === question.correct) {
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
  }, [submitted, question]);

  const saveScore = useCallback(async (finalCorrect: number, totalQuestions: number) => {
    if (!user || questions.length === 0) return;
    setSaving(true);
    
    const mainSubject = questions[0]?.subject || "General";
    const scorePoints = finalCorrect * 10;

    try {
      const { data: existing } = await supabase
        .from("user_scores")
        .select("id, score, questions_answered, correct_answers")
        .eq("user_id", user.id)
        .eq("subject", mainSubject)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_scores")
          .update({
            score: existing.score + scorePoints,
            questions_answered: existing.questions_answered + totalQuestions,
            correct_answers: existing.correct_answers + finalCorrect,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_scores").insert({
          user_id: user.id,
          subject: mainSubject,
          score: scorePoints,
          questions_answered: totalQuestions,
          correct_answers: finalCorrect,
        });
      }
      toast({ title: "Score saved!", description: "Your leaderboard ranking has been updated." });
    } catch (err) {
      console.error("Failed to save score", err);
    } finally {
      setSaving(false);
    }
  }, [user, questions, toast]);

  const nextQuestion = () => {
    if (currentQ >= questions.length - 1) {
      setFinished(true);
      saveScore(score.correct, questions.length);
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setSubmitted(false);
    setTimeLeft(60);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Preparing your {userExamType} practice session...</p>
      </div>
    );
  }

  if (finished) {
    const total = questions.length;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-2">
            {score.correct} / {total}
          </h2>
          <p className="text-muted-foreground mb-6">Accuracy: {pct}%</p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="font-mono font-bold text-2xl text-success">{score.correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-mono font-bold text-2xl text-destructive">{score.wrong}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>
          <Link to="/dashboard" className="block w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  const timerPercent = (timeLeft / 60) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <div className="min-h-screen bg-background relative">
      <Suspense fallback={null}><QuizArena3D /></Suspense>
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <p className="text-sm font-semibold text-foreground">{question.subject}</p>
              <p className="text-xs text-muted-foreground">{question.chapter}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted-foreground">Q {currentQ + 1} / {questions.length}</span>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <span className={`text-xs font-mono font-bold ${isLowTime ? "text-destructive animate-pulse" : "text-foreground"}`}>{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <motion.div key={question.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-relaxed">{question.text}</h2>
          <div className="grid gap-3">
            {question.options.map((option, i) => {
              let style = "glass hover:bg-muted/80";
              if (submitted) {
                if (i === question.correct) style = "bg-success/20 border-success/50";
                else if (i === selected) style = "bg-destructive/20 border-destructive/50";
                else style = "opacity-50";
              } else if (selected === i) style = "border-primary glow-blue";

              return (
                <button
                  key={i}
                  onClick={() => !submitted && handleSubmit(i)}
                  className={`w-full text-left p-4 rounded-xl transition-all border border-border/50 ${style}`}
                  disabled={submitted}
                >
                  <span className="text-foreground">{option}</span>
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="flex justify-end">
              <button onClick={nextQuestion} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
                {currentQ >= questions.length - 1 ? "Finish" : "Next Question"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Practice;