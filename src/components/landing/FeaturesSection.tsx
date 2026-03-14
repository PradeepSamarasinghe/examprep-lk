import { motion } from "framer-motion";
import { Brain, FileText, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Question Generator",
    description: "Infinite practice tailored to your weak areas. Our AI creates questions that target exactly where you need improvement.",
    color: "primary" as const,
  },
  {
    icon: FileText,
    title: "Past Paper Bank",
    description: "Every A/L past paper from 2015 to 2024, fully digitized with model answers and detailed marking schemes.",
    color: "secondary" as const,
  },
  {
    icon: BarChart3,
    title: "Weakness Radar",
    description: "See exactly which topics need more work with AI-powered analytics that track your progress in real-time.",
    color: "accent" as const,
  },
];

const colorMap = {
  primary: "from-primary/20 to-primary/5 border-primary/20",
  secondary: "from-secondary/20 to-secondary/5 border-secondary/20",
  accent: "from-accent/20 to-accent/5 border-accent/20",
};

const iconBgMap = {
  primary: "bg-primary/20 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  accent: "bg-accent/20 text-accent",
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Everything You Need to <span className="text-gradient-primary">Excel</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powered by artificial intelligence, designed for Sri Lankan students
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-xl border bg-gradient-to-b p-8 hover:scale-[1.02] transition-transform ${colorMap[feature.color]}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconBgMap[feature.color]}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
