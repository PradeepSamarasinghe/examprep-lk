import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Play, AlertTriangle, TrendingUp, Target, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";

const SubjectUniverse3D = lazy(() => import("../components/3d/SubjectUniverse3D"));

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The expert in anything was once a beginner.",
  "Education is the most powerful weapon to change the world.",
];

const Dashboard = () => {
  const { t } = useLanguage();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const todaysPlan = [
    { subject: t("subject.combinedMaths"), chapter: `${t("dashboard.chapter4")} — ${t("subject.integration")}`, questions: 15, icon: "📐" },
    { subject: t("subject.physics"), chapter: t("subject.wavesOptics"), questions: 10, icon: "⚡" },
    { subject: t("subject.chemistry"), chapter: t("dashboard.paper1MCQs"), questions: 5, icon: "🧪" },
  ];

  const stats = [
    { label: t("dashboard.todaysQuestions"), value: "28", target: "45", color: "primary" },
    { label: t("dashboard.weeklyAccuracy"), value: "73%", target: "", color: "success" },
    { label: t("dashboard.currentStreak"), value: "23", target: t("dashboard.days"), color: "warning" },
    { label: t("dashboard.nationalRank"), value: "#847", target: "/ 18,429", color: "secondary" },
  ];

  const recentActivity = [
    { text: t("dashboard.completedPhysics"), time: t("dashboard.hoursAgo"), icon: "✅" },
    { text: t("dashboard.newPersonalBest"), time: t("dashboard.yesterday"), icon: "🏆" },
    { text: t("dashboard.unlockedBadge"), time: t("dashboard.daysAgo"), icon: "🎖️" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            {t("dashboard.greeting")}, Sanduni! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1 italic">"{quote}"</p>
        </motion.div>

        {/* Today's Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 gradient-border"
        >
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
            to="/practice"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-blue"
          >
            <Play className="w-4 h-4" /> {t("dashboard.startSession")}
          </Link>
        </motion.div>

        {/* Subject Universe 3D */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-xl overflow-hidden"
        >
          <div className="px-6 pt-5 pb-2">
            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
              🌌 {t("dashboard.subjectUniverse")}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{t("dashboard.subjectUniverseDesc")}</p>
          </div>
          <Suspense fallback={
            <div className="w-full h-[400px] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse-glow" />
            </div>
          }>
            <SubjectUniverse3D />
          </Suspense>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="glass rounded-xl p-4 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`font-mono font-bold text-2xl text-${stat.color}`}>{stat.value}</p>
              {stat.target && <p className="text-xs text-muted-foreground mt-0.5">{stat.target}</p>}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-foreground">{item.text}</p>
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
                <p className="text-sm text-foreground mb-1">⚠️ {t("dashboard.missedSessions")} {t("subject.integration")}</p>
                <p className="text-xs text-muted-foreground mb-3">{t("subject.combinedMaths")} — {t("dashboard.chapter4")}</p>
                <Link to="/practice" className="text-xs font-semibold text-warning hover:underline">{t("dashboard.practiceNow")}</Link>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-foreground mb-1">📉 {t("subject.chemistry")} {t("dashboard.accuracyDropped")}</p>
                <p className="text-xs text-muted-foreground mb-3">{t("dashboard.downFromLastWeek")}</p>
                <Link to="/practice" className="text-xs font-semibold text-destructive hover:underline">{t("dashboard.reviewTopics")}</Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subject Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" /> {t("dashboard.yourSubjects")}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { nameKey: "subject.combinedMaths", slug: "combined-maths", icon: "📐", accuracy: 64, color: "from-primary/20 to-primary/5" },
              { nameKey: "subject.physics", slug: "physics", icon: "⚡", accuracy: 78, color: "from-accent/20 to-accent/5" },
              { nameKey: "subject.chemistry", slug: "chemistry", icon: "🧪", accuracy: 69, color: "from-secondary/20 to-secondary/5" },
              { nameKey: "subject.biology", slug: "biology", icon: "🧬", accuracy: 81, color: "from-success/20 to-success/5" },
            ].map((subject) => (
              <Link
                to={`/dashboard/subjects/${subject.slug}`}
                key={subject.nameKey}
                className={`rounded-xl p-5 bg-gradient-to-b ${subject.color} border border-border/50 hover:scale-[1.02] transition-transform cursor-pointer block`}
              >
                <div className="text-3xl mb-3">{subject.icon}</div>
                <h4 className="font-display font-bold text-foreground text-sm mb-2">{t(subject.nameKey)}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${subject.accuracy}%` }} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{subject.accuracy}%</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;