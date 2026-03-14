import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { useLeaderboardData, mockPodiumUsers, generateMockRankings } from "@/hooks/use-leaderboard";
import Podium from "@/components/leaderboard/Podium";
import RankingsTable from "@/components/leaderboard/RankingsTable";
import SubjectFilters from "@/components/leaderboard/SubjectFilters";

const Leaderboard = () => {
  const [activeSubject, setActiveSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const { data: dbRankings, isLoading } = useLeaderboardData(activeSubject);

  // Use real data if available, otherwise fall back to mock data
  const hasRealData = (dbRankings?.length ?? 0) > 0;
  const podiumUsers = hasRealData ? dbRankings!.slice(0, 3) : mockPodiumUsers;
  const allRankings = hasRealData ? dbRankings!.slice(3) : generateMockRankings();

  const filteredRankings = searchQuery
    ? allRankings.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.school.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRankings;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-3">
            <Trophy className="w-7 h-7 text-warning" /> {t("leaderboard.nationalTitle")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("leaderboard.compete")}</p>
        </motion.div>

        <Podium users={podiumUsers} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="national" className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
              <TabsList className="bg-muted">
                <TabsTrigger value="national">🇱🇰 {t("leaderboard.national")}</TabsTrigger>
                <TabsTrigger value="school">🏫 {t("leaderboard.school")}</TabsTrigger>
                <TabsTrigger value="friends">👥 {t("leaderboard.friends")}</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("leaderboard.searchStudents")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <SubjectFilters activeSubject={activeSubject} setActiveSubject={setActiveSubject} t={t} />

            <TabsContent value="national">
              <RankingsTable rankings={filteredRankings} youLabel={t("leaderboard.you")} t={t} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="school">
              <RankingsTable
                rankings={filteredRankings.map((r) => ({ ...r, school: "Musaeus College" }))}
                youLabel={t("leaderboard.you")}
                t={t}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="friends">
              <RankingsTable
                rankings={filteredRankings.slice(0, 5)}
                youLabel={t("leaderboard.you")}
                t={t}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
