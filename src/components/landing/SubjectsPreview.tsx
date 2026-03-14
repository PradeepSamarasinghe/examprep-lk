import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

const allSubjects = [
  // A/L Subjects
  { name: "Combined Maths", icon: "📐", questions: "8,200+", levels: "Easy · Medium · Hard", type: "A/L" },
  { name: "Physics", icon: "⚡", questions: "6,400+", levels: "Easy · Medium · Hard", type: "A/L" },
  { name: "Chemistry", icon: "🧪", questions: "5,800+", levels: "Easy · Medium · Hard", type: "A/L" },
  { name: "Biology", icon: "🧬", questions: "6,100+", levels: "Easy · Medium · Hard", type: "A/L" },
  { name: "Economics", icon: "📊", questions: "4,200+", levels: "Easy · Medium · Hard", type: "A/L" },
  { name: "Accounting", icon: "📋", questions: "3,800+", levels: "Easy · Medium · Hard", type: "A/L" },
  { name: "Business Studies", icon: "💼", questions: "3,500+", levels: "Easy · Medium · Hard", type: "A/L" },
  // O/L Subjects
  { name: "Mathematics", icon: "➕", questions: "9,500+", levels: "Easy · Medium · Hard", type: "O/L" },
  { name: "Science", icon: "🔬", questions: "8,800+", levels: "Easy · Medium · Hard", type: "O/L" },
  { name: "English", icon: "🔤", questions: "5,400+", levels: "Easy · Medium · Hard", type: "O/L" },
  { name: "History", icon: "📜", questions: "3,200+", levels: "Easy · Medium · Hard", type: "O/L" },
];

const SubjectsPreview = () => {
  const { user, profile } = useAuth();
  
  // Filter subjects based on user profile if logged in
  const displaySubjects = user && profile 
    ? allSubjects.filter(s => s.type === profile.exam_type)
    : allSubjects; // Show all to guests but prioritized

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
          <p className="text-muted-foreground">
            {user && profile 
              ? `Curated for your ${profile.exam_type} studies`
              : "Covering all major A/L and O/L streams"}
          </p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displaySubjects.map((subject, i) => (
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
