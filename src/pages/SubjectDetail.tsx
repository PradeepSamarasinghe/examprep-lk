import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Play, FileText, BookOpen, StickyNote, BarChart3, Clock, Target } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";

const subjectsData: Record<string, {
  nameKey: string; icon: string; stream: string; totalQuestions: number;
  accuracy: number; accuracyHistory: number[];
  chapters: { name: string; nameSi: string; nameTa: string; subtopics: string[]; accuracy: number; questionCount: number }[];
  pastPapers: { year: number; papers: { type: string; language: string }[] }[];
  notes: { title: string; content: string }[];
}> = {
  "combined-maths": {
    nameKey: "subject.combinedMaths", icon: "📐", stream: "Science", totalQuestions: 8200, accuracy: 64,
    accuracyHistory: [55, 58, 60, 59, 63, 61, 64],
    chapters: [
      { name: "Algebra", nameSi: "බීජ ගණිතය", nameTa: "இயற்கணிதம்", subtopics: ["Quadratic Equations", "Polynomials", "Partial Fractions", "Binomial Theorem"], accuracy: 85, questionCount: 620 },
      { name: "Trigonometry", nameSi: "ත්‍රිකෝණමිතිය", nameTa: "முக்கோணவியல்", subtopics: ["Identities", "Equations", "Inverse Functions", "Properties of Triangles"], accuracy: 63, questionCount: 540 },
      { name: "Differentiation", nameSi: "අවකලනය", nameTa: "வகையீடு", subtopics: ["First Principles", "Chain Rule", "Product & Quotient Rule", "Applications"], accuracy: 71, questionCount: 780 },
      { name: "Integration", nameSi: "සමාකලනය", nameTa: "தொகையீடு", subtopics: ["Indefinite Integrals", "Definite Integrals", "Integration by Parts", "Applications of Integration"], accuracy: 42, questionCount: 820 },
      { name: "Coordinate Geometry", nameSi: "ඛණ්ඩාංක ජ්‍යාමිතිය", nameTa: "ஆய முடுக்கு வடிவியல்", subtopics: ["Straight Lines", "Circles", "Conics", "Locus"], accuracy: 68, questionCount: 490 },
      { name: "Vectors", nameSi: "දෛශික", nameTa: "வெக்டர்கள்", subtopics: ["2D Vectors", "3D Vectors", "Scalar Product", "Vector Product"], accuracy: 72, questionCount: 380 },
      { name: "Statistics", nameSi: "සංඛ්‍යාන", nameTa: "புள்ளியியல்", subtopics: ["Probability", "Distributions", "Regression", "Hypothesis Testing"], accuracy: 58, questionCount: 560 },
      { name: "Complex Numbers", nameSi: "සංකීර්ණ සංඛ්‍යා", nameTa: "கலப்பெண்கள்", subtopics: ["Argand Diagram", "Modulus-Argument", "De Moivre's Theorem", "Roots of Unity"], accuracy: 51, questionCount: 320 },
    ],
    pastPapers: [
      { year: 2024, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
      { year: 2023, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
      { year: 2022, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 1 (MCQ)", language: "Sinhala" }, { type: "Paper 2 (Structured)", language: "English" }] },
      { year: 2021, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
      { year: 2020, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
    ],
    notes: [
      { title: "Key Formulas — Integration", content: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n∫sin(x) dx = -cos(x) + C\n∫cos(x) dx = sin(x) + C\n∫eˣ dx = eˣ + C\n∫1/x dx = ln|x| + C" },
      { title: "Common Mistakes — Differentiation", content: "• Forgetting the chain rule with composite functions\n• Not simplifying before differentiating\n• Confusing d/dx[sin(x)] with d/dx[cos(x)]\n• Missing negative signs in quotient rule" },
      { title: "Exam Tips — Trigonometry", content: "• Always check the domain of inverse trig functions\n• Use the unit circle for exact values\n• Double-angle formulas are frequently tested\n• Practice converting between forms" },
    ],
  },
  physics: {
    nameKey: "subject.physics", icon: "⚡", stream: "Science", totalQuestions: 6400, accuracy: 78,
    accuracyHistory: [70, 72, 74, 73, 76, 77, 78],
    chapters: [
      { name: "Mechanics", nameSi: "යාන්ත්‍ර විද්‍යාව", nameTa: "இயக்கவியல்", subtopics: ["Kinematics", "Newton's Laws", "Momentum", "Energy"], accuracy: 82, questionCount: 920 },
      { name: "Waves & Optics", nameSi: "තරංග හා ප්‍රකාශ විද්‍යාව", nameTa: "அலைகள் & ஒளியியல்", subtopics: ["Wave Properties", "Sound", "Light", "Interference"], accuracy: 72, questionCount: 680 },
      { name: "Electricity", nameSi: "විද්‍යුත්", nameTa: "மின்சாரம்", subtopics: ["Current", "Resistance", "Circuits", "Capacitance"], accuracy: 75, questionCount: 780 },
      { name: "Thermodynamics", nameSi: "උෂ්ණ ගතිකය", nameTa: "வெப்ப இயக்கவியல்", subtopics: ["Heat Transfer", "Gas Laws", "First Law", "Second Law"], accuracy: 68, questionCount: 520 },
      { name: "Nuclear Physics", nameSi: "න්‍යෂ්ටික භෞතික විද්‍යාව", nameTa: "அணுக்கரு இயற்பியல்", subtopics: ["Radioactivity", "Fission", "Fusion", "Half-life"], accuracy: 81, questionCount: 340 },
    ],
    pastPapers: [
      { year: 2024, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
      { year: 2023, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
      { year: 2022, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
    ],
    notes: [
      { title: "Key Formulas — Mechanics", content: "F = ma\nv = u + at\ns = ut + ½at²\nv² = u² + 2as\np = mv\nKE = ½mv²\nPE = mgh" },
      { title: "Common Mistakes — Electricity", content: "• Confusing series and parallel formulas\n• Forgetting to convert units\n• Wrong sign conventions in Kirchhoff's laws" },
    ],
  },
  chemistry: {
    nameKey: "subject.chemistry", icon: "🧪", stream: "Science", totalQuestions: 5800, accuracy: 69,
    accuracyHistory: [62, 64, 65, 67, 68, 70, 69],
    chapters: [
      { name: "Organic Chemistry", nameSi: "කාබනික රසායන විද්‍යාව", nameTa: "கரிம வேதியியல்", subtopics: ["Hydrocarbons", "Alcohols", "Aldehydes & Ketones", "Carboxylic Acids"], accuracy: 61, questionCount: 820 },
      { name: "Inorganic Chemistry", nameSi: "අකාබනික රසායන විද්‍යාව", nameTa: "கனிம வேதியியல்", subtopics: ["Periodic Table", "s-block", "p-block", "d-block"], accuracy: 74, questionCount: 680 },
      { name: "Physical Chemistry", nameSi: "භෞතික රසායන විද්‍යාව", nameTa: "பௌதிக வேதியியல்", subtopics: ["Thermochemistry", "Kinetics", "Equilibrium", "Electrochemistry"], accuracy: 58, questionCount: 740 },
      { name: "Analytical Chemistry", nameSi: "විශ්ලේෂණ රසායන විද්‍යාව", nameTa: "பகுப்பாய்வு வேதியியல்", subtopics: ["Qualitative Analysis", "Volumetric Analysis", "Spectroscopy"], accuracy: 72, questionCount: 380 },
    ],
    pastPapers: [
      { year: 2024, papers: [{ type: "Paper 1 (MCQ)", language: "English" }] },
      { year: 2023, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Structured)", language: "English" }] },
    ],
    notes: [
      { title: "Key Formulas — Physical Chemistry", content: "PV = nRT\nΔG = ΔH - TΔS\nRate = k[A]ⁿ[B]ᵐ\nE = E° - (RT/nF)lnQ" },
    ],
  },
  biology: {
    nameKey: "subject.biology", icon: "🧬", stream: "Science", totalQuestions: 6100, accuracy: 81,
    accuracyHistory: [74, 76, 78, 79, 80, 82, 81],
    chapters: [
      { name: "Cell Biology", nameSi: "සෛල විද්‍යාව", nameTa: "உயிரணு உயிரியல்", subtopics: ["Cell Structure", "Cell Division", "Transport", "Enzymes"], accuracy: 79, questionCount: 650 },
      { name: "Genetics", nameSi: "ජාන විද්‍යාව", nameTa: "மரபியல்", subtopics: ["Mendelian Genetics", "DNA & RNA", "Gene Expression", "Mutations"], accuracy: 88, questionCount: 720 },
      { name: "Ecology", nameSi: "පාරිසරික විද්‍යාව", nameTa: "சூழலியல்", subtopics: ["Ecosystems", "Food Chains", "Biodiversity", "Conservation"], accuracy: 82, questionCount: 480 },
      { name: "Botany", nameSi: "උද්භිද විද්‍යාව", nameTa: "தாவரவியல்", subtopics: ["Plant Anatomy", "Photosynthesis", "Transport in Plants", "Reproduction"], accuracy: 76, questionCount: 560 },
      { name: "Zoology", nameSi: "සත්ත්ව විද්‍යාව", nameTa: "விலங்கியல்", subtopics: ["Animal Physiology", "Nervous System", "Endocrine System", "Reproduction"], accuracy: 83, questionCount: 620 },
    ],
    pastPapers: [
      { year: 2024, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Essay)", language: "English" }] },
      { year: 2023, papers: [{ type: "Paper 1 (MCQ)", language: "English" }, { type: "Paper 2 (Essay)", language: "English" }] },
    ],
    notes: [
      { title: "Key Concepts — Genetics", content: "• DNA replication is semi-conservative\n• Transcription: DNA → mRNA\n• Translation: mRNA → Protein\n• Codons are triplets of nucleotides" },
    ],
  },
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

const dayKeys: Record<string, Record<number, string>> = {
  en: { 0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun" },
  si: { 0: "සඳු", 1: "අඟ", 2: "බදා", 3: "බ්‍රහ", 4: "සිකු", 5: "සෙන", 6: "ඉරි" },
  ta: { 0: "திங்", 1: "செவ்", 2: "புத", 3: "வியா", 4: "வெள்", 5: "சனி", 6: "ஞாயி" },
};

const SubjectDetail = () => {
  const { subject: subjectSlug } = useParams<{ subject: string }>();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set());
  const [practiceConfig, setPracticeConfig] = useState({
    chapters: "all", difficulty: "mixed", type: "mcq", count: 25, timed: true,
  });

  const data = subjectsData[subjectSlug || "combined-maths"] || subjectsData["combined-maths"];

  const tabs = [
    { id: "overview", label: t("subjectDetail.overview"), icon: BarChart3 },
    { id: "chapters", label: t("subjectDetail.chapters"), icon: BookOpen },
    { id: "practice", label: t("subjectDetail.practice"), icon: Target },
    { id: "past-papers", label: t("subjectDetail.pastPapers"), icon: FileText },
    { id: "notes", label: t("subjectDetail.notes"), icon: StickyNote },
  ];

  const getChapterName = (ch: { name: string; nameSi: string; nameTa: string }) => {
    if (lang === "si") return ch.nameSi;
    if (lang === "ta") return ch.nameTa;
    return ch.name;
  };

  const getLocalName = (ch: { name: string; nameSi: string; nameTa: string }) => {
    if (lang === "en") return ch.nameSi;
    if (lang === "si") return ch.name;
    return ch.name;
  };

  const toggleChapter = (i: number) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const difficultyLabels: Record<string, string> = {
    easy: t("common.easy"),
    medium: t("common.medium"),
    hard: t("common.hard"),
    mixed: t("subjectDetail.mixed"),
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <span className="text-4xl">{data.icon}</span>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{t(data.nameKey)}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{data.stream} {t("subjectDetail.stream")}</span>
              <span className="text-xs text-muted-foreground">{data.totalQuestions.toLocaleString()} {t("subjectDetail.questions")}</span>
              <span className={`text-xs font-mono font-semibold ${masteryText(data.accuracy)}`}>{data.accuracy}% {t("subjectDetail.accuracy")}</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-border/50 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">{t("subjectDetail.topicMasteryMap")}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {data.chapters.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => { setActiveTab("chapters"); setOpenChapters(new Set([i])); }}
                        className="group relative p-4 rounded-xl border border-border/50 hover:scale-[1.03] transition-all text-left"
                        style={{ background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)` }}
                      >
                        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${masteryColor(ch.accuracy)}`} />
                        <p className="text-sm font-semibold text-foreground mb-1">{getChapterName(ch)}</p>
                        <p className="text-[10px] text-muted-foreground mb-2">{getLocalName(ch)}</p>
                        <div className="h-1.5 rounded-full bg-muted">
                          <div className={`h-1.5 rounded-full ${masteryColor(ch.accuracy)} transition-all`} style={{ width: `${ch.accuracy}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{ch.accuracy}% · {ch.questionCount} {t("subjectDetail.qs")}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive" /> &lt;40%</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> 40–70%</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success" /> &gt;70%</span>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">{t("subjectDetail.accuracyLast7")}</h3>
                  <div className="flex items-end gap-2 h-32">
                    {data.accuracyHistory.map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-muted-foreground">{v}%</span>
                        <div className="w-full rounded-t-md bg-primary/80 transition-all" style={{ height: `${(v / 100) * 100}%` }} />
                        <span className="text-[10px] text-muted-foreground">{(dayKeys[lang] || dayKeys.en)[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chapters */}
            {activeTab === "chapters" && (
              <div className="space-y-2">
                {data.chapters.map((ch, i) => {
                  const isOpen = openChapters.has(i);
                  return (
                    <div key={i} className="glass rounded-xl overflow-hidden">
                      <button onClick={() => toggleChapter(i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors">
                        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{getChapterName(ch)}</p>
                            <p className="text-xs text-muted-foreground">({getLocalName(ch)})</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{ch.subtopics.length} {t("subjectDetail.subTopics")} · {ch.questionCount} {t("subjectDetail.questions")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-2 rounded-full bg-muted">
                            <div className={`h-2 rounded-full ${masteryColor(ch.accuracy)}`} style={{ width: `${ch.accuracy}%` }} />
                          </div>
                          <span className={`text-xs font-mono font-semibold w-10 text-right ${masteryText(ch.accuracy)}`}>{ch.accuracy}%</span>
                          <Link
                            to="/practice"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            {t("subjectDetail.practice")}
                          </Link>
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="px-12 pb-4 space-y-2">
                              {ch.subtopics.map((st, j) => (
                                <div key={j} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                  {st}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Practice Config */}
            {activeTab === "practice" && (
              <div className="glass rounded-xl p-6 max-w-lg space-y-5">
                <h3 className="font-display font-bold text-foreground">{t("subjectDetail.configurePractice")}</h3>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">{t("subjectDetail.chapter")}</label>
                  <select value={practiceConfig.chapters} onChange={(e) => setPracticeConfig({ ...practiceConfig, chapters: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">{t("subjectDetail.allChapters")}</option>
                    {data.chapters.map((ch, i) => <option key={i} value={ch.name}>{getChapterName(ch)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">{t("subjectDetail.difficulty")}</label>
                  <div className="flex gap-2">
                    {["easy", "medium", "hard", "mixed"].map((d) => (
                      <button key={d} onClick={() => setPracticeConfig({ ...practiceConfig, difficulty: d })} className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${practiceConfig.difficulty === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{difficultyLabels[d]}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">{t("subjectDetail.questionType")}</label>
                  <div className="flex gap-2">
                    {[{ v: "mcq", l: t("common.mcq") }, { v: "structured", l: t("common.structured") }, { v: "mixed", l: t("subjectDetail.mixed") }].map((tp) => (
                      <button key={tp.v} onClick={() => setPracticeConfig({ ...practiceConfig, type: tp.v })} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${practiceConfig.type === tp.v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{tp.l}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">{t("subjectDetail.questionsCount")}: {practiceConfig.count}</label>
                  <input type="range" min={10} max={100} step={5} value={practiceConfig.count} onChange={(e) => setPracticeConfig({ ...practiceConfig, count: +e.target.value })} className="w-full accent-primary" />
                  <div className="flex justify-between text-[10px] text-muted-foreground"><span>10</span><span>50</span><span>100</span></div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">{t("subjectDetail.timedMode")}</label>
                  <button onClick={() => setPracticeConfig({ ...practiceConfig, timed: !practiceConfig.timed })} className={`w-11 h-6 rounded-full transition-colors flex items-center ${practiceConfig.timed ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${practiceConfig.timed ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <Link to="/practice" className="block w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm text-center hover:bg-primary/90 transition-colors glow-blue">
                  <Play className="w-4 h-4 inline mr-2" />
                  {t("subjectDetail.beginPractice")} — {practiceConfig.count} {t("subjectDetail.questionsCount")}
                </Link>
              </div>
            )}

            {/* Past Papers */}
            {activeTab === "past-papers" && (
              <div className="space-y-4">
                {data.pastPapers.map((pp) => (
                  <div key={pp.year} className="glass rounded-xl p-5">
                    <h3 className="font-display font-bold text-foreground mb-3">{pp.year} {t("subjectDetail.examination")}</h3>
                    <div className="space-y-2">
                      {pp.papers.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm text-foreground">{p.type}</p>
                              <p className="text-xs text-muted-foreground">{p.language}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> 3h</span>
                            <Link to="/practice" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                              {t("subjectDetail.startExam")}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                {data.notes.map((note, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
                    <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-warning" />
                      {note.title}
                    </h3>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{note.content}</pre>
                  </motion.div>
                ))}
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-muted-foreground text-sm">💡 {t("subjectDetail.aiNotesSoon")}</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default SubjectDetail;