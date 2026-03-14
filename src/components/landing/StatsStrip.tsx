import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 18000, suffix: "+", label: "Active Students" },
  { value: 45000, suffix: "+", label: "Practice Questions" },
  { value: 94, suffix: "", label: "Subject Modules" },
  { value: 2300000, suffix: "", label: "Questions Answered", display: "2.3M" },
];

const AnimatedCounter = ({ target, suffix, display }: { target: number; suffix: string; display?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (display) { setCount(target); return; }
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, display]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-extrabold text-3xl md:text-4xl text-foreground">
        {display && started ? display : display ? "0" : count.toLocaleString()}{suffix}
      </div>
    </div>
  );
};

const StatsStrip = () => {
  return (
    <section className="relative py-16 border-y border-border/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} display={stat.display} />
              <p className="text-sm text-muted-foreground text-center mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
