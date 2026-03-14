import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Target, GraduationCap, Loader2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Subject = Tables<"subjects"> & {
  chapters_count?: number;
  total_questions?: number;
  user_accuracy?: number;
  user_progress?: number;
};

const masteryColor = (v: number) => {
  if (v >= 70) return "bg-success";
  if (v >= 40) return "bg-warning";
  return "bg-destructive";
};
const masteryText = (v: number) => {
  if (v >= 70) return "text-success";
  if (v >= 40) return "text-warning";
  return "text-destructive";
};

const Subjects = () => {
  const { t, lang } = useLanguage();
  const { profile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const userExamType = profile?.exam_type || "A/L";
  const userStream = profile?.stream || "Science";
  const userGrade = profile?.grade || "13";

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("subjects")
          .select("*, chapters(count)")
          .eq("exam_type", userExamType);

        if (userExamType === "A/L") {
          query = query.contains("streams", [userStream]);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map data and add dummy/mock progress stats for now until user_scores is fully integrated
        const mappedSubjects = (data as any[]).map(s => ({
          ...s,
          chapters_count: s.chapters[0]?.count || 0,
          total_questions: 1000, // Placeholder
          user_accuracy: 0,   // Placeholder
          user_progress: 0    // Placeholder
        }));

        setSubjects(mappedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchSubjects();
    }
  }, [profile, userExamType, userStream]);

  const getSubjectName = (sub: Subject) => {
    if (lang === "si" && sub.name_si) return sub.name_si;
    if (lang === "ta" && sub.name_ta) return sub.name_ta;
    return sub.name_en;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-primary" /> {t("dashboard.yourSubjects")}
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                {userExamType} - Grade {userGrade} {userExamType === "A/L" ? `(${userStream})` : ""}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {userExamType === "A/L"
              ? `Displaying subjects for ${userStream} stream.`
              : `Displaying all core subjects for Grade ${userGrade}.`}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading your curriculum...</p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-mono font-bold text-foreground">{subjects.length}</p>
                <p className="text-xs text-muted-foreground">{t("subjects.totalSubjects")}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-mono font-bold text-foreground">
                  {subjects.reduce((acc, s) => acc + (s.chapters_count || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t("subjects.totalChapters")}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-mono font-bold text-foreground">
                  {subjects.reduce((acc, s) => acc + (s.total_questions || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{t("subjects.totalQuestions")}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-mono font-bold text-primary">
                  {subjects.length > 0 
                    ? Math.round(subjects.reduce((acc, s) => acc + (s.user_accuracy || 0), 0) / subjects.length)
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground">{t("subjects.overallAccuracy")}</p>
              </div>
            </motion.div>

            {/* Subject cards */}
            <div className="grid gap-4">
              {subjects.length > 0 ? (
                subjects.map((subject, i) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={`/dashboard/subjects/${subject.slug}`}
                      className="glass rounded-xl p-5 flex items-center gap-5 hover:bg-muted/30 transition-all group block"
                    >
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${subject.color || "from-muted to-muted/50"} flex items-center justify-center text-3xl flex-shrink-0`}>
                        {subject.icon || "📚"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-foreground text-lg">{getSubjectName(subject)}</h3>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span>{subject.chapters_count} {t("subjects.chapters")}</span>
                          <span>{(subject.total_questions || 0).toLocaleString()} {t("subjects.questions")}</span>
                          <span className={`font-mono font-semibold ${masteryText(subject.user_accuracy || 0)}`}>
                            <Target className="w-3 h-3 inline mr-0.5" />{subject.user_accuracy}%
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${masteryColor(subject.user_accuracy || 0)} transition-all`}
                              style={{ width: `${subject.user_progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground w-10 text-right">{subject.user_progress}%</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="glass rounded-xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">No subjects found</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    We couldn't find any subjects for the {userStream} stream. Try updating your stream in Settings.
                  </p>
                  <Link to="/dashboard/settings" className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    Go to Settings
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subjects;
