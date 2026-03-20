# 🦦 ML Learning Game

**Interactive Gamified Learning Platform for Machine Learning Exam (SMc30402)**

A Brilliant.org-style web game that teaches Machine Learning fundamentals through interactive challenges, real-time visualization, and gamification.

---

## 🎮 Features

### ✅ Implemented (MVP)
- **Dashboard with Progress Tracking**
  - Total XP and Level system
  - Accurate statistics per topic
  - Achievement badges
  - Streak counter

- **Perceptron Topic (Complete Learning Path)**
  - Level 1: LEARN - Interactive perceptron diagram with activation function
  - Level 2: PRACTICE - Truth table builder (currently playable!)
  - Level 3: PRACTICE - Training simulator
  - Level 4: PRACTICE - Before/After comparison
  - Level 5: MASTER - Exam-style Q2 challenge
  - Level 6: CONCEPT - Supervised learning explainer

- **State Management**
  - Zustand for global state
  - localStorage persistence
  - Auto-save progress

- **Neural Network Math Engine**
  - Perceptron class with training
  - MLFFN with backpropagation
  - Kohonen self-organizing maps
  - Hopfield networks
  - All exam formulas implemented

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd ml-learning-game
npm install
```

### Development

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

The page will auto-reload as you make changes.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `build/` folder.

---

## 📁 Project Structure

```
ml-learning-game/
├── src/
│   ├── components/
│   │   ├── TruthTableBuilder.tsx       # Interactive truth table challenge
│   │   ├── ProgressBar.tsx             # Level progress visualization
│   │   ├── TopicCard.tsx               # Topic card component
│   │   └── ... (more coming)
│   ├── lib/
│   │   ├── nn-math.ts                  # Neural network math (Perceptron, MLFFN, etc.)
│   │   ├── scoring.ts                  # XP, badges, level system
│   │   └── store.ts                    # Zustand global state
│   ├── pages/
│   │   └── ... (future)
│   ├── styles/
│   │   └── globals.css                 # Tailwind + custom styles
│   ├── App.tsx                         # Main app component
│   └── index.tsx                       # React entry point
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🎯 Game Content Map

### Topics (Mapped to SMc30402 Exam)

| Topic | Exam Weight | Status | Notes |
|-------|-------------|--------|-------|
| **Perceptron** | 40% | 🟢 MVP Ready | All 5 levels playable |
| **Multilayer Networks** | 27% | 🟡 In Progress | Started: neural math done |
| **Kohonen Networks** | 31% | 🟡 In Progress | Math engine ready |
| **Hopfield Networks** | 27% | 🟡 Queued | Math engine ready |
| **Applications** | 16% | 🟡 Queued | Card-based challenges |
| **Concepts** | 27% | 🟡 Queued | Flashcard system |

### Current Challenge Types Implemented
- ✅ Truth Table Builder (Question Type 2)
- 🟡 In Progress: Forward Pass Calculator, Backprop Puzzle, Kohonen Trainer
- ⏳ Queued: Diagram builder, Application classifier, Concept duel

---

## 📊 Gamification System

### Scoring
- **Correct answer**: +25-200 XP (depends on challenge difficulty)
- **Speed bonus**: +5 XP for <1 minute
- **Perfect streak**: +100 XP for 5 in a row
- **Exam challenge**: +200 XP for perfect score

### Levels
```
Level 1: Novice (0-100 XP)
Level 2: Apprentice (100-300 XP)
Level 3: Practitioner (300-700 XP)
Level 4: Expert (700-1500 XP)
Level 5: Master Ferret 🦦 (1500+ XP)
```

### Badges
- 🎯 Circuit Designer
- ✅ Calculation Master
- 🏋️ Network Trainer
- 📊 Training Analyst
- ⚔️ Exam Warrior
- 🧠 Architect
- 🚀 Backprop Wizard
- 🗺️ Map Architect
- 💾 Memory Palace Master
- ⭐ Ferret's Knowledge

---

## 🧠 How It Works

### Truth Table Builder (Currently Playable)

1. You're given weights, bias, and activation function
2. For each input combination:
   - Calculate net = Σ(input × weight) + bias
   - Apply activation function
