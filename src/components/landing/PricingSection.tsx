import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "LKR 0",
    period: "forever",
    features: ["20 questions/day", "3 subjects", "Basic analytics", "Community support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Student Pro",
    price: "LKR 990",
    period: "/month",
    features: ["Unlimited questions", "All subjects", "Past papers 2015–2024", "AI explanations", "Challenge mode", "Advanced analytics"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Family",
    price: "LKR 2,200",
    period: "/month",
    features: ["Up to 4 students", "Parent dashboard", "All Pro features", "Progress reports", "Family billing"],
    cta: "Start Free Trial",
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Simple <span className="text-gradient-primary">Pricing</span>
          </h2>
          <p className="text-muted-foreground">Start free, upgrade when you're ready</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-xl p-8 relative ${
                plan.highlight
                  ? "glass gradient-border glow-blue"
                  : "glass"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="font-display font-extrabold text-3xl text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
