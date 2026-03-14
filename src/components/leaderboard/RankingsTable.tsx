import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Minus, TrendingUp, TrendingDown } from "lucide-react";
import type { LeaderboardEntry } from "@/hooks/use-leaderboard";

const ChangeIndicator = ({ change, amount }: { change: string; amount?: number }) => {
  if (change === "up") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex items-center gap-0.5"
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronUp className="w-4 h-4 text-success" />
        </motion.div>
        {(amount ?? 0) > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="text-[10px] font-bold text-success"
          >
            {amount}
          </motion.span>
        )}
      </motion.div>
    );
  }

  if (change === "down") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex items-center gap-0.5"
      >
        <motion.div
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-destructive" />
        </motion.div>
        {(amount ?? 0) > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="text-[10px] font-bold text-destructive"
          >
            {amount}
          </motion.span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center"
    >
      <Minus className="w-3.5 h-3.5 text-muted-foreground/50" />
    </motion.div>
  );
};

interface RankingsTableProps {
  rankings: LeaderboardEntry[];
  youLabel: string;
  t: (key: string) => string;
  isLoading?: boolean;
}

const RankingsTable = ({ rankings, youLabel, t, isLoading }: RankingsTableProps) => {
  if (isLoading) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-muted-foreground">{t("leaderboard.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[3rem_1fr_10rem_5rem_3.5rem] gap-2 px-4 py-3 border-b border-border/50 text-xs text-muted-foreground font-medium">
        <span>#</span>
        <span>{t("leaderboard.student")}</span>
        <span className="hidden md:block">{t("leaderboard.school")}</span>
        <span className="text-right">{t("leaderboard.score")}</span>
        <span className="hidden md:block" />
      </div>
      {rankings.map((user, i) => (
        <motion.div
          key={`${user.rank}-${user.name}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 * i }}
          className={`grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[3rem_1fr_10rem_5rem_3.5rem] gap-2 px-4 py-3 items-center text-sm border-b border-border/30 transition-colors ${
            user.isYou ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/50"
          }`}
        >
          <span className="font-mono font-bold text-muted-foreground">{user.rank}</span>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {user.name} {user.isYou && <span className="text-xs text-primary">({youLabel})</span>}
              </p>
              <p className="text-xs text-muted-foreground md:hidden truncate">{user.school}</p>
            </div>
          </div>
          <span className="hidden md:block text-xs text-muted-foreground truncate">{user.school}</span>
          <span className="font-mono font-semibold text-foreground text-right">{user.score.toLocaleString()}</span>
          <span className="hidden md:flex justify-center">
            <ChangeIndicator change={user.change} amount={user.changeAmount} />
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default RankingsTable;
