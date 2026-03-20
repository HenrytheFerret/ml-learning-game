# ⚡ Quick Start - ML Learning Game

**You have 5 minutes.** Here's how to play right now.

---

## 🎮 Play Immediately

### 1. Install
```bash
cd /data/.openclaw/workspace/ml-learning-game
npm install
```

### 2. Run
```bash
npm start
```

Your browser opens to `http://localhost:3000`

### 3. Play
1. Click the **Perceptron** card
2. Click **Build the Truth Table** challenge
3. Fill in the answers and hit submit!

**You just played an ML exam challenge. You earned XP. You got a badge.**

---

## 🎯 What You're Playing

**Truth Table Builder** teaches Question Type 2 from your exam:

> "Given weights and bias, calculate net and activation for all input combinations"

**Example:**
```
Weights: [2.0, 1.1]
Bias: -1.2

Input (0,0): net = -1.2 → activation = 0
Input (0,1): net = -0.1 → activation = 0
Input (1,0): net = 0.8 → activation = 1
Input (1,1): net = 1.9 → activation = 1
```

Fill in the table, click submit, get feedback + XP.

---

## 🎪 Dashboard Features

- **XP Counter** - Top right, increases with each challenge
- **Level** - Your current level (1-5)
- **Topic Cards** - Click to start learning path
- **Progress Bars** - See accuracy per topic
- **Badges** - Unlock by completing challenges

---

## 🎓 Challenge Difficulty

Each challenge has 3 levels:

| Easy | Medium | Hard |
|------|--------|------|
| Show all columns | Hide net column | Calculate everything |
| Give hints | Show formulas | Minimal help |
| 75% correct passes | 80% required | 85% required |

**Start with Easy, work up to Hard.**

---

## 💾 Your Progress is Saved

Progress saves automatically to your browser.

**To see it:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Look for `ml_game_progress`

You can play on this computer, close browser, come back tomorrow, and your progress is still there.

---

## 🚀 What's Coming Next

This is just the start. The game will have:

- ✅ **Perceptron** (Truth tables, training, exams)
- 🟡 **Multilayer Networks** (Forward pass, backprop, training)
- 🟡 **Kohonen Maps** (Training visualization)
- 🟡 **Hopfield Networks** (State transitions)
- 🟡 **Applications** (Real-world scenario game)
- 🟡 **Concepts** (Flashcard battles)

Each topic gets **multiple levels** and **exam-style questions**.

---

## 🎖️ Achievement Unlocks

Complete challenges to earn badges:

- 🎯 Circuit Designer
- ✅ Calculation Master
- 🏋️ Network Trainer
- ⚔️ Exam Warrior
- 🦦 Master Ferret

Badges show on your dashboard.

---

## ❌ Common Mistakes to Avoid

1. **Forgetting the bias** in net calculation
   - Remember: `net = Σ(input × weight) + bias`

2. **Wrong activation function**
   - Check: Is it threshold (0/1) or sigmoidal (0-1)?

3. **Rounding errors**
   - Use the calculator built into each challenge

4. **Rushing**
   - Take time to understand each step
   - Get 100% first, speed comes later

---

## 📚 Cheat Sheet

```
NET VALUE:
net = (input_1 × weight_1) + (input_2 × weight_2) + ... + bias

THRESHOLD ACTIVATION:
if net ≥ 0, then output = 1
if net < 0, then output = 0

ERROR (for training):
error = target - actual_output

WEIGHT UPDATE:
new_weight = old_weight + (learning_rate × error × input)
```

---

## 🆘 Stuck?

### "I don't understand the challenge"
→ Read the formula box at the top  
→ Click "Show Hint"  
→ Try Easy difficulty first

### "My answer is marked wrong but I think it's right"
→ Click "Try Again" to start fresh  
→ Check your calculation step-by-step  
→ Use the calculator if needed

### "Nothing's happening when I click submit"
→ Make sure you filled in ALL cells  
→ Check DevTools console (F12) for errors  
→ Refresh the page

### "I want to reset my progress"
→ Open DevTools → Application → Local Storage  
→ Delete `ml_game_progress`  
→ Refresh

---

## 📊 Score Well

### How Scoring Works
- Correct answer: +25 XP per row
- All correct first try: +Bonus 25 XP
- Speed bonus: +5 XP if under 1 minute
- Perfect streak (5 in a row): +100 XP

### How Grading Works
- Your answers are compared against ground truth
- Partial credit for correct methodology
- Feedback shows exactly what you got wrong
- Try again anytime

---

## 🎮 Tips to Master

1. **Start with Easy** - Get comfortable with calculations
2. **Progress to Hard** - Challenge yourself
3. **Do multiple challenges** - Repetition builds mastery
4. **Review mistakes** - Understand WHY you were wrong
5. **Aim for badges** - They track your progress
6. **Use the formula sheet** - It's right there in each challenge

---

## 🚀 Deploy to Share

Want to share your game with friends?

```bash
npm install -g vercel
vercel --prod
```

Vercel gives you a link. Share it. They can play immediately.

---

## 📖 Next: Read These

After playing:
1. `README.md` - Full feature guide
2. `ML_GAME_BUILD_GUIDE.md` - How to add challenges
3. `ML_GAME_SUMMARY.md` - Big picture overview

---

## ✅ You're Ready

You now know:
- How to play
- How scoring works
- What's coming next
- How to get unstuck

**Go play. Earn XP. Get badges. Master ML. 🦦**

---

## 🎯 This Week's Goal

- Play Truth Table Builder 5+ times
- Get at least one badge
- Reach Level 2
- Give feedback (what's fun? what's confusing?)

---

_Made for Damian's ML exam prep_  
_All progress tracked, all math verified_  
_Ready to deploy, ready to share_
