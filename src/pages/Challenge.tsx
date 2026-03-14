import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Zap, Clock, Trophy, Shield, Target, ArrowRight, RotateCcw, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
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
  const { profile } = useAuth();
  
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [phase, setPhase] = useState<Phase>("matchmaking");
  const [searchProgress, setSearchProgress] = useState(0);
  const [opponent, setOpponent] = useState(opponents[0]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timer, setTimer] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const userInitials = profile?.display_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || "ST";

  const [player, setPlayer] = useState<Player>({
    name: profile?.display_name || "Student",
    avatar: userInitials,
    school: profile?.school || "ExamPrep Student",
    rating: 1200,
    score: 0,
    answers: [],
  });
  
  const [opponentData, setOpponentData] = useState<Player>({
    ...opponents[0], score: 0, answers: [],
  });

  useEffect(() => {
    if (profile) {
      setPlayer(prev => ({
        ...prev,
        name: profile.display_name,
        avatar: userInitials,
        school: profile.school || "ExamPrep Student",
        answers: Array(QUESTIONS_PER_BATTLE).fill("pending")
      }));
      setQuestions(getRandomQuestions(lang, QUESTIONS_PER_BATTLE));
    }
  }, [profile, lang, userInitials]);

  // Matchmaking
  useEffect(() => {
    if (phase !== "matchmaking" || questions.length === 0) return;
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
  }, [phase, questions]);

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
  }, [showAnswer, currentQ, questions]);

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

  if (!profile || questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="mt-4 text-muted-foreground">Initializing battle arena...</p>
        </div>
      </DashboardLayout>
    );
  }

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
      <div className="text-3xl font-display font-bold text-primary animate-pulse">VS</div>
      <AnimatePresence mode="wait">
        {found ? (
          <motion.div key="found" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <PlayerCard name={opponent.name} avatar={opponent.avatar} school={opponent.school} rating={opponent.rating} />
          </motion.div>
        ) : (
          <div className="w-28 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted border-2 border-dashed border-border animate-pulse flex items-center justify-center">?</div>
            <p className="text-xs text-muted-foreground mt-2">Searching...</p>
          </div>
        )}
      </AnimatePresence>
    </div>

    <div className="max-w-sm mx-auto">
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </div>
  </motion.div>
);

const PlayerCard = ({ name, avatar, school, rating }: { name: string; avatar: string; school: string; rating: number }) => (
  <div className="text-center w-28">
    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-primary-foreground text-lg">{avatar}</div>
    <p className="text-sm font-semibold text-foreground mt-2 truncate">{name}</p>
    <p className="text-[10px] text-muted-foreground truncate">{school}</p>
    <div className="flex items-center justify-center gap-1 mt-1">
      <Shield className="w-3 h-3 text-warning" />
      <span className="text-xs font-mono text-warning">{rating}</span>
    </div>
  </div>
);

const BattleScreen = ({ question, questionNum, total, timer, selected, showAnswer, player, opponent, onAnswer, t }: any) => (
  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-4">
    <div className="flex items-center justify-between glass rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">{player.avatar}</div>
        <div>
          <p className="text-sm font-semibold text-foreground">{player.name}</p>
          <div className="flex gap-1 mt-1">{player.answers.map((a: any, i: any) => <AnswerDot key={i} status={a} />)}</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-mono font-bold">{timer}</div>
        <p className="text-[10px] text-muted-foreground">{questionNum + 1}/{total}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{opponent.name}</p>
          <div className="flex gap-1 mt-1 justify-end">{opponent.answers.map((a: any, i: any) => <AnswerDot key={i} status={a} />)}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-white">{opponent.avatar}</div>
      </div>
    </div>
    <div className="glass rounded-xl p-6">
      <p className="text-foreground font-medium mb-6">{question.q}</p>
      <div className="grid gap-3">
        {question.options.map((opt: string, i: number) => {
          let style = "bg-muted/50 border-border/50";
          if (showAnswer) {
            if (i === question.correct) style = "bg-success/20 border-success text-success";
            else if (i === selected) style = "bg-destructive/20 border-destructive text-destructive";
            else style = "opacity-50";
          } else if (i === selected) style = "border-primary";
          return (
            <button key={i} onClick={() => onAnswer(i)} disabled={showAnswer} className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  </motion.div>
);

const AnswerDot = ({ status }: { status: "correct" | "wrong" | "pending" }) => (
  <div className={`w-2.5 h-2.5 rounded-full ${status === "correct" ? "bg-success" : status === "wrong" ? "bg-destructive" : "bg-muted-foreground/30"}`} />
);

const ResultsScreen = ({ player, opponent, onRestart, t }: any) => (
  <div className="py-8 text-center space-y-6">
    <Trophy className="w-16 h-16 text-warning mx-auto" />
    <h1 className="font-display font-bold text-3xl text-foreground">{player.score > opponent.score ? "Victory!" : "Good Try!"}</h1>
    <div className="glass rounded-xl p-8 max-w-sm mx-auto flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">{player.name}</p>
        <p className="text-3xl font-bold">{player.score}</p>
      </div>
      <div className="text-xl text-muted-foreground">VS</div>
      <div>
        <p className="text-sm text-muted-foreground">{opponent.name}</p>
        <p className="text-3xl font-bold">{opponent.score}</p>
      </div>
    </div>
    <div className="flex gap-3 justify-center">
      <button onClick={onRestart} className="px-6 py-3 rounded-lg bg-primary text-white font-bold">Play Again</button>
      <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-muted text-foreground font-bold">Dashboard</Link>
    </div>
  </div>
);

export default Challenge;
