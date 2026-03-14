import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell
} from "recharts";
import { TrendingUp, Target, Clock, BookOpen, Brain, Award, Loader2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const dailyAccuracy = [
  { day: "Mon", accuracy: 65 }, { day: "Tue", accuracy: 72 }, { day: "Wed", accuracy: 68 },
  { day: "Thu", accuracy: 75 }, { day: "Fri", accuracy: 71 }, { day: "Sat", accuracy: 80 },
  { day: "Sun", accuracy: 73 },
];

const gradeColor = (g: string) => {
  if (g.startsWith("A")) return "text-success";
  if (g.startsWith("B")) return "text-primary";
  if (g.startsWith("C")) return "text-warning";
  return "text-destructive";
};

const customTooltipStyle = { backgroundColor: "hsl(222, 47%, 9%)", border: "1px solid hsl(220, 20%, 14%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)", fontSize: "12px" };

const Analytics = () => {
  const { t, lang } = useLanguage();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);

  const userExamType = profile?.exam_type || "A/L";
  const userStream = profile?.stream || "Science";

  useEffect(() => {
    const fetchAnalyticsContext = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("subjects")
          .select("name_en, slug, color")
          .eq("exam_type", userExamType)
          .contains("streams", [userStream]);
        
        setSubjects(data || []);
      } catch (err) {
        console.error("Error fetching analytics subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchAnalyticsContext();
    }
  }, [profile, userExamType, userStream]);

  const subjectAccuracy = subjects.map((s, i) => ({
    subject: s.name_en,
    accuracy: 60 + Math.floor(Math.random() * 30),
    fill: `hsl(${200 + i * 40}, 80%, 60%)`
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="mt-4 text-muted-foreground">Preparing your personalized performance report...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{t("analytics.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyzing performance for your {userExamType} {userStream} profile.
          </p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target, label: "Questions Answered", value: "0", color: "text-primary" },
            { icon: TrendingUp, label: "Overall Accuracy", value: "0%", color: "text-success" },
            { icon: Clock, label: "Study Time", value: "0h", color: "text-accent" },
            { icon: BookOpen, label: "Active Subjects", value: subjects.length, color: "text-secondary" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="font-mono font-bold text-2xl text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectAccuracy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="subject" type="category" width={100} tick={{ fill: "#A0AEC0", fontSize: 12 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                  {subjectAccuracy.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Daily Learning Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="day" tick={{ fill: "#A0AEC0", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip contentStyle={customTooltipStyle} />
                <Line type="monotone" dataKey="accuracy" stroke="#3182CE" strokeWidth={3} dot={{ fill: "#3182CE", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predicted Grades Section */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Predicted {userExamType} Grades</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((sub) => (
              <div key={sub.slug} className="p-4 rounded-lg bg-muted/30 text-center border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">{sub.name_en}</p>
                <p className={`font-display font-extrabold text-4xl text-primary opacity-50`}>N/A</p>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">Awaiting Data</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;