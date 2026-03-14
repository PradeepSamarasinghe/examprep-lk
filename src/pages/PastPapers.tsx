import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, Search, Download, Eye, Clock, Filter,
  ChevronDown, Star, BookOpen
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";

interface Paper {
  id: string;
  subjectKey: string;
  year: number;
  type: "MCQ" | "Structured" | "Essay";
  medium: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  questions: number;
  attempted: boolean;
  score?: number;
  starred: boolean;
}

const papers: Paper[] = [
  { id: "1", subjectKey: "subject.combinedMaths", year: 2023, type: "MCQ", medium: "English", difficulty: "Hard", duration: "3h", questions: 50, attempted: true, score: 72, starred: true },
  { id: "2", subjectKey: "subject.combinedMaths", year: 2023, type: "Structured", medium: "English", difficulty: "Hard", duration: "3h", questions: 10, attempted: false, starred: false },
  { id: "3", subjectKey: "subject.physics", year: 2023, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: true, score: 84, starred: true },
  { id: "4", subjectKey: "subject.physics", year: 2023, type: "Structured", medium: "English", difficulty: "Hard", duration: "3h", questions: 8, attempted: false, starred: false },
  { id: "5", subjectKey: "subject.chemistry", year: 2023, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: true, score: 69, starred: false },
  { id: "6", subjectKey: "subject.chemistry", year: 2023, type: "Structured", medium: "English", difficulty: "Medium", duration: "3h", questions: 10, attempted: false, starred: false },
  { id: "7", subjectKey: "subject.biology", year: 2023, type: "MCQ", medium: "English", difficulty: "Easy", duration: "2h", questions: 50, attempted: false, starred: false },
  { id: "8", subjectKey: "subject.combinedMaths", year: 2022, type: "MCQ", medium: "English", difficulty: "Medium", duration: "3h", questions: 50, attempted: true, score: 64, starred: false },
  { id: "9", subjectKey: "subject.combinedMaths", year: 2022, type: "Structured", medium: "English", difficulty: "Hard", duration: "3h", questions: 10, attempted: true, score: 55, starred: false },
  { id: "10", subjectKey: "subject.physics", year: 2022, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: true, score: 78, starred: true },
  { id: "11", subjectKey: "subject.physics", year: 2022, type: "Structured", medium: "Sinhala", difficulty: "Hard", duration: "3h", questions: 8, attempted: false, starred: false },
  { id: "12", subjectKey: "subject.chemistry", year: 2022, type: "MCQ", medium: "English", difficulty: "Easy", duration: "2h", questions: 50, attempted: false, starred: false },
  { id: "13", subjectKey: "subject.combinedMaths", year: 2021, type: "MCQ", medium: "English", difficulty: "Medium", duration: "3h", questions: 50, attempted: true, score: 58, starred: false },
  { id: "14", subjectKey: "subject.physics", year: 2021, type: "MCQ", medium: "English", difficulty: "Easy", duration: "2h", questions: 50, attempted: false, starred: false },
  { id: "15", subjectKey: "subject.chemistry", year: 2021, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: true, score: 74, starred: true },
  { id: "16", subjectKey: "subject.biology", year: 2021, type: "MCQ", medium: "Tamil", difficulty: "Easy", duration: "2h", questions: 50, attempted: false, starred: false },
  { id: "17", subjectKey: "subject.combinedMaths", year: 2020, type: "MCQ", medium: "English", difficulty: "Easy", duration: "3h", questions: 50, attempted: false, starred: false },
  { id: "18", subjectKey: "subject.physics", year: 2020, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: false, starred: false },
];

const subjectKeys = ["subject.combinedMaths", "subject.physics", "subject.chemistry", "subject.biology"];
const years = ["All", "2023", "2022", "2021", "2020"];
const types = ["All", "MCQ", "Structured", "Essay"];

const subjectIcons: Record<string, string> = {
  "subject.combinedMaths": "📐",
  "subject.physics": "⚡",
  "subject.chemistry": "🧪",
  "subject.biology": "🧬",
};

