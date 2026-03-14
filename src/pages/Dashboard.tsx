import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, AlertTriangle, TrendingUp, Target, Award, Clock, Loader2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const SubjectUniverse3D = lazy(() => import("../components/3d/SubjectUniverse3D"));

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The expert in anything was once a beginner.",
  "Education is the most powerful weapon to change the world.",
];

const Dashboard = () => {
  const { t, lang } = useLanguage();
  const { profile } = useAuth();
  const [subjects, setSubjects] = useState<Tables<"subjects">[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const firstName = profile?.display_name?.split(' ')[0] || "Student";
  const userExamType = profile?.exam_type || "A/L";
  const userStream = profile?.stream || "Science";

  useEffect(() => {
    const fetchTopSubjects = async () => {
      setLoadingSubjects(true);
      try {
        let query = supabase
          .from("subjects")
          .select("*")
          .eq("exam_type", userExamType);

        if (userExamType === "A/L") {
          query = query.contains("streams", [userStream]);
        }

        const { data, error } = await query.limit(4);
        if (error) throw error;
        setSubjects(data || []);
      } catch (error) {
        console.error("Error fetching dashboard subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (profile) {
      fetchTopSubjects();
    }
  }, [profile, userExamType, userStream]);

  const todaysPlan = [
    { subject: t("subject.combinedMaths"), chapter: `${t("dashboard.chapter4")} — ${t("subject.integration")}`, questions: 15, icon: "📐" },
    { subject: t("subject.physics"), chapter: t("subject.wavesOptics"), questions: 10, icon: "⚡" },
    { subject: t("subject.chemistry"), chapter: t("dashboard.paper1MCQs"), questions: 5, icon: "🧪" },
  ];

  const stats = [
    { label: t("dashboard.todaysQuestions"), value: "0", target: "45", color: "primary" },
    { label: t("dashboard.weeklyAccuracy"), value: "0%", target: "", color: "success" },
    { label: t("dashboard.currentStreak"), value: "1", target: t("dashboard.days"), color: "warning" },
    { label: t("dashboard.nationalRank"), value: "N/A", target: "", color: "secondary" },
  ];

  const recentActivity = [
    { text: "Welcome to ExamPrep LK! Start your first session.", time: "Just now", icon: "✨" },
  ];

  const getSubjectName = (sub: Tables<"subjects">) => {
    if (lang === "si" && sub.name_si) return sub.name_si;
    if (lang === "ta" && sub.name_ta) return sub.name_ta;
    return sub.name_en;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            {t("dashboard.greeting")}, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1 italic">"{quote}"</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-xl p-6 gradient-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> {t("dashboard.todaysPlan")}
                </h2>
                <span className="text-xs text-muted-foreground font-mono">30 {t("dashboard.questionsRemaining")}</span>
              </div>
              <div className="space-y-3">
                {todaysPlan.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.chapter}</p>
                    </div>
                    <span className="text-xs font-mono text-primary">{item.questions} Qs</span>
                  </div>
                ))}
              </div>
              <Link
                to="/dashboard/subjects"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-blue"
              >
                <Play className="w-4 h-4" /> {t("dashboard.startSession")}
              </Link>
            </div>
          </motion.div>

          {/* Stats Column */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass rounded-xl p-4 text-center flex flex-col justify-center"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">{stat.label}</p>
                <p className={`font-mono font-bold text-xl text-${stat.color}`}>{stat.value}</p>
                {stat.target && <p className="text-[10px] text-muted-foreground mt-0.5">{stat.target}</p>}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subject Universe 3D */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-xl overflow-hidden lg:col-span-2 lg:row-span-2"
          >
            <div className="px-6 pt-5 pb-2">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                🌌 {t("dashboard.subjectUniverse")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{t("dashboard.subjectUniverseDesc")}</p>
            </div>
            <div className="h-[400px]">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse-glow" />
                </div>
              }>
                <SubjectUniverse3D 
                  subjects={subjects.map(s => ({
                    name: getSubjectName(s),
                    icon: s.icon || "📚",
                    accuracy: 0, // Placeholder for mastery
                    color: s.color?.split(' ')[0].replace('from-', '') || "#3b82f6"
                  }))} 
                  label={t("dashboard.subjectUniverseDesc")}
                />
              </Suspense>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> {t("dashboard.recentActivity")}
            </h3>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weak Topics Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> {t("dashboard.needsAttention")}
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-semibold text-foreground mb-1">Getting Started?</p>
                <p className="text-xs text-muted-foreground mb-3">Begin by exploring your subjects and setting your study targets.</p>
                <Link to="/dashboard/subjects" className="text-xs font-semibold text-warning hover:underline">Explore Subjects</Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Your Subjects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" /> {t("dashboard.yourSubjects")}
            </h3>
            <Link to="/dashboard/subjects" className="text-xs text-primary hover:underline font-semibold">View All</Link>
          </div>
          
          {loadingSubjects ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <Link
                    to={`/dashboard/subjects/${subject.slug}`}
                    key={subject.id}
                    className={`rounded-xl p-5 bg-gradient-to-b ${subject.color || "from-muted to-muted/50"} border border-border/50 hover:scale-[1.02] transition-transform cursor-pointer block group`}
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{subject.icon || "📚"}</div>
                    <h4 className="font-display font-bold text-foreground text-sm mb-2">{getSubjectName(subject)}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted">
                        <div className="h-1.5 rounded-full bg-primary transition-all shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `0%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">0% Complete</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-10 text-center glass rounded-xl">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No subjects configured for your profile yet.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;