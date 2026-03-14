import { motion } from "framer-motion";

const subjects = [
  { name: "Combined Maths", icon: "📐", questions: "8,200+", levels: "Easy · Medium · Hard" },
  { name: "Physics", icon: "⚡", questions: "6,400+", levels: "Easy · Medium · Hard" },
  { name: "Chemistry", icon: "🧪", questions: "5,800+", levels: "Easy · Medium · Hard" },
  { name: "Biology", icon: "🧬", questions: "6,100+", levels: "Easy · Medium · Hard" },
  { name: "Economics", icon: "📊", questions: "4,200+", levels: "Easy · Medium · Hard" },
  { name: "Accounting", icon: "📋", questions: "3,800+", levels: "Easy · Medium · Hard" },
  { name: "Business Studies", icon: "💼", questions: "3,500+", levels: "Easy · Medium · Hard" },
  { name: "History", icon: "📜", questions: "2,900+", levels: "Easy · Medium · Hard" },
];

const SubjectsPreview = () => {
  return (
    <section id="subjects" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Subjects <span className="text-gradient-blue">Available</span>
          </h2>
          <p className="text-muted-foreground">Covering all major A/L and O/L streams</p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 w-56 rounded-xl glass p-6 hover:scale-[1.03] transition-transform cursor-pointer group"
            >
              <div className="text-3xl mb-3">{subject.icon}</div>
              <h3 className="font-display font-bold text-foreground mb-1">{subject.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{subject.questions} questions</p>
              <p className="text-xs text-primary">{subject.levels}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsPreview;
