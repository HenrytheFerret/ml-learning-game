# 🎮 ML Learning Game - Comprehensive Design Document

## Vision

**Turn Machine Learning exam prep from tedious memorization into an addictive, rewarding adventure.**

The game should feel like:
- 🎯 **Brilliant.org meets Duolingo** - Interactive explanations + spaced repetition
- 🎮 **Rewarding progression** - Constant XP, unlocks, surprises, streaks
- 🧠 **Deep learning** - Hands-on calculations, visualization, mastery flow
- 🏆 **Competitive & social** - Leaderboards, badges, challenge sharing

---

## 🎯 Core Game Loop

### The Three Modes (Per Topic)

Every topic has 3 modes with increasing difficulty:

#### 1. **LEARN** 🎓 (Discovery Phase)
**Goal:** Understand the concept
- Animated explanation with visual
- Key formulas highlighted
- Example worked through step-by-step
- 1-2 interactive "try this" moments
- **Reward:** 50 XP + unlock PRACTICE

**Flow:**
```
Explanation Video (2min) 
  ↓ 
Formula Breakdown with Diagram
  ↓
Worked Example (click through steps)
  ↓
"Try This" Interactive Demo (fill in blanks)
  ↓
PRACTICE Unlocked! ✓
```

#### 2. **PRACTICE** 🔧 (Mastery Phase)
**Goal:** Get comfortable with calculations
- 5-10 graded challenges of increasing difficulty
- Instant feedback on each answer
- Hints available (costs 5 XP to use)
- Partial credit system
- **Reward:** 25-75 XP per challenge + streak bonus

**Challenge types vary:**
- Fill-in-the-blank calculations
- Multiple choice with working shown
- Diagram builders
- Order-the-steps puzzles
- Comparison challenges ("What's different?")

**Difficulty progression:**
```
Challenge 1 (Easy): Basic concept, numbers are nice
Challenge 2-3 (Medium): Realistic difficulty
Challenge 4-5 (Hard): Edge cases, tricky numbers
Challenge 6-7 (Expert): Multi-step with decisions
Challenge 8-10 (Boss): Full topic integration
```

#### 3. **MASTER** ⚔️ (Exam Mode)
**Goal:** Prove mastery under pressure
- 1 Exam-style question (actual Q from exam or predicted)
- 5-10 minutes time limit
- No hints
- Full working required
- **Reward:** 150-200 XP + special badge if perfect

