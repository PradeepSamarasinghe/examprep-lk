import { Filter } from "lucide-react";

const subjectFilterKeys = [
  { key: "all", labelKey: "leaderboard.allSubjects" },
  { key: "combined_maths", labelKey: "subject.combinedMaths" },
  { key: "physics", labelKey: "subject.physics" },
  { key: "chemistry", labelKey: "subject.chemistry" },
  { key: "biology", labelKey: "subject.biology" },
];

interface SubjectFiltersProps {
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
  t: (key: string) => string;
}

const SubjectFilters = ({ activeSubject, setActiveSubject, t }: SubjectFiltersProps) => (
  <div className="flex flex-wrap gap-2 mb-4">
    <Filter className="w-4 h-4 text-muted-foreground mt-1" />
    {subjectFilterKeys.map((subject) => (
      <button
        key={subject.key}
        onClick={() => setActiveSubject(subject.key)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          activeSubject === subject.key
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        {t(subject.labelKey)}
      </button>
    ))}
  </div>
);

export { subjectFilterKeys };
export default SubjectFilters;
