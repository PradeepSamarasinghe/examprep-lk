import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Eye, EyeOff, Loader2, ChevronRight, GraduationCap, Book } from "lucide-react";
import ParticleField from "../components/ParticleField";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [examType, setExamType] = useState<"O/L" | "A/L">("A/L");
  const [grade, setGrade] = useState("13");
  const [stream, setStream] = useState("Science");
  
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (examType === "O/L") {
      setGrade("11");
    } else {
      setGrade("13");
    }
  }, [examType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, { 
      display_name: fullName, 
      school,
      exam_type: examType,
      grade,
      stream: examType === "A/L" ? stream : "General"
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent you a confirmation link to verify your account." });
      navigate("/login");
    }
  };

  const grades = examType === "O/L" ? ["6", "7", "8", "9", "10", "11"] : ["12", "13"];
  const streams = ["Science", "Maths", "Commerce", "Arts", "Technology"];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0">
        <ParticleField />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="glass-strong rounded-2xl p-8 gradient-border">
          <div className="flex items-center gap-2 justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">ExamPrep LK</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-foreground text-center mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">Start your journey to exam success</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sanduni Herath"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">School (optional)</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Royal College"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Education Details
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Exam Category</label>
                  <div className="flex gap-2">
                    {["A/L", "O/L"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setExamType(t as any)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          examType === t 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {grades.map((g) => (
                      <option key={g} value={g}>{examType} - Grade {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {examType === "A/L" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <label className="text-sm text-muted-foreground mb-1.5 block flex items-center gap-2">
                      <Book className="w-4 h-4" /> Select Your Stream
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {streams.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStream(s)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            stream === s 
                              ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base text-center hover:bg-primary/90 transition-all active:scale-[0.98] glow-blue mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Get Started <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium transition-colors">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
