import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell
} from "recharts";
import { TrendingUp, Target, Clock, BookOpen, Brain, Award } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";

const dailyAccuracy = [
  { day: "Mon", accuracy: 65 }, { day: "Tue", accuracy: 72 }, { day: "Wed", accuracy: 68 },
  { day: "Thu", accuracy: 75 }, { day: "Fri", accuracy: 71 }, { day: "Sat", accuracy: 80 },
  { day: "Sun", accuracy: 73 },
];

const subjectAccuracy = [
  { subject: "Biology", accuracy: 81, fill: "hsl(160, 84%, 39%)" },
  { subject: "Physics", accuracy: 78, fill: "hsl(187, 94%, 43%)" },
  { subject: "Chemistry", accuracy: 69, fill: "hsl(258, 90%, 66%)" },
  { subject: "Maths", accuracy: 64, fill: "hsl(217, 91%, 60%)" },
];

const topicMastery = [
  { topic: "Integration", mastery: 42 }, { topic: "Differentiation", mastery: 71 },
  { topic: "Algebra", mastery: 85 }, { topic: "Trigonometry", mastery: 63 },
  { topic: "Mechanics", mastery: 78 }, { topic: "Waves", mastery: 72 },
  { topic: "Optics", mastery: 55 }, { topic: "Thermodynamics", mastery: 68 },
  { topic: "Organic Chem", mastery: 61 }, { topic: "Inorganic Chem", mastery: 74 },
  { topic: "Physical Chem", mastery: 58 }, { topic: "Genetics", mastery: 88 },
  { topic: "Ecology", mastery: 82 }, { topic: "Cell Biology", mastery: 79 },
  { topic: "Botany", mastery: 76 }, { topic: "Zoology", mastery: 83 },
];

const studyHeatmap = [
  [0,0,1,2,3,2,1], [1,2,3,3,2,1,0], [0,1,2,3,3,2,1], [2,3,3,2,1,0,0],
];

const dayLabels: Record<string, string[]> = {
  en: ["M","T","W","T","F","S","S"],
  si: ["සඳු","අඟ","බදා","බ්‍ර","සිකු","සෙන","ඉරි"],
  ta: ["தி","செ","பு","வி","வெ","ச","ஞா"],
};

const weekLabels: Record<string, string[]> = {
  en: ["Week 1","Week 2","Week 3","Week 4"],
  si: ["සතිය 1","සතිය 2","සතිය 3","සතිය 4"],
  ta: ["வாரம் 1","வாரம் 2","வாரம் 3","வாரம் 4"],
};

const gradeColor = (g: string) => {
  if (g.startsWith("A")) return "text-success";
  if (g.startsWith("B")) return "text-primary";
  if (g.startsWith("C")) return "text-warning";
  return "text-destructive";
};

const masteryColor = (v: number) => {
  if (v >= 70) return "bg-success";
  if (v >= 40) return "bg-warning";
  return "bg-destructive";
};

const heatColor = (v: number) => {
  if (v === 0) return "bg-muted";
  if (v === 1) return "bg-primary/30";
  if (v === 2) return "bg-primary/60";
  return "bg-primary";
};

const customTooltipStyle = { backgroundColor: "hsl(222, 47%, 9%)", border: "1px solid hsl(220, 20%, 14%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)", fontSize: "12px" };

const Analytics = () => {
  const { t, lang } = useLanguage();

  const predictedGrades = [
    { subjectKey: "subject.combinedMaths", grade: "B", confidence: 72 },
    { subjectKey: "subject.physics", grade: "B+", confidence: 78 },
    { subjectKey: "subject.chemistry", grade: "C+", confidence: 65 },
    { subjectKey: "subject.biology", grade: "A", confidence: 84 },
  ];

  const days = dayLabels[lang] || dayLabels.en;
  const weeks = weekLabels[lang] || weekLabels.en;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{t("analytics.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("analytics.desc")}</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target, label: t("analytics.questionsAnswered"), value: "1,247", color: "text-primary" },
            { icon: TrendingUp, label: t("analytics.overallAccuracy"), value: "71%", color: "text-success" },
            { icon: Clock, label: t("analytics.studyHours"), value: "38.5h", color: "text-accent" },
            { icon: BookOpen, label: t("analytics.subjectsImproved"), value: "3 / 4", color: "text-secondary" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="font-mono font-bold text-2xl text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Subject Accuracy Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4">{t("analytics.accuracyBySubject")}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectAccuracy} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,14%)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215,25%,65%)", fontSize: 11 }} />
                <YAxis type="category" dataKey="subject" tick={{ fill: "hsl(210,40%,98%)", fontSize: 12 }} width={80} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={20}>
                  {subjectAccuracy.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Daily Accuracy Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4">{t("analytics.dailyAccuracyTrend")}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,14%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215,25%,65%)", fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: "hsl(215,25%,65%)", fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ fill: "hsl(217,91%,60%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Topic Mastery Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" /> {t("analytics.topicMastery")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topicMastery.map((tp) => (
              <div key={tp.topic} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-foreground font-medium truncate">{tp.topic}</span>
                  <span className="text-xs font-mono text-muted-foreground">{tp.mastery}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className={`h-2 rounded-full ${masteryColor(tp.mastery)} transition-all`} style={{ width: `${tp.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive" /> &lt;40%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning" /> 40–70%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success" /> &gt;70%</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Study Heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" /> {t("analytics.studyActivity")}
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2 ml-14">
                {days.map((d, i) => <span key={i} className="w-8 text-center text-[10px] text-muted-foreground">{d}</span>)}
              </div>
              {studyHeatmap.map((week, wi) => (
                <div key={wi} className="flex items-center gap-2">
                  <span className="w-12 text-[10px] text-muted-foreground text-right">{weeks[wi]}</span>
                  {week.map((v, di) => (
                    <div key={di} className={`w-8 h-8 rounded-md ${heatColor(v)} transition-colors`} title={`${v} ${t("analytics.sessions")}`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
              <span>{t("analytics.less")}</span>
              {[0,1,2,3].map(v => <div key={v} className={`w-4 h-4 rounded ${heatColor(v)}`} />)}
              <span>{t("analytics.more")}</span>
            </div>
          </motion.div>

          {/* Exam Readiness */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" /> {t("analytics.examReadiness")}
            </h3>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width={160} height={160}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: 72 }]} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" fill="hsl(217,91%,60%)" background={{ fill: "hsl(222,47%,11%)" }} cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="font-mono font-bold text-3xl text-foreground">72%</p>
                <p className="text-[10px] text-muted-foreground">{t("analytics.examReady")}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Predicted Grades */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4">{t("analytics.predictedGrades")}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictedGrades.map((g) => (
              <div key={g.subjectKey} className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">{t(g.subjectKey)}</p>
                <p className={`font-display font-extrabold text-4xl ${gradeColor(g.grade)}`}>{g.grade}</p>
                <p className="text-xs text-muted-foreground mt-1">{g.confidence}% {t("analytics.confidence")}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;