**After submission:**
- Compare your working to model answer
- See where you lost/gained marks
- Option to re-attempt (doesn't count toward scoring)

---

## 📚 Content Structure (All Topics)

### **Topic 1: Perceptron** (40% exam weight) ✅ MVP
**Lessons:**
1. What's a Perceptron? (drawing neurons)
2. Calculating Net Value (Σ inputs × weights + bias)
3. Activation Functions (threshold, sigmoid)
4. Truth Tables (all input combinations)
5. Training Rule (delta rule, weight updates)
6. Geometric Interpretation (decision boundaries)

**Challenges per lesson:**
- L1: Label parts of a neuron (diagram)
- L2: Calculate 10 nets (interactive)
- L3: Apply activation functions (choose function type)
- L4: Fill truth tables (current: 4 inputs × 2 combos = 4 rows)
- L5: Training simulator (watch weights update, then predict)
- L6: Draw the decision boundary (sketch on 2D plot)

**Master Question:** Actual exam Q2 or variant

---

### **Topic 2: Multilayer Networks** (27% exam weight)
**Lessons:**
1. Why do we need hidden layers?
2. Forward propagation (multiple layers)
3. Backpropagation algorithm (chain rule)
4. Loss functions & gradient descent
5. Overfitting & regularization
6. Training tips & tricks

**Challenges per lesson:**
- L1: Forward pass (layer by layer, fill blanks)
- L2: Calculate output of hidden layer
- L3: Calculate partial derivatives
- L4: Complete backprop step (multi-layer)
- L5: Gradient descent visualization (interactive plot)
- L6: Predict overfitting from training curves

**Master Question:** Multi-layer network problem

---

### **Topic 3: Kohonen Networks** (31% exam weight)
**Lessons:**
1. Self-organizing maps (unsupervised learning)
2. Neighborhood function & distance metrics
3. Updating weights (Kohonen rule)
4. Topology preservation
5. Applications (data clustering, dimensionality reduction)
6. Interpreting SOM visualizations

**Challenges per lesson:**
- L1: Identify nearest neuron (find closest weight vector)
- L2: Calculate distances (Euclidean)
- L3: Apply Kohonen rule (calculate new weights)
- L4: Trace weight updates (step-by-step visualization)
- L5: Build a mini SOM (grid of neurons, update by hand)
- L6: Analyze SOM output (what clusters formed?)

**Master Question:** SOM problem with analysis

---

### **Topic 4: Hopfield Networks** (27% exam weight)
**Lessons:**
1. Content-addressable memory (associative recall)
2. Weight calculation (Hebb's rule)
3. Energy function & convergence
4. Spurious states & basin of attraction
5. Pattern recall & noise tolerance
6. Applications & limitations

**Challenges per lesson:**
- L1: Calculate Hopfield weights (Hebb's rule)
- L2: Trace state transitions (click through states)
- L3: Calculate energy of a state
- L4: Predict final state (given initialization)
- L5: Identify spurious states
- L6: Recall pattern from noisy input

**Master Question:** Hopfield network with recall task

---

### **Topic 5: Applications & Concepts** (Mixed)
**Lessons:**
1. Supervised vs. unsupervised learning
2. Real-world use cases (image recognition, clustering)
3. Comparing learning paradigms
4. Ethical considerations
5. When to use each network type

**Challenge types:**
- Classification cards ("Which network for this problem?")
- Case study analysis ("What went wrong?")
- Design challenges ("Build a network for X")
- Concept matching ("Connect definitions")

---

## 🎮 Gamification System

### XP & Levels

```
Level 1 (Novice):    0-100 XP
Level 2 (Apprentice):  100-300 XP    (+10% bonus)
Level 3 (Practitioner): 300-700 XP    (+15% bonus)
Level 4 (Expert):    700-1500 XP   (+20% bonus)
Level 5 (Master Ferret 🦦): 1500+ XP   (+25% bonus)
```

### XP Earning

| Event | XP | Conditions |
|-------|-----|-----------|
| Complete LEARN | 50 | First time only |
| Complete PRACTICE challenge | 25-75 | Based on difficulty |
| Speed bonus | +10 | < 1 min for medium, < 2 min for hard |
| Perfect streak | +100 | 5 correct in a row |
| Difficulty multiplier | ×1-3 | Easy=1x, Medium=1.5x, Hard=2x, Expert=2.5x, Boss=3x |
| MASTER challenge perfect | 200 | Perfect score on exam question |
| MASTER challenge ≥80% | 150 | Good score |

### Streaks & Momentum

- **Correct streak:** Each challenge in a row = 1 point in streak counter
  - 5 streak = +100 XP bonus
  - 10 streak = +200 XP + 🔥 streak badge
  - 20 streak = +500 XP + 🔥🔥🔥 mega streak
- **Streak ends** on any wrong answer (but can restart)
- **Momentum multiplier:** 1.0 → 1.5 at 5 streak → 2.0 at 10 streak

### Badges & Unlocks

**Badges Earned:**
- 🎯 **Circuit Designer** - Complete Perceptron LEARN
- ✅ **Calculation Master** - Perfect on 5 PRACTICE challenges
- 🏋️ **Network Trainer** - Get a perfect streak of 5
- 📊 **Training Analyst** - Understand backpropagation
- ⚔️ **Exam Warrior** - Score 150+ on a MASTER challenge
- 🗺️ **Map Architect** - Master Kohonen Networks
- 💾 **Memory Palace Master** - Master Hopfield Networks
- 🧠 **AI Architect** - Complete all 5 topics at 80%+
- 🚀 **Ferret's Knowledge** - Reach Level 5 Master Ferret

**Unlocks:**
- Level 2 unlocks: Multiple activation functions
- Level 3 unlocks: Advanced hint system, leaderboard view
- Level 4 unlocks: Custom challenge builder, export progress
- Level 5 unlocks: Leaderboard rank, profile badge

### Surprises & Engagement

**Random rewards:**
- Every 10th correct answer: 🎁 Bonus challenge (+50 XP if perfect)
- End-of-day streak multiplier: If you maintain streak after 8pm, +50% bonus
- "Lucky swing" (5% chance): Random 2x XP multiplier on next challenge

**Unlockable cosmetics:**
- Ferret avatar skins (locked by badges/XP)
- Custom theme colors
- Sound effects on/off
- Leaderboard nickname

---

## 🎨 Visual & UX Enhancements

### Dashboard (Home)
```
┌─────────────────────────────────────────┐
│ 🦦 ML Learning Game                     │
│ Level 4 Expert | 950/1500 XP | 🔥 8 str│
├─────────────────────────────────────────┤
│ Progress to Level 5: ████░░░░░ 63%      │
│                                         │
│ 📚 Topics (Click to Start)               │
│ ┌──────────┬──────────┬──────────┐      │
│ │🧠        │🕸️       │🗺️        │      │
│ │Perceptron│Multilayer│Kohonen   │      │
│ │85% (28/33) 65% (0/8) 0% (0/18)│      │
│ └──────────┴──────────┴──────────┘      │
│                                         │
│ 🏆 Recent Achievements                   │
│ • Training Analyst [5 min ago]          │
│ • 10-Streak 🔥 [2 hours ago]            │
└─────────────────────────────────────────┘
```

### Topic Page (Lesson Selection)
```
🧠 PERCEPTRON - 6 Lessons

┌─ Lesson 1: What's a Perceptron? ────────┐
│ Status: ✅ Complete (50 XP earned)     │
│ [LEARN] [PRACTICE ×6] [MASTER]         │
└────────────────────────────────────────┘

┌─ Lesson 2: Net Value ─────────────────┐
│ Status: 🟡 In Progress (75 XP so far) │
│ [LEARN] [PRACTICE: 4/7]  [MASTER 🔒]  │
│ Next: Continue PRACTICE #5             │
└────────────────────────────────────────┘

┌─ Lesson 3: Activation Functions ──────┐
│ Status: 🔒 Locked                     │
│ Unlock by: Complete Lesson 2 MASTER   │
└────────────────────────────────────────┘
```

### Challenge Page

**During challenge:**
```
PRACTICE Challenge 5 of 7
⏱️ 1:23 remaining | 🔥 5 streak | Difficulty: Hard ★★★

Question: Calculate the net value
Weights: [0.5, -0.2, 0.8]
Bias: 0.3
Input: [1, 1, 0]

Your answer: _______
[Submit] [Hint -5 XP] [Give Up]
```

**After submission:**
```
✅ Correct! +75 XP earned (1.5x streak bonus)

Your answer:  0.3 ✓
Working:      1×0.5 + 1×(-0.2) + 0×0.8 + 0.3 = 0.6

⏱️ Time: 45 sec (+10 speed bonus) ⚡

[Next Challenge] [Review] [Back]
```

### Visual Explanations

**Perceptron neuron diagram:**
- Interactive SVG: hover over parts to highlight
- Show inputs flowing left → weights on connections → neuron → output
- Animated calculation showing each step
- Activation function graph (click to change function type)

**Backprop visualization:**
- Forward pass: arrows going down, numbers showing activations
- Backward pass: arrows going up, showing gradients
- Highlight which weights are being updated most
- Animate weight changes in real-time

**Kohonen map:**
- Grid of neurons shown as colored squares
- Click to select input, watch neurons light up by distance
- Animate winner neuron and neighborhood
- Show weight vectors as arrows (if expert mode)

**Hopfield network:**
- Circle of neurons (pattern)
- Click to toggle bits, watch energy graph go down
- Show convergence path in energy landscape
- Compare candidate patterns with hamming distance

---

## 🚀 Implementation Priority

### Phase 1 (This Week) - MVP++ 
- ✅ Dashboard redesign (better visual hierarchy)
- ✅ Lesson structure scaffold (LEARN, PRACTICE, MASTER templates)
- ✅ Perceptron LEARN component (with animations)
- ⏳ 2-3 new PRACTICE challenges for Perceptron
- ⏳ Perceptron MASTER challenge (exam Q)
- **Result:** Playable Perceptron end-to-end with 80% fun

### Phase 2 (Week 2) - Content Explosion
- Multilayer Networks full topic (lessons + challenges)
- Kohonen Networks full topic
- Hopfield Networks full topic
- Better visual explanations across all topics
- **Result:** All 4 main topics playable

### Phase 3 (Week 3) - Polish & Delight
- Applications & Concepts topic
- Leaderboard system
- Sound effects & polish
- Cosmetics/unlockables
- Final testing & bug fixes
- **Result:** Production-ready MVP!

---

## 📊 Success Metrics

By exam day, the game should deliver:

✅ **Engagement:** Player plays 30+ min per day for 10+ days  
✅ **Learning:** 80%+ accuracy on master challenges before exam  
✅ **Retention:** Can recall formulas & concepts without hints  
✅ **Confidence:** Feels "ready" vs. "stressed" before exam  
✅ **Fun:** Genuinely enjoys the learning process  

---

## 🎯 Design Principles

1. **Clarity first** - Never unclear what you're supposed to do
2. **Instant feedback** - Know if you're right/wrong in <1 sec
3. **Celebrate wins** - Every achievement gets a little dopamine hit
4. **Forgive mistakes** - You can always retry, learn from it
5. **Progressive challenge** - Each challenge is slightly harder
6. **Visual first** - Explain with pictures, then equations
7. **Time-aware** - Shorter sessions feel rewarding than long grinds
8. **Surprising delight** - Occasional unexpected bonuses/rewards

---

## 🎓 Learning Flow (Example: Perceptron)

```
New User Lands on Game
         ↓
See Dashboard → "Welcome!" → Auto-start Perceptron
         ↓
LEARN Phase (5-7 min)
  - Watch animated neuron explanation
  - See how net value is calculated
  - Interactive demo: change weights, see output change
  - "Try it yourself" fill-in-the-blank
         ↓
🎉 First 50 XP! You're a "Circuit Designer"
         ↓
PRACTICE Challenges (15-20 min)
  - 7 challenges, building difficulty
  - First ones are easy (numbers are round)
  - Last ones have edge cases
  - You get 5-7 right, 1-2 wrong
         ↓
🎉 +300 XP, "Calculation Master" badge
         ↓
MASTER Challenge (5-10 min)
  - Real exam question
  - You get 80%+ → +150 XP
         ↓
🎉 Total: ~500 XP in one sitting
    You're Level 2 Apprentice now
    Next: Learn about activation functions
         ↓
User feels: "That was actually fun & I learned something"
```

---

## 🛠️ Technical Notes

- **State management:** Zustand (already set up)
- **Animations:** Framer Motion or CSS transitions
- **Diagrams:** SVG (interactive, scalable, performant)
- **Math:** Existing nn-math.ts library (complete)
- **Persistence:** localStorage (save progress auto)
- **Mobile:** Tailwind already responsive, test on phone

