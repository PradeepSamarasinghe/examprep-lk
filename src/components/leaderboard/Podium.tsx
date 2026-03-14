import { motion } from "framer-motion";
import { Crown, ChevronUp, ChevronDown } from "lucide-react";
import type { LeaderboardEntry } from "@/hooks/use-leaderboard";

const podiumConfig = [
  { index: 1, height: "h-28", delay: 0.3, gradient: "from-muted to-muted/50" },
  { index: 0, height: "h-36", delay: 0.1, gradient: "from-warning/20 to-warning/5" },
  { index: 2, height: "h-24", delay: 0.5, gradient: "from-muted to-muted/50" },
];

const PodiumChangeIndicator = ({ change, amount }: { change: string; amount?: number }) => {
  if (change === "up") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
        className="flex items-center gap-0.5 mt-1"
      >
        <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronUp className="w-3.5 h-3.5 text-success" />
        </motion.div>
        {(amount ?? 0) > 0 && (
          <span className="text-[10px] font-bold text-success">{amount}</span>
        )}
      </motion.div>
    );
  }
  if (change === "down") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
        className="flex items-center gap-0.5 mt-1"
      >
        <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-3.5 h-3.5 text-destructive" />
        </motion.div>
        {(amount ?? 0) > 0 && (
          <span className="text-[10px] font-bold text-destructive">{amount}</span>
        )}
      </motion.div>
    );
  }
  return null;
};

interface PodiumProps {
  users: LeaderboardEntry[];
}

const Podium = ({ users }: PodiumProps) => {
  if (users.length < 3) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-xl p-6 pb-2"
    >
      <div className="flex items-end justify-center gap-3 md:gap-6 pt-4">
        {podiumConfig.map(({ index, height, delay, gradient }) => {
          const user = users[index];
          if (!user) return null;
          return (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                {user.rank === 1 && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                  >
                    <Crown className="w-6 h-6 text-warning" />
                  </motion.div>
                )}
                <div
                  className={`${
                    user.rank === 1 ? "w-16 h-16 md:w-20 md:h-20" : "w-12 h-12 md:w-16 md:h-16"
                  } rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm md:text-base font-bold text-primary-foreground ring-2 ${
                    user.rank === 1 ? "ring-warning" : "ring-border/50"
                  }`}
                >
                  {user.avatar}
                </div>
              </div>
              <p className="text-xs md:text-sm font-semibold text-foreground text-center truncate max-w-[100px]">
                {user.name}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground text-center truncate max-w-[100px]">
                {user.school}
              </p>
              <p className="text-xs font-mono font-bold text-primary mt-1">
                {user.score.toLocaleString()}
              </p>
              <PodiumChangeIndicator change={user.change} amount={user.changeAmount} />
              <div
                className={`${height} w-20 md:w-28 mt-2 rounded-t-lg bg-gradient-to-t ${gradient} border border-border/50 border-b-0 flex items-center justify-center`}
              >
                <span className="font-display font-bold text-2xl md:text-3xl text-muted-foreground/50">
                  #{user.rank}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Podium;
