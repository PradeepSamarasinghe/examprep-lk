import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Zap, Clock, Trophy, Shield, Target, ArrowRight, RotateCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";
import { getRandomQuestions, type BattleQuestion } from "@/data/battleQuestions";

type Phase = "matchmaking" | "battle" | "results";

interface Player {
  name: string;
  avatar: string;
  school: string;
  rating: number;
  score: number;
  answers: ("correct" | "wrong" | "pending")[];
}

const QUESTIONS_PER_BATTLE = 5;

const opponents = [
  { name: "Ravindu J.", avatar: "RJ", school: "S. Thomas' College", rating: 1820 },
  { name: "Kavisha P.", avatar: "KP", school: "Royal College", rating: 1950 },
  { name: "Nethmi S.", avatar: "NS", school: "Visakha Vidyalaya", rating: 1780 },
];

const Challenge = () => {
  const { t, lang } = useLanguage();
  const [questions, setQuestions] = useState<BattleQuestion[]>(() => getRandomQuestions(lang, QUESTIONS_PER_BATTLE));
  const [phase, setPhase] = useState<Phase>("matchmaking");
  const [searchProgress, setSearchProgress] = useState(0);
  const [opponent, setOpponent] = useState(opponents[0]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timer, setTimer] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [player, setPlayer] = useState<Player>({
    name: "Sanduni H.", avatar: "SH", school: "Musaeus College", rating: 1847,
    score: 0, answers: Array(questions.length).fill("pending"),
  });
  const [opponentData, setOpponentData] = useState<Player>({
    ...opponents[0], score: 0, answers: Array(questions.length).fill("pending"),
  });

  // Matchmaking
  useEffect(() => {
    if (phase !== "matchmaking") return;
    const interval = setInterval(() => {
      setSearchProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const opp = opponents[Math.floor(Math.random() * opponents.length)];
          setOpponent(opp);
          setOpponentData({ ...opp, score: 0, answers: Array(questions.length).fill("pending") });
          setTimeout(() => setPhase("battle"), 800);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [phase]);

  // Battle timer
  useEffect(() => {
    if (phase !== "battle" || showAnswer) return;
    if (timer <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timer, showAnswer]);

  const handleAnswer = useCallback((idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const isCorrect = idx === questions[currentQ].correct;
    const oppCorrect = Math.random() > 0.4;

    setPlayer((p) => {
      const answers = [...p.answers];
      answers[currentQ] = isCorrect ? "correct" : "wrong";
      return { ...p, score: p.score + (isCorrect ? 1 : 0), answers };
    });
    setOpponentData((o) => {
      const answers = [...o.answers];
      answers[currentQ] = oppCorrect ? "correct" : "wrong";
      return { ...o, score: o.score + (oppCorrect ? 1 : 0), answers };
    });

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setTimer(15);
        setSelected(null);
        setShowAnswer(false);
      } else {
        setPhase("results");
      }
    }, 1500);
  }, [showAnswer, currentQ]);

  const restart = () => {
    const newQuestions = getRandomQuestions(lang, QUESTIONS_PER_BATTLE);
    setQuestions(newQuestions);
    setPhase("matchmaking");
    setSearchProgress(0);
    setCurrentQ(0);
    setTimer(15);
    setSelected(null);
    setShowAnswer(false);
    setPlayer((p) => ({ ...p, score: 0, answers: Array(newQuestions.length).fill("pending") }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {phase === "matchmaking" && <MatchmakingScreen key="mm" progress={searchProgress} opponent={opponent} found={searchProgress >= 100} player={player} t={t} />}
          {phase === "battle" && (
            <BattleScreen
              key="battle"
              question={questions[currentQ]}
              questionNum={currentQ}
              total={questions.length}
              timer={timer}
              selected={selected}
              showAnswer={showAnswer}
              player={player}
              opponent={opponentData}
              onAnswer={handleAnswer}
              t={t}
            />
          )}
          {phase === "results" && <ResultsScreen key="results" player={player} opponent={opponentData} onRestart={restart} t={t} />}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

/* ─── Matchmaking ─── */
const MatchmakingScreen = ({ progress, opponent, found, player, t }: { progress: number; opponent: typeof opponents[0]; found: boolean; player: Player; t: (key: string) => string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} className="space-y-8 py-8">
    <div className="text-center">
      <motion.div animate={{ rotate: found ? 0 : 360 }} transition={{ repeat: found ? 0 : Infinity, duration: 2, ease: "linear" }}>
        <Swords className="w-12 h-12 text-primary mx-auto" />
      </motion.div>
      <h1 className="font-display font-bold text-2xl text-foreground mt-4">{t("challenge.title")}</h1>
      <p className="text-muted-foreground text-sm mt-1">{t("challenge.1v1")}</p>
    </div>

    <div className="flex items-center justify-center gap-6 md:gap-12">
      <PlayerCard name={player.name} avatar={player.avatar} school={player.school} rating={player.rating} />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-3xl font-display font-bold text-primary">
        VS
      </motion.div>
      <AnimatePresence mode="wait">
        {found ? (
          <motion.div key="found" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <PlayerCard name={opponent.name} avatar={opponent.avatar} school={opponent.school} rating={opponent.rating} />
          </motion.div>
        ) : (
          <motion.div key="searching" className="w-28 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted border-2 border-dashed border-border animate-pulse flex items-center justify-center">
              <span className="text-2xl">?</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t("challenge.searching")}...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="max-w-sm mx-auto">
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        {found ? t("challenge.opponentFound") : t("challenge.searching")}
      </p>
    </div>
  </motion.div>
);

const PlayerCard = ({ name, avatar, school, rating }: { name: string; avatar: string; school: string; rating: number }) => (
  <div className="text-center w-28">
    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-primary-foreground text-lg">
      {avatar}
    </div>
    <p className="text-sm font-semibold text-foreground mt-2 truncate">{name}</p>
    <p className="text-[10px] text-muted-foreground truncate">{school}</p>
    <div className="flex items-center justify-center gap-1 mt-1">
      <Shield className="w-3 h-3 text-warning" />
      <span className="text-xs font-mono text-warning">{rating}</span>
    </div>
  </div>
);

/* ─── Battle ─── */
const BattleScreen = ({
  question, questionNum, total, timer, selected, showAnswer, player, opponent, onAnswer, t,
}: {
  question: { q: string; options: string[]; correct: number }; questionNum: number; total: number; timer: number;
  selected: number | null; showAnswer: boolean; player: Player; opponent: Player;
  onAnswer: (idx: number) => void; t: (key: string) => string;
}) => (
  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6 py-4">
    {/* Scoreboard */}
    <div className="flex items-center justify-between glass rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">{player.avatar}</div>
        <div>
          <p className="text-sm font-semibold text-foreground">{player.name}</p>
          <div className="flex gap-1 mt-1">{player.answers.map((a, i) => <AnswerDot key={i} status={a} />)}</div>
        </div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-mono font-bold ${timer <= 5 ? "text-destructive" : "text-foreground"}`}>
          <motion.span key={timer} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>{timer}</motion.span>
        </div>
        <p className="text-[10px] text-muted-foreground">{questionNum + 1}/{total}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{opponent.name}</p>
          <div className="flex gap-1 mt-1 justify-end">{opponent.answers.map((a, i) => <AnswerDot key={i} status={a} />)}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">{opponent.avatar}</div>
      </div>
    </div>

    {/* Score */}
      <div className="flex justify-center gap-8 text-center">
      <div><span className="font-mono text-3xl font-bold text-primary">{player.score}</span><p className="text-xs text-muted-foreground">{t("challenge.you")}</p></div>
      <div className="text-2xl text-muted-foreground font-bold self-start">—</div>
      <div><span className="font-mono text-3xl font-bold text-secondary">{opponent.score}</span><p className="text-xs text-muted-foreground">{t("challenge.opponent")}</p></div>
    </div>

    {/* Question */}
    <motion.div key={questionNum} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
      <div className="flex items-start gap-3 mb-5">
        <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-foreground font-medium">{question.q}</p>
      </div>
      <div className="grid gap-3">
        {question.options.map((opt, i) => {
          let style = "bg-muted/50 border-border/50 hover:bg-muted hover:border-primary/30";
          if (showAnswer) {
            if (i === question.correct) style = "bg-success/15 border-success text-success";
            else if (i === selected && i !== question.correct) style = "bg-destructive/15 border-destructive text-destructive";
            else style = "bg-muted/30 border-border/30 opacity-50";
          } else if (i === selected) {
            style = "bg-primary/15 border-primary";
          }
          return (
            <motion.button
              key={i}
              whileHover={!showAnswer ? { scale: 1.01 } : {}}
              whileTap={!showAnswer ? { scale: 0.99 } : {}}
              onClick={() => onAnswer(i)}
              disabled={showAnswer}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${style}`}
            >
              <span className="font-mono text-xs text-muted-foreground mr-3">{String.fromCharCode(65 + i)}</span>
              {opt}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  </motion.div>
);

const AnswerDot = ({ status }: { status: "correct" | "wrong" | "pending" }) => (
  <div className={`w-2.5 h-2.5 rounded-full ${
    status === "correct" ? "bg-success" : status === "wrong" ? "bg-destructive" : "bg-muted-foreground/30"
  }`} />
);

/* ─── Results ─── */
const ResultsScreen = ({ player, opponent, onRestart, t }: { player: Player; opponent: Player; onRestart: () => void; t: (key: string) => string }) => {
  const won = player.score > opponent.score;
  const draw = player.score === opponent.score;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 space-y-6 text-center">
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {won ? (
          <>
            <Trophy className="w-16 h-16 text-warning mx-auto" />
            <h1 className="font-display font-bold text-3xl text-warning mt-3">{t("challenge.victory")}</h1>
          </>
        ) : draw ? (
          <>
            <Swords className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="font-display font-bold text-3xl text-muted-foreground mt-3">{t("challenge.draw")}</h1>
          </>
        ) : (
          <>
            <Shield className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="font-display font-bold text-3xl text-destructive mt-3">{t("challenge.defeat")}</h1>
          </>
        )}
        <p className="text-muted-foreground text-sm mt-1">
          {won ? t("challenge.outstanding") : draw ? t("challenge.evenlyMatched") : t("challenge.betterLuck")}
        </p>
      </motion.div>

      <div className="glass rounded-xl p-6 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <div>
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-primary-foreground">{player.avatar}</div>
            <p className="text-sm font-semibold text-foreground mt-2">{player.name}</p>
            <p className="font-mono text-3xl font-bold text-primary mt-1">{player.score}</p>
            <div className="flex gap-1 justify-center mt-2">{player.answers.map((a, i) => <AnswerDot key={i} status={a} />)}</div>
          </div>
          <div className="text-2xl text-muted-foreground font-bold">—</div>
          <div>
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center font-bold text-primary-foreground">{opponent.avatar}</div>
            <p className="text-sm font-semibold text-foreground mt-2">{opponent.name}</p>
            <p className="font-mono text-3xl font-bold text-secondary mt-1">{opponent.score}</p>
            <div className="flex gap-1 justify-center mt-2">{opponent.answers.map((a, i) => <AnswerDot key={i} status={a} />)}</div>
          </div>
        </div>

        {won && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-foreground"><Zap className="w-4 h-4 text-warning inline mr-1" />+25 {t("challenge.ratingPoints")} · +50 XP</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={onRestart} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
          <RotateCcw className="w-4 h-4" /> {t("challenge.playAgain")}
        </button>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors">
          <Home className="w-4 h-4" /> {t("challenge.backToDashboard")}
        </Link>
      </div>
    </motion.div>
  );
};

export default Challenge;
