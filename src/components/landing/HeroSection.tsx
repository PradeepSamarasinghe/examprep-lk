import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import ParticleField from "../ParticleField";

const HeroScene3D = lazy(() => import("../3d/HeroScene3D"));

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <ParticleField />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-6"
            >
              🇱🇰 Built for Sri Lankan Students
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Ace Your A/Ls With{" "}
              <span className="text-gradient-primary">AI-Powered</span> Prep
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg"
            >
              Smart practice questions, past paper analysis, and real-time
              performance tracking — in Sinhala and English
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-blue"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground mb-6"
            >
              Join <span className="text-foreground font-semibold">18,000+</span> students preparing for 2026 A/Ls
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              {["A/L Syllabus Aligned", "Past Papers 2015–2024", "Sinhala & English"].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right side - 3D-like visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[480px] h-[480px]">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl animate-pulse-glow" />
                </div>
              }>
                <HeroScene3D />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
