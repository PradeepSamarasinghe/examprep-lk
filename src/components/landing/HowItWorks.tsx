import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Choose Your Stream", desc: "Science / Arts / Commerce / Technology — pick your A/L or O/L stream" },
  { num: "02", title: "Take Diagnostic Test", desc: "AI maps your knowledge gaps with a quick assessment across your subjects" },
  { num: "03", title: "Study Smart", desc: "Get personalized daily practice sessions that adapt to your weaknesses" },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-6 glow-blue relative z-10">
                <span className="font-display font-bold text-primary text-lg">{step.num}</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
