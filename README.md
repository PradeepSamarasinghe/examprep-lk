# examprep-lk
AI-powered O/Level & A/Level past paper practice platform for Sri Lanka students. Sinhala & English. Instant marking, wrong answer explanations, and progress tracking.

# 📚 ExamPrep LK

> **The smartest way to prepare for O/L and A/L exams in Sri Lanka.**
> Practice 20+ years of past papers with AI-powered marking, instant
> explanations in Sinhala and English, and a progress tracker that
> shows exactly what to study next.

![ExamPrep LK Banner](https://via.placeholder.com/1200x400/0A0612/8B5CF6?text=ExamPrep+LK+%E2%80%94+Ace+Your+O%2FL+%26+A%2FL+Exams)

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)
[![AI by Claude](https://img.shields.io/badge/AI%20by-Claude%20Anthropic-FF6B35)](https://anthropic.com)
[![Made in Sri Lanka](https://img.shields.io/badge/Made%20in-%F0%9F%87%B1%F0%9F%87%B0%20Sri%20Lanka-orange)](https://exampreplk.com)

---

## 🎯 What Is ExamPrep LK?

ExamPrep LK is a full-stack micro-SaaS platform built specifically
for Sri Lankan students preparing for the **G.C.E. Ordinary Level
(O/L)** and **G.C.E. Advanced Level (A/L)** national examinations
conducted by the **Department of Examinations Sri Lanka**.

Most students prepare for O/L and A/L using photocopied past papers
bought from bookshops. They mark their own answers (often incorrectly),
have no way to identify weak areas systematically, and receive no
explanation for wrong answers. Parents spend thousands of rupees on
tuition classes to fill this gap.

**ExamPrep LK changes that.**

- 📄 **20+ years of past papers** digitized for all major subjects
- ✅ **Instant auto-marking** — no waiting for a teacher
- 🤖 **AI explanations** — "You got this wrong because..." in Sinhala
- 📊 **Weak topic heatmap** — shows exactly which chapters to revise
- 👨‍🏫 **Teacher dashboard** — assign papers, track class performance
- 👨‍👩‍👧 **Parent view** — monitor your child's progress from your phone

---

## ✨ Key Features

### For Students
- **Timed Exam Simulation** — real exam conditions with countdown timer
- **Instant Auto-Marking** — MCQ and structured answers marked in seconds
- **AI Wrong Answer Explanations** — powered by Claude API, explains
  mistakes in plain Sinhala or English
- **Weak Topic Heatmap** — visual map of which chapters need more work
- **Performance Trends** — track score improvement over weeks and months
- **Offline Mode** — attempt papers without internet, sync when reconnected
- **Mobile-First Design** — fully functional on any Android phone

### For Tuition Teachers
- **Assign Past Papers** — assign specific papers to students or classes
- **Class Performance Dashboard** — see how each student scored
- **Weak Area Report** — identify the topics your class struggles with
  most, as a group
- **Progress Comparison** — track individual student improvement
  week over week
- **Batch Upload Results** — upload paper results for offline classes

### For Parents
- **Child Progress View** — see today's practice score, weekly trend,
  and teacher feedback in one place
- **Study Streak Tracker** — how many consecutive days your child
  has practiced
- **Subject Performance Grid** — which subjects need more attention
- **WhatsApp Report** — weekly progress summary delivered via WhatsApp

---

## 🎓 Subjects Covered

### O/Level (Grade 10–11)
| Subject | Papers Available | MCQ | Structured |
|---------|-----------------|-----|-----------|
| Mathematics | 2004–2024 | ✅ | ✅ |
| Science | 2004–2024 | ✅ | ✅ |
| English Language | 2006–2024 | ✅ | ✅ |
| Sinhala Language | 2006–2024 | ✅ | ✅ |
| History | 2004–2024 | ✅ | ✅ |
| Geography | 2004–2024 | ✅ | ✅ |
| Buddhism | 2004–2024 | ✅ | ✅ |
| Commerce | 2008–2024 | ✅ | ✅ |
| ICT | 2010–2024 | ✅ | ✅ |
| Health & Physical Education | 2008–2024 | ✅ | — |

### A/Level (Grade 12–13)
| Subject | Stream | Papers Available |
|---------|--------|-----------------|
| Combined Mathematics | Physical Science | 2006–2024 |
| Physics | Physical Science | 2006–2024 |
| Chemistry | Physical Science / Bio Science | 2006–2024 |
| Biology | Bio Science | 2006–2024 |
| Economics | Commerce | 2006–2024 |
| Business Studies | Commerce | 2006–2024 |
| Accounting | Commerce | 2006–2024 |
| Political Science | Arts | 2006–2024 |
| History | Arts | 2006–2024 |
| Geography | Arts | 2006–2024 |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 + TypeScript | SSR, routing, UI |
| Styling | Tailwind CSS | Dark theme, responsive |
| UI Components | shadcn/ui | Consistent component library |
| Database | Supabase (PostgreSQL) | Auth, data, RLS |
| AI Engine | Claude API (claude-sonnet-4-20250514) | Wrong answer explanations, insights |
| Charts | Recharts | Performance visualizations |
| Animations | Framer Motion | Page transitions, heatmap animations |
| Icons | Lucide React | UI icons throughout |
| Email | Resend | Weekly parent reports |
| SMS/WhatsApp | Twilio / WhatsApp Cloud API | WhatsApp progress reports |
| Deployment | Vercel | Hosting + Edge functions |
| Storage | Supabase Storage | Paper PDFs, answer images |
| Offline | Service Worker + IndexedDB | Offline paper attempts |

---

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Anthropic API key
- Twilio account (optional, for WhatsApp reports)

---

## 📁 Project Structure
```
examprep-lk/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx    # Student home
│   │   ├── practice/page.tsx     # Paper browser
│   │   ├── attempt/[id]/page.tsx # Active exam attempt
│   │   ├── results/[id]/page.tsx # Attempt results + AI explanations
│   │   ├── progress/page.tsx     # Performance tracking
│   │   ├── teacher/page.tsx      # Teacher dashboard
│   │   └── parent/page.tsx       # Parent view
│   ├── api/
│   │   ├── explain/route.ts      # Claude API: wrong answer explanations
│   │   ├── insights/route.ts     # Claude API: weekly study insights
│   │   └── whatsapp/route.ts     # WhatsApp report sender
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── exam/
│   │   ├── PaperSelector.tsx     # Subject + year + paper picker
│   │   ├── QuestionCard.tsx      # Individual question display
│   │   ├── Timer.tsx             # Countdown timer
│   │   ├── AnswerInput.tsx       # MCQ + structured answer inputs
│   │   └── ResultsCard.tsx       # Post-attempt result display
│   ├── analytics/
│   │   ├── TopicHeatmap.tsx      # Weak area visualization
│   │   ├── ScoreTrend.tsx        # Progress line chart
│   │   ├── SubjectGrid.tsx       # Subject performance grid
│   │   └── ClassReport.tsx       # Teacher class analytics
│   └── layout/
│       ├── Sidebar.tsx
│       ├── MobileNav.tsx
│       └── LanguageToggle.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── claude/
│   │   ├── explain.ts            # Generate wrong answer explanations
│   │   └── insights.ts           # Generate study insights
│   ├── sinhala/
│   │   └── unicode.ts            # Sinhala text utilities
│   └── utils.ts
├── hooks/
│   ├── useAttempt.ts             # Exam attempt state management
│   ├── useProgress.ts            # Student performance data
│   └── useOffline.ts             # Offline mode handling
├── supabase/
│   ├── migrations/               # DB migration files
│   └── seed/                     # Demo data seeding scripts
├── public/
│   └── fonts/
│       └── NotoSansSinhala/      # Sinhala font files
├── .env.example
├── package.json
└── README.md
```

---

## 🤖 AI Features

### Wrong Answer Explainer
When a student gets a question wrong, the Claude API generates
a personalized explanation:
```typescript
// lib/claude/explain.ts

const systemPrompt = `You are a Sri Lankan O/Level and A/Level
subject matter expert and exam coach. When a student gets a
question wrong, explain:
1. Why the correct answer is right (1-2 sentences)
2. Why their chosen answer is wrong (1 sentence)
3. The key concept they need to revisit (1 sentence)
4. A memory tip or shortcut if applicable

Language: Respond in ${language === 'si' ? 'Sinhala' : 'English'}.
Keep total response under 120 words.
Tone: Encouraging, never discouraging.`;
```

### Study Insight Generator
After each practice session, Claude generates a personalized
study recommendation:
```typescript
// lib/claude/insights.ts

const systemPrompt = `You are a Sri Lankan exam preparation
coach. Analyze this student's recent performance data and
generate one specific, actionable study recommendation for
their next session. Consider: their weakest topics, time
spent per question, recent trend (improving/declining),
and days until their exam. Be specific — name the exact
chapter or concept they should focus on.
Respond in ${language}. Under 60 words.`;
```

---

## 🌐 Internationalization

ExamPrep LK supports three languages across the entire UI:
```typescript
// Supported locales
export const languages = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  si: { name: 'සිංහල', flag: '🇱🇰', dir: 'ltr',
        font: 'Noto Sans Sinhala' },
  ta: { name: 'தமிழ்', flag: '🇱🇰', dir: 'ltr',
        font: 'Noto Sans Tamil' }
}
```

All question text, AI explanations, UI labels, and error messages
are available in all three languages. Language preference is stored
per user in Supabase and persists across sessions.

---

## 💰 Pricing Tiers

| Feature | Free | Student (LKR 500/mo) | Teacher (LKR 2,500/mo) |
|---------|------|---------------------|------------------------|
| Past papers access | Last 5 years | All 20+ years | All 20+ years |
| AI wrong answer explanations | 10/day | Unlimited | Unlimited |
| Subjects | 3 subjects | All subjects | All subjects |
| Progress tracking | Basic | Full heatmap + trends | Full + class reports |
| Practice tests | 3/day | Unlimited | Unlimited |
| Parent sharing | — | ✅ | ✅ |
| Assign to students | — | — | ✅ unlimited |
| Class analytics | — | — | ✅ |
| WhatsApp reports | — | Weekly | Daily |
| Offline mode | — | ✅ | ✅ |
| Annual discount | — | 2 months free | 2 months free |

---

## 📊 Market Context

| Metric | Data |
|--------|------|
| Annual O/L candidates | ~500,000 students |
| Annual A/L candidates | ~350,000 students |
| Private tuition spend per student | LKR 30,000–120,000/year |
| Target addressable market | 850,000+ exam candidates annually |
| Avg Sri Lanka tuition teacher students | 50–500 students per teacher |
| Active tuition teachers in Sri Lanka | 200,000+ |
| Smartphone penetration (15–25 age group) | 78%+ |

---

## 🗺️ Roadmap

### v1.0 — MVP (Q1 2026)
- [x] O/L Mathematics and Science past papers (2010–2024)
- [x] MCQ auto-marking
- [x] AI wrong answer explanations (English only)
- [x] Basic progress tracking
- [x] Student + teacher accounts
- [x] Mobile-responsive UI

### v1.5 — Language Expansion (Q2 2026)
- [ ] AI explanations in Sinhala
- [ ] Tamil language UI
- [ ] All 10 O/L subjects added
- [ ] Parent account view
- [ ] WhatsApp weekly report

### v2.0 — A/Level + Teacher Tools (Q3 2026)
- [ ] Full A/L past paper library (all streams)
- [ ] Teacher assignment + class analytics
- [ ] Structured answer (essay) scoring
- [ ] Weak topic revision sets
  (auto-generated from wrong answers)
- [ ] Offline PWA mode

### v2.5 — Platform Expansion (Q4 2026)
- [ ] Native Android app (React Native)
- [ ] School/institute bulk licensing
- [ ] Tuition center white-label option
- [ ] API for third-party tuition platforms
- [ ] Live mock exam sessions (timed, group)

### v3.0 — AI Tutor (2027)
- [ ] Conversational AI tutor per subject
  (ask any exam question, get explained)
- [ ] Personalized study plan generation
- [ ] Predicted exam topics based on
  10-year pattern analysis
- [ ] Video explanation links from
  Sri Lankan YouTube educators

---

## 🤝 Contributing

Contributions are welcome — especially from Sri Lankan
educators, students, and developers.

### High Priority Contributions Needed
- 📄 **Past paper digitization** — if you have scanned past
  papers not yet in the database, please submit them
- 🌐 **Sinhala translations** — UI strings and AI prompt
  translations reviewed by native speakers
- ✅ **Answer verification** — reviewing and verifying
  correct answers for structured questions
- 🧪 **Testing** — especially on low-end Android devices
  with slow connections (our primary user base)


## 🙏 Acknowledgements

- **Department of Examinations Sri Lanka** — for making
  past papers publicly available
- **Sri Lankan tuition teachers** — for the feedback that
  shaped this product from day one
- **Anthropic** — for Claude API powering the AI explanations
- **Supabase** — for the backend infrastructure
- **Every O/L and A/L student in Sri Lanka** — this is
  built for you 🇱🇰

---

## 📞 Contact

**Project Maintainer:** [@PradeepSamarasinghe](https://github.com/PradeepSamarasinghe)

**Email:** samarasinghepradeep242@gmail.com

---

<div align="center">

**Built with ❤️ in Sri Lanka 🇱🇰**

*Helping every Sri Lankan student reach their potential —
one past paper at a time.*

</div>