const PastPapers = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const difficultyColors: Record<string, string> = {
    Easy: "text-success bg-success/10 border-success/20",
    Medium: "text-warning bg-warning/10 border-warning/20",
    Hard: "text-destructive bg-destructive/10 border-destructive/20",
  };

  const difficultyLabels: Record<string, string> = {
    Easy: t("common.easy"),
    Medium: t("common.medium"),
    Hard: t("common.hard"),
  };

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const subjectName = t(p.subjectKey).toLowerCase();
      const matchesSearch =
        subjectName.includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase()) ||
        String(p.year).includes(search);
      const matchesSubject = activeSubject === "All" || p.subjectKey === activeSubject;
      const matchesYear = activeYear === "All" || p.year === Number(activeYear);
      const matchesType = activeType === "All" || p.type === activeType;
      const matchesStarred = !showStarredOnly || p.starred;
      return matchesSearch && matchesSubject && matchesYear && matchesType && matchesStarred;
    });
  }, [search, activeSubject, activeYear, activeType, showStarredOnly, t]);

  const groupedByYear = useMemo(() => {
    const groups: Record<number, Paper[]> = {};
    filtered.forEach((p) => {
      if (!groups[p.year]) groups[p.year] = [];
      groups[p.year].push(p);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, papers]) => ({ year: Number(year), papers }));
  }, [filtered]);

  const stats = useMemo(() => {
    const attempted = papers.filter((p) => p.attempted).length;
    const avgScore = papers.filter((p) => p.score).reduce((s, p) => s + (p.score || 0), 0) / (papers.filter((p) => p.score).length || 1);
    return { total: papers.length, attempted, avgScore: Math.round(avgScore) };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" /> {t("pastPapers.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("pastPapers.desc")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-4">
          {[
            { label: t("pastPapers.totalPapers"), value: stats.total, icon: FileText, color: "text-primary" },
            { label: t("pastPapers.attempted"), value: `${stats.attempted}/${stats.total}`, icon: BookOpen, color: "text-accent" },
            { label: t("pastPapers.avgScore"), value: `${stats.avgScore}%`, icon: Star, color: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <p className="font-mono font-bold text-xl text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("pastPapers.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
            <button
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={`px-4 rounded-lg border transition-colors flex items-center gap-2 text-sm font-semibold ${
                showStarredOnly
                  ? "bg-warning/10 border-warning/30 text-warning"
                  : "bg-muted/50 border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className={`w-4 h-4 ${showStarredOnly ? "fill-warning" : ""}`} />
              {t("pastPapers.starred")}
            </button>
          </div>

          <Tabs defaultValue="subject" className="w-full">
            <TabsList className="bg-muted/50 rounded-lg p-1 w-auto inline-flex">
              <TabsTrigger value="subject" className="text-xs"><Filter className="w-3 h-3 mr-1" /> {t("pastPapers.subject")}</TabsTrigger>
              <TabsTrigger value="year" className="text-xs"><Clock className="w-3 h-3 mr-1" /> {t("pastPapers.year")}</TabsTrigger>
              <TabsTrigger value="type" className="text-xs"><ChevronDown className="w-3 h-3 mr-1" /> {t("pastPapers.type")}</TabsTrigger>
            </TabsList>
            <TabsContent value="subject" className="mt-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveSubject("All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeSubject === "All"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t("common.all")}
                </button>
                {subjectKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveSubject(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeSubject === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="mr-1">{subjectIcons[key]}</span>
                    {t(key)}
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="year" className="mt-3">
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setActiveYear(y)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeYear === y
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {y === "All" ? t("common.all") : y}
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="type" className="mt-3">
              <div className="flex flex-wrap gap-2">
                {types.map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setActiveType(tp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeType === tp
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tp === "All" ? t("common.all") : tp}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="space-y-8">
          {groupedByYear.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">{t("pastPapers.noResults")}</p>
            </div>
          )}

          {groupedByYear.map(({ year, papers: yearPapers }, gi) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + gi * 0.05 }}
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <span className="font-mono text-primary">{year}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {yearPapers.length} {t("pastPapers.papers")}
                </span>
              </h2>
              <div className="grid gap-3">
                {yearPapers.map((paper) => (
                  <div key={paper.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                    <div className="text-2xl flex-shrink-0">{subjectIcons[paper.subjectKey] || "📄"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{t(paper.subjectKey)}</p>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{paper.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColors[paper.difficulty]}`}>
                          {difficultyLabels[paper.difficulty]}
                        </span>
                        {paper.starred && <Star className="w-3.5 h-3.5 text-warning fill-warning" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paper.duration}</span>
                        <span>{paper.questions} {t("pastPapers.questions")}</span>
                        <span>{paper.medium}</span>
                        {paper.attempted && paper.score !== undefined && (
                          <span className={`font-mono font-semibold ${paper.score >= 70 ? "text-success" : paper.score >= 50 ? "text-warning" : "text-destructive"}`}>
                            Score: {paper.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {paper.attempted && (
                        <button className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> {t("pastPapers.review")}
                        </button>
                      )}
                      <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                        {paper.attempted ? <Eye className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        {paper.attempted ? t("pastPapers.retry") : t("pastPapers.start")}
                      </button>
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PastPapers;
