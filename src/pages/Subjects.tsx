import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, TrendingUp, Target } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";

const subjects = [
  {
    slug: "combined-maths",
    icon: "📐",
    nameKey: "subject.combinedMaths",
    chapters: 8,
    questions: 8200,
    accuracy: 64,
    progress: 42,
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    slug: "physics",
    icon: "⚡",
    nameKey: "subject.physics",
    chapters: 5,
    questions: 6400,
    accuracy: 78,
    progress: 61,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    slug: "chemistry",
    icon: "🧪",
    nameKey: "subject.chemistry",
    chapters: 4,
    questions: 5800,
    accuracy: 69,
    progress: 38,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    slug: "biology",
    icon: "🧬",
    nameKey: "subject.biology",
    chapters: 5,
    questions: 6100,
    accuracy: 81,
    progress: 55,
    color: "from-pink-500/20 to-rose-500/20",
  },
];

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
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" /> {t("dashboard.yourSubjects")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("subjects.desc")}</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-mono font-bold text-foreground">4</p>
            <p className="text-xs text-muted-foreground">{t("subjects.totalSubjects")}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-mono font-bold text-foreground">22</p>
            <p className="text-xs text-muted-foreground">{t("subjects.totalChapters")}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-mono font-bold text-foreground">26,500</p>
            <p className="text-xs text-muted-foreground">{t("subjects.totalQuestions")}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-mono font-bold text-primary">73%</p>
            <p className="text-xs text-muted-foreground">{t("subjects.overallAccuracy")}</p>
          </div>
        </motion.div>

        {/* Subject cards */}
        <div className="grid gap-4">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                to={`/dashboard/subjects/${subject.slug}`}
                className="glass rounded-xl p-5 flex items-center gap-5 hover:bg-muted/30 transition-all group block"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {subject.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-foreground text-lg">{t(subject.nameKey)}</h3>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span>{subject.chapters} {t("subjects.chapters")}</span>
                    <span>{subject.questions.toLocaleString()} {t("subjects.questions")}</span>
                    <span className={`font-mono font-semibold ${masteryText(subject.accuracy)}`}>
                      <Target className="w-3 h-3 inline mr-0.5" />{subject.accuracy}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${masteryColor(subject.accuracy)} transition-all`}
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">{subject.progress}%</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subjects;
