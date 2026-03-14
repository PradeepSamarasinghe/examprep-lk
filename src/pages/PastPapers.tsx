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
import { useAuth } from "@/hooks/use-auth";

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
  examType: "O/L" | "A/L";
}

const papers: Paper[] = [
  // A/L Papers
  { id: "1", examType: "A/L", subjectKey: "subject.combinedMaths", year: 2023, type: "MCQ", medium: "English", difficulty: "Hard", duration: "3h", questions: 50, attempted: true, score: 72, starred: true },
  { id: "3", examType: "A/L", subjectKey: "subject.physics", year: 2023, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: true, score: 84, starred: true },
  { id: "5", examType: "A/L", subjectKey: "subject.chemistry", year: 2023, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 50, attempted: true, score: 69, starred: false },
  { id: "7", examType: "A/L", subjectKey: "subject.biology", year: 2023, type: "MCQ", medium: "English", difficulty: "Easy", duration: "2h", questions: 50, attempted: false, starred: false },
  // O/L Papers
  { id: "100", examType: "O/L", subjectKey: "subject.maths", year: 2023, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 40, attempted: false, starred: false },
  { id: "101", examType: "O/L", subjectKey: "subject.science", year: 2023, type: "MCQ", medium: "English", difficulty: "Medium", duration: "2h", questions: 40, attempted: true, score: 92, starred: true },
  { id: "102", examType: "O/L", subjectKey: "subject.history", year: 2023, type: "MCQ", medium: "English", difficulty: "Easy", duration: "1h 30m", questions: 30, attempted: false, starred: false },
];

const subjectIcons: Record<string, string> = {
  "subject.combinedMaths": "📐",
  "subject.physics": "⚡",
  "subject.chemistry": "🧪",
  "subject.biology": "🧬",
  "subject.maths": "➕",
  "subject.science": "🔬",
  "subject.history": "📜",
};

const PastPapers = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const userExamType = profile?.exam_type || "A/L";

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
      // Filter by user profile first
      if (p.examType !== userExamType) return false;

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
  }, [search, activeSubject, activeYear, activeType, showStarredOnly, t, userExamType]);

  const subjectKeys = useMemo(() => {
    const keys = new Set(papers.filter(p => p.examType === userExamType).map(p => p.subjectKey));
    return Array.from(keys);
  }, [userExamType]);

  const years = useMemo(() => {
    const yrs = new Set(papers.filter(p => p.examType === userExamType).map(p => String(p.year)));
    return ["All", ...Array.from(yrs)];
  }, [userExamType]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" /> {t("pastPapers.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Displaying {userExamType} papers tailored to your profile.
          </p>
        </motion.div>

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
        </div>

        <Tabs defaultValue="subject" className="w-full">
          <TabsList className="bg-muted/50 rounded-lg p-1">
            <TabsTrigger value="subject" className="text-xs">By Subject</TabsTrigger>
            <TabsTrigger value="year" className="text-xs">By Year</TabsTrigger>
          </TabsList>
          <TabsContent value="subject">
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => setActiveSubject("All")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeSubject === "All" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>All</button>
              {subjectKeys.map(key => (
                <button key={key} onClick={() => setActiveSubject(key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeSubject === key ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  <span className="mr-1">{subjectIcons[key] || "📄"}</span>{t(key)}
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="year">
            <div className="flex flex-wrap gap-2 mt-2">
              {years.map(y => (
                <button key={y} onClick={() => setActiveYear(y)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeYear === y ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{y}</button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-3 mt-6">
          {filtered.length > 0 ? (
            filtered.map((paper) => (
              <div key={paper.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                <div className="text-2xl flex-shrink-0">{subjectIcons[paper.subjectKey] || "📄"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{t(paper.subjectKey)}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{paper.year}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{paper.type}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paper.duration}</span>
                    <span>{paper.questions} Qs</span>
                    <span>{paper.medium}</span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all">
                  {paper.attempted ? "Review" : "Start"}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 glass rounded-xl">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No papers found for your {userExamType} profile.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PastPapers;
