import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  school: string;
  score: number;
  avatar: string;
  change: "up" | "down" | "same";
  changeAmount?: number;
  isYou?: boolean;
  questionsAnswered?: number;
  correctAnswers?: number;
  userId?: string;
}

// Fetch real leaderboard data from Supabase
export function useLeaderboardData(subject: string) {
  return useQuery({
    queryKey: ["leaderboard", subject],
    queryFn: async () => {
      // Fetch rank history for change calculation
      const { data: rankHistoryData } = await supabase
        .from("rank_history")
        .select("user_id, rank, subject");

      const rankMap = new Map<string, number>();
      (rankHistoryData ?? []).forEach((rh: any) => {
        const key = `${rh.user_id}_${rh.subject}`;
        rankMap.set(key, rh.rank);
      });

      if (subject === "all") {
        const { data, error } = await supabase
          .from("leaderboard_total")
          .select("*")
          .order("rank", { ascending: true })
          .limit(50);
        if (error) throw error;
        return (data ?? []).map((row) => {
          const prevRank = rankMap.get(`${row.user_id}_all`);
          const currentRank = row.rank ?? 0;
          const change = getChange(prevRank, currentRank);
          return {
            rank: currentRank,
            name: row.display_name ?? "Unknown",
            school: row.school ?? "",
            score: row.total_score ?? 0,
            avatar: getInitials(row.display_name ?? "U"),
            change: change.direction,
            changeAmount: change.amount,
            userId: row.user_id ?? undefined,
            questionsAnswered: row.total_questions ?? 0,
            correctAnswers: row.total_correct ?? 0,
          } as LeaderboardEntry;
        });
      } else {
        const { data, error } = await supabase
          .from("leaderboard_ranked")
          .select("*")
          .eq("subject", subject)
          .order("rank", { ascending: true })
          .limit(50);
        if (error) throw error;
        return (data ?? []).map((row) => {
          const prevRank = rankMap.get(`${row.user_id}_${subject}`);
          const currentRank = row.rank ?? 0;
          const change = getChange(prevRank, currentRank);
          return {
            rank: currentRank,
            name: row.display_name ?? "Unknown",
            school: row.school ?? "",
            score: row.score ?? 0,
            avatar: getInitials(row.display_name ?? "U"),
            change: change.direction,
            changeAmount: change.amount,
            userId: row.user_id ?? undefined,
            questionsAnswered: row.questions_answered ?? 0,
            correctAnswers: row.correct_answers ?? 0,
          } as LeaderboardEntry;
        });
      }
    },
    staleTime: 30_000,
  });
}

function getChange(prevRank: number | undefined, currentRank: number): { direction: "up" | "down" | "same"; amount: number } {
  if (prevRank === undefined) return { direction: "same", amount: 0 };
  if (currentRank < prevRank) return { direction: "up", amount: prevRank - currentRank };
  if (currentRank > prevRank) return { direction: "down", amount: currentRank - prevRank };
  return { direction: "same", amount: 0 };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Mock data fallback when no real data exists
export const mockPodiumUsers: LeaderboardEntry[] = [
  { rank: 1, name: "Kavisha Perera", school: "Royal College", score: 9847, avatar: "KP", change: "up", changeAmount: 2 },
  { rank: 2, name: "Dineth Fernando", school: "Ananda College", score: 9632, avatar: "DF", change: "up", changeAmount: 1 },
  { rank: 3, name: "Nethmi Silva", school: "Visakha Vidyalaya", score: 9510, avatar: "NS", change: "down", changeAmount: 3 },
];

export const generateMockRankings = (offset = 0): LeaderboardEntry[] => [
  { rank: 4 + offset, name: "Ravindu Jayasekara", school: "S. Thomas' College", score: 9320 - offset * 40, avatar: "RJ", change: "up", changeAmount: 5 },
  { rank: 5 + offset, name: "Amaya Wickramasinghe", school: "Devi Balika Vidyalaya", score: 9180 - offset * 40, avatar: "AW", change: "same", changeAmount: 0 },
  { rank: 6 + offset, name: "Tharindu Bandara", school: "Dharmaraja College", score: 9045 - offset * 40, avatar: "TB", change: "down", changeAmount: 2 },
  { rank: 7 + offset, name: "Sanduni Herath", school: "Musaeus College", score: 8970 - offset * 40, avatar: "SH", change: "up", changeAmount: 3, isYou: true },
  { rank: 8 + offset, name: "Chamika de Silva", school: "Nalanda College", score: 8820 - offset * 40, avatar: "CS", change: "up", changeAmount: 1 },
  { rank: 9 + offset, name: "Hiruni Gamage", school: "Holy Family Convent", score: 8710 - offset * 40, avatar: "HG", change: "down", changeAmount: 4 },
  { rank: 10 + offset, name: "Pasindu Rajapaksa", school: "Richmond College", score: 8650 - offset * 40, avatar: "PR", change: "same", changeAmount: 0 },
  { rank: 11 + offset, name: "Dulmi Weerasinghe", school: "Ladies' College", score: 8590 - offset * 40, avatar: "DW", change: "up", changeAmount: 2 },
  { rank: 12 + offset, name: "Isuru Pathirana", school: "Trinity College", score: 8520 - offset * 40, avatar: "IP", change: "down", changeAmount: 1 },
];
