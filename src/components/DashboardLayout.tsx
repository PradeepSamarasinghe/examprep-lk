import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, Pencil, FileText, Swords, Trophy, BarChart3, Settings, Zap,
  Flame, Menu, X, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/dashboard" },
  { icon: BookOpen, labelKey: "nav.subjects", path: "/dashboard/subjects" },
  { icon: Pencil, labelKey: "nav.practice", path: "/practice" },
  { icon: FileText, labelKey: "nav.pastPapers", path: "/dashboard/past-papers" },
  { icon: Swords, labelKey: "nav.challenge", path: "/dashboard/challenge" },
  { icon: Trophy, labelKey: "nav.leaderboard", path: "/dashboard/leaderboard" },
  { icon: BarChart3, labelKey: "nav.analytics", path: "/dashboard/analytics" },
  { icon: Settings, labelKey: "nav.settings", path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { t, lang } = useLanguage();

  const langLabel = lang === "si" ? "සිංහල" : lang === "ta" ? "தமிழ்" : "English";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto flex flex-col border-r border-border/50 bg-surface transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-16"
        } overflow-hidden`}
      >
        <div className="flex items-center gap-2 p-4 h-16 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && <span className="font-display font-bold text-foreground whitespace-nowrap">ExamPrep LK</span>}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">SH</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">Sanduni Herath</p>
                <p className="text-xs text-muted-foreground">A/L Science · Year 2</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-xs font-mono font-semibold text-warning">23 {t("dashboard.dayStreak")}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  active
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                {sidebarOpen && <span className="whitespace-nowrap">{t(item.labelKey)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Exam countdown */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border/50">
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{t("dashboard.daysToExam")}</p>
              <p className="font-mono font-bold text-2xl text-warning">127</p>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border/50 flex items-center px-4 gap-4 bg-surface/50 backdrop-blur-sm sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
            {sidebarOpen ? <X className="w-5 h-5 lg:hidden" /> : <Menu className="w-5 h-5" />}
            <Menu className="w-5 h-5 hidden lg:block" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>🇱🇰</span>
            <span>{langLabel}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