3. Fill in the table
4. Submit for grading (instant feedback)
5. Earn XP based on accuracy

**Example:**
```
Weights: [2.0, 1.1]
Bias: -1.2

Input (0,0): net = 0*2.0 + 0*1.1 - 1.2 = -1.2 → activation = 0
Input (0,1): net = 0*2.0 + 1*1.1 - 1.2 = -0.1 → activation = 0
Input (1,0): net = 1*2.0 + 0*1.1 - 1.2 = 0.8 → activation = 1
Input (1,1): net = 1*2.0 + 1*1.1 - 1.2 = 1.9 → activation = 1
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **ml5.js** (optional) for ML math

### Deployment
- **Vercel** (Frontend)
- *Optional*: Supabase for backend/persistence

### Build Tools
- **React Scripts**
- **TypeScript**
- **Tailwind CSS**

---

## 📈 Development Roadmap

### Week 1 ✅ (Complete)
- [x] React scaffold + TypeScript setup
- [x] Neural network math engine (all 4 networks)
- [x] Scoring & gamification system
- [x] Zustand state management
- [x] Truth Table Builder (playable!)
- [x] Dashboard with progress tracking
- [ ] Deploy to Vercel

### Week 2 🚀 (Next)
- [ ] Multilayer Networks topic (LEARN + PRACTICE)
- [ ] Forward Pass Calculator challenge
- [ ] Backpropagation Puzzle
- [ ] Kohonen Weight Calculator
- [ ] Network Architecture visualizations

### Week 3 📅 (Final)
- [ ] Hopfield Networks topic
- [ ] Application Classification challenges
- [ ] Concept Duel flashcards
- [ ] Final polish & testing
- [ ] Deploy full MVP

---

## 🎓 Learning Outcomes

After completing all topics, students can:

✅ Draw and label neural network diagrams  
✅ Calculate net values and activations  
✅ Create and analyze truth tables  
✅ Perform manual perceptron training  
✅ Understand backpropagation algorithm  
✅ Apply Kohonen learning rule  
✅ Build Hopfield state transitions  
✅ Compare learning paradigms (supervised vs. unsupervised)  
✅ Identify real-world applications  
✅ Score 80%+ on exam practice questions  

---

## 🐛 Known Issues & Future Work

### Short Term
- [ ] Add time tracking for speed bonuses
- [ ] Improve mobile responsiveness
- [ ] Add audio feedback option
- [ ] Export progress as PDF

### Medium Term
- [ ] Backend integration (Supabase)
- [ ] Global leaderboard
- [ ] Social features (share challenges)
- [ ] Spaced repetition system

### Long Term
- [ ] AI tutor (ChatGPT hints)
- [ ] Full mock exam mode
- [ ] Analytics dashboard for instructors
- [ ] Mobile app (React Native)

---

## 📝 Contributing

To add new challenges:

1. Create challenge component in `src/components/`
2. Add math logic to `src/lib/nn-math.ts` if needed
3. Integrate into `App.tsx` topic section
4. Test locally
5. Submit PR

---

## 📚 References

- **Exam:** SMc30402 Machine Learning
- **Study Guide:** `ml-exam-study-guide.md`
- **Predicted Questions:** `ml-predicted-questions.md`
- **Quick Reference:** `ml-quick-reference.md`

---

## 🎮 Try It Now!

```bash
# Clone the project
cd ml-learning-game

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
# Click "Perceptron" → Start with Truth Table Builder!
```

---

## 💡 Tips for Learners

1. **Start with Perceptron** - It's the foundation for everything
2. **Do truth tables first** - Practice calculation before training
3. **Use the difficulty levels** - Easy → Medium → Hard
4. **Aim for 80% accuracy** - Unlocks MASTER mode
5. **Review mistakes** - Learn from errors
6. **Collect badges** - They track your progress
7. **Check the formula sheet** - Available in each challenge

---

## 🦦 Created by

**Kevin** (Head Coding Ferret) + **Sam** (Research Ferret)

Made for Damian's ML exam prep. May the XP be with you! 🚀

---

## 📄 License

Educational use only. Created for exam preparation.

---

**Next Step:** Deploy to Vercel and share the link!
