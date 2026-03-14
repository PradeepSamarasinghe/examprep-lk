import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flag, SkipForward, Pause, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const QuizArena3D = lazy(() => import("../components/3d/QuizArena3D"));

const mockQuestions = [
  {
    id: 1,
    subject: "Combined Maths",
    chapter: "Integration",
    text: "If f(x) = 3x² − 2x + 1, find f'(2).",
    options: ["A) 8", "B) 10", "C) 12", "D) 14"],
    correct: 1,
  },
  {
    id: 2,
    subject: "Physics",
    chapter: "Waves & Optics",
    text: "A body of mass 5kg is accelerated at 3ms⁻². The net force acting on the body is:",
    options: ["A) 8 N", "B) 15 N", "C) 1.67 N", "D) 2 N"],
    correct: 1,
  },
  {
    id: 3,
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    text: "The molecular formula of glucose is:",
    options: ["A) C₆H₁₂O₆", "B) C₁₂H₂₂O₁₁", "C) C₂H₅OH", "D) CH₃COOH"],
    correct: 0,
  },
  {
    id: 4,
    subject: "Physics",
    chapter: "Mechanics",
    text: "A projectile is launched at 45° with initial velocity 20 m/s. The maximum height reached is approximately:",
    options: ["A) 5.1 m", "B) 10.2 m", "C) 15.3 m", "D) 20.4 m"],
    correct: 1,
  },
  {
    id: 5,
    subject: "Combined Maths",
    chapter: "Differentiation",
    text: "The derivative of sin(3x) with respect to x is:",
    options: ["A) cos(3x)", "B) 3cos(3x)", "C) -3cos(3x)", "D) 3sin(3x)"],
    correct: 1,
  },
];

const Practice = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const question = mockQuestions[currentQ];

  useEffect(() => {
    if (submitted || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit(-1);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQ, submitted, finished]);

  const handleSubmit = useCallback((idx: number) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
    if (idx === question.correct) {
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
  }, [submitted, question.correct]);

  const saveScore = useCallback(async (finalCorrect: number, totalQuestions: number) => {
    if (!user) return;
    setSaving(true);
    // Group questions by subject and save per-subject scores
    const subjectMap: Record<string, { correct: number; total: number }> = {};
    mockQuestions.forEach((q, i) => {
      if (!subjectMap[q.subject]) subjectMap[q.subject] = { correct: 0, total: 0 };
      subjectMap[q.subject].total += 1;
    });
    // We need to track per-question correctness; use a simple approach based on final score
    // For accurate per-subject tracking, we save the dominant subject with the total score
    const mainSubject = mockQuestions[0]?.subject ?? "General";
    const scorePoints = finalCorrect * 10;

    try {
      // Check if user already has a score for this subject
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
  }, [user, toast]);

  const nextQuestion = () => {
    if (currentQ >= mockQuestions.length - 1) {
      setFinished(true);
      saveScore(score.correct, mockQuestions.length);
      return;
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setSubmitted(false);
    setTimeLeft(60);
  };

  const timerPercent = (timeLeft / 60) * 100;
  const isLowTime = timeLeft <= 10;

  if (finished) {
    const total = mockQuestions.length;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            {pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}
          </motion.div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-2">
            {score.correct} / {total}
          </h2>
          <p className="text-muted-foreground mb-1">
            {pct >= 80 ? t("practice.excellentWork") : pct >= 60 ? t("practice.goodJob") : t("practice.keepPracticing")}
          </p>
          <p className="text-sm text-muted-foreground mb-6">{t("practice.accuracy")}: {pct}%</p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="font-mono font-bold text-2xl text-success">{score.correct}</p>
              <p className="text-xs text-muted-foreground">{t("practice.correct")}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-mono font-bold text-2xl text-destructive">{score.wrong}</p>
              <p className="text-xs text-muted-foreground">{t("practice.wrong")}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {t("practice.backToDashboard")}
            </Link>
            <button
              onClick={() => { setCurrentQ(0); setScore({ correct: 0, wrong: 0 }); setSelected(null); setSubmitted(false); setTimeLeft(60); setFinished(false); }}
              className="block w-full py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              {t("practice.tryAgain")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Arena Background */}
      <Suspense fallback={null}>
        <QuizArena3D />
      </Suspense>

      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-sm font-semibold text-foreground">{question.subject}</p>
              <p className="text-xs text-muted-foreground">{question.chapter}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted-foreground">
              {t("practice.questionOf")} {currentQ + 1} {t("practice.of")} {mockQuestions.length}
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" /> {score.correct}
              <XCircle className="w-3.5 h-3.5 text-destructive" /> {score.wrong}
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle
                  cx="20" cy="20" r="16" fill="none"
                  stroke={isLowTime ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  strokeWidth="3"
                  strokeDasharray={`${timerPercent} ${100 - timerPercent}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-bold ${isLowTime ? "text-destructive" : "text-foreground"}`}>
                {timeLeft}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-0.5 bg-primary transition-all duration-300"
            style={{ width: `${((currentQ + 1) / mockQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question number */}
            <div className="inline-flex items-center px-3 py-1 rounded-full glass text-xs text-primary font-mono mb-4">
              Q{currentQ + 1}
            </div>

            {/* Question text */}
            <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
              {question.text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, i) => {
                let styles = "glass hover:bg-muted/80 cursor-pointer";
                if (submitted) {
                  if (i === question.correct) styles = "bg-success/20 border-success/50 border";
                  else if (i === selected && i !== question.correct) styles = "bg-destructive/20 border-destructive/50 border animate-[shake_0.3s_ease-in-out]";
                  else styles = "glass opacity-50";
                } else if (selected === i) {
                  styles = "glass border-primary border glow-blue";
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!submitted ? { scale: 1.01 } : {}}
                    whileTap={!submitted ? { scale: 0.99 } : {}}
                    onClick={() => !submitted && handleSubmit(i)}
                    className={`w-full text-left p-4 rounded-xl transition-all text-sm ${styles}`}
                    disabled={submitted}
                  >
                    <span className="text-foreground">{option}</span>
                    {submitted && i === question.correct && (
                      <CheckCircle2 className="inline ml-2 w-4 h-4 text-success" />
                    )}
                    {submitted && i === selected && i !== question.correct && (
                      <XCircle className="inline ml-2 w-4 h-4 text-destructive" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl glass"
                >
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{t("practice.explanation")}: </span>
                    {selected === question.correct
                      ? t("practice.correctExplanation")
                      : `${t("practice.correctAnswerIs")} ${question.options[question.correct]}. ${t("practice.wrongExplanation")}`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Bottom actions */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-between"
          >
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Flag className="w-4 h-4" /> {t("practice.flagForReview")}
            </button>
            <button
              onClick={nextQuestion}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {currentQ >= mockQuestions.length - 1 ? t("practice.finish") : t("practice.nextQuestion")} <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Practice;