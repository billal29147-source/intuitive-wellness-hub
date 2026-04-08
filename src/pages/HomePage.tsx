import { Footprints, Heart, Moon, Flame, Droplets, Trophy, Dumbbell, UtensilsCrossed, Gamepad2, Wind, Activity, MapPin, Brain, Info, Calendar } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import HealthRing from "@/components/HealthRing";
import { useState } from "react";

interface HomePageProps {
  onNavigate: (page: number) => void;
}

const navIcons = [
  { icon: Dumbbell, label: "Workouts", page: 1, color: "text-health-calories" },
  { icon: UtensilsCrossed, label: "Food", page: 2, color: "text-health-hydration" },
  { icon: Gamepad2, label: "Games", page: 3, color: "text-health-progress" },
  { icon: Trophy, label: "Compete", page: 3, color: "text-health-heart" },
];

const HomePage = ({ onNavigate }: HomePageProps) => {
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  const explanations: Record<string, string> = {
    steps: "Steps track how much you walk. 10,000 steps ≈ 5 miles and helps maintain cardiovascular health.",
    heart: "Resting heart rate shows how efficiently your heart pumps. Lower is generally better (60-100 bpm normal).",
    sleep: "Quality sleep helps recovery. Deep sleep repairs muscles, REM consolidates memory.",
    calories: "Active calories are burned through movement. Your body also burns calories at rest (BMR).",
    spo2: "Blood oxygen (SpO2) measures oxygen saturation. 95-100% is normal. Below 90% needs attention.",
    respiratory: "Respiratory rate is breaths per minute at rest. Normal is 12-20. Changes can indicate health shifts.",
    distance: "Total distance walked/run today based on step length and GPS data.",
    score: "Your personalized health score combines all metrics into one easy number. 80+ is excellent!",
    body: "Body composition estimates fat vs. lean mass. More useful than BMI for understanding fitness.",
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Good Morning, Alex</p>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">⌚</span>
        </div>
      </div>

      {/* Personalized Daily Health Score */}
      <div className="glass-card rounded-3xl p-5 mb-5 health-glow-progress">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Daily Health Score</p>
          <button onClick={() => setShowExplanation(showExplanation === "score" ? null : "score")}>
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        {showExplanation === "score" && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 mb-2">{explanations.score}</p>
        )}
        <div className="flex items-center gap-4">
          <HealthRing progress={82} size={80} strokeWidth={7} color="hsl(var(--health-progress))">
            <p className="text-lg font-bold">82</p>
          </HealthRing>
          <div className="flex-1">
            <p className="text-xl font-bold text-health-progress">Excellent</p>
            <p className="text-xs text-muted-foreground mt-1">You're doing great! Keep it up.</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-health-progress/20 text-health-progress px-2 py-0.5 rounded-full">+5 from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Ring */}
      <div className="glass-card rounded-3xl p-6 mb-5 flex items-center gap-6">
        <HealthRing progress={72} size={100} strokeWidth={8} color="hsl(var(--primary))">
          <div className="text-center">
            <p className="text-lg font-bold">72%</p>
            <p className="text-[10px] text-muted-foreground">Daily</p>
          </div>
        </HealthRing>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-steps" />
            <span className="text-xs text-muted-foreground flex-1">Move</span>
            <span className="text-xs font-medium">420 / 600 cal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-heart" />
            <span className="text-xs text-muted-foreground flex-1">Exercise</span>
            <span className="text-xs font-medium">25 / 30 min</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-sleep" />
            <span className="text-xs text-muted-foreground flex-1">Stand</span>
            <span className="text-xs font-medium">9 / 12 hrs</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Icons */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {navIcons.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <item.icon className={`w-6 h-6 ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Real-Time Vitals */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Activity className="w-4 h-4" /> Real-Time Data
        <span className="ml-auto text-[10px] text-health-progress animate-pulse">● Live</span>
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={Footprints} label="Steps" value="8,432" subtitle="Goal: 10,000" colorClass="text-health-steps" glowClass="health-glow-steps" onInfo={() => setShowExplanation(showExplanation === "steps" ? null : "steps")} goalTip={{
          summary: "You need 1,568 more steps to hit your 10,000 step goal today!",
          progress: 84,
          tips: [
            "Take a brisk 15-minute walk after dinner — that's roughly 1,500-2,000 steps.",
            "Try parking farther from entrances or taking the stairs instead of the elevator.",
            "Set a reminder to walk for 5 minutes every hour during the afternoon.",
            "Walking while on phone calls is an easy way to add 500+ steps without extra time.",
          ]
        }} />
        <MetricCard icon={Heart} label="Heart" value="72 bpm" subtitle="Resting" colorClass="text-health-heart" glowClass="health-glow-heart" onInfo={() => setShowExplanation(showExplanation === "heart" ? null : "heart")} goalTip={{
          summary: "Your resting heart rate is 72 bpm — healthy range is 60-100. Aim for under 65 bpm for optimal fitness.",
          progress: 72,
          tips: [
            "Practice deep breathing exercises (4-7-8 technique) for 5 minutes daily to lower your resting heart rate.",
            "Regular cardio like jogging, cycling, or swimming 3-4x per week strengthens your heart over time.",
            "Reduce caffeine intake in the afternoon — it can keep your heart rate elevated for hours.",
            "Meditation and stress management can lower resting heart rate by 5-10 bpm over weeks.",
          ]
        }} />
        <MetricCard icon={Moon} label="Sleep" value="7h 24m" subtitle="Deep: 2h 10m" colorClass="text-health-sleep" glowClass="health-glow-sleep" onInfo={() => setShowExplanation(showExplanation === "sleep" ? null : "sleep")} goalTip={{
          summary: "You slept 7h 24m — you're 36 minutes short of the recommended 8 hours. Deep sleep was good at 2h 10m!",
          progress: 93,
          tips: [
            "Go to bed 30 minutes earlier tonight — set an alarm at 10:30 PM as a wind-down reminder.",
            "Avoid screens 1 hour before bed. Blue light suppresses melatonin and delays deep sleep onset.",
            "Keep your room at 65-68°F (18-20°C) — cooler temperatures improve deep sleep duration.",
            "Try a magnesium supplement or chamomile tea before bed to improve sleep quality naturally.",
          ]
        }} />
        <MetricCard icon={Flame} label="Calories" value="1,847" subtitle="Active: 420" colorClass="text-health-calories" glowClass="health-glow-calories" onInfo={() => setShowExplanation(showExplanation === "calories" ? null : "calories")} goalTip={{
          summary: "You've burned 420 active calories out of your 600 goal. You need 180 more active calories!",
          progress: 70,
          tips: [
            "A 20-minute HIIT session can burn 150-250 calories — perfect to close your gap today.",
            "Even a 30-minute moderate walk burns about 100-150 calories depending on your weight and pace.",
            "Try bodyweight exercises like burpees, jumping jacks, or mountain climbers for quick calorie burns.",
            "Dancing to music for 15 minutes burns roughly 100 calories and is a fun way to stay active.",
          ]
        }} />
        <MetricCard icon={Droplets} label="Water" value="6 / 8" subtitle="Glasses" colorClass="text-health-hydration" glowClass="health-glow-steps" goalTip={{
          summary: "You've had 6 out of 8 glasses. Drink 2 more glasses (about 500ml) to hit your daily hydration goal!",
          progress: 75,
          tips: [
            "Set a reminder to drink one glass now and another with dinner — you'll be done in no time.",
            "Keep a water bottle at your desk. People who see water drink 25% more throughout the day.",
            "Eat water-rich foods like cucumber, watermelon, or oranges to boost hydration naturally.",
            "Drink a full glass of water 30 minutes before each meal — it aids digestion and helps you stay on track.",
          ]
        }} />
        <MetricCard icon={Trophy} label="Streak" value="14 days" subtitle="Personal best!" colorClass="text-health-progress" glowClass="health-glow-progress" goalTip={{
          summary: "Amazing! You're on a 14-day streak — your personal best! Next milestone: 21 days (3 weeks)!",
          progress: 67,
          tips: [
            "You're 7 days away from a 3-week streak. Keep completing your daily goals to maintain it!",
            "Consistency beats intensity — even light activity on tough days keeps your streak alive.",
            "Share your streak with friends for accountability. Social commitment increases success by 65%.",
            "Reward yourself at the 21-day mark — it takes roughly 21 days to form a lasting habit.",
          ]
        }} />
        <MetricCard icon={Activity} label="SpO2" value="98%" subtitle="Blood Oxygen" colorClass="text-health-heart" glowClass="health-glow-heart" onInfo={() => setShowExplanation(showExplanation === "spo2" ? null : "spo2")} goalTip={{
          summary: "Your SpO2 is 98% — excellent! Normal range is 95-100%. You're well-oxygenated.",
          progress: 98,
          tips: [
            "Practice deep diaphragmatic breathing to maintain great oxygen levels throughout the day.",
            "Regular aerobic exercise improves your body's ability to utilize oxygen efficiently.",
            "If you ever see SpO2 drop below 94%, take slow deep breaths and monitor — consult a doctor if it persists.",
            "Spending time outdoors in fresh air helps maintain healthy blood oxygen saturation.",
          ]
        }} />
        <MetricCard icon={Wind} label="Resp Rate" value="16 brpm" subtitle="Normal range" colorClass="text-health-sleep" glowClass="health-glow-sleep" onInfo={() => setShowExplanation(showExplanation === "respiratory" ? null : "respiratory")} goalTip={{
          summary: "Your respiratory rate is 16 breaths/min — within normal range (12-20). Aim for 12-14 for peak relaxation.",
          progress: 75,
          tips: [
            "Try box breathing (4 seconds in, 4 hold, 4 out, 4 hold) to train slower, deeper breaths.",
            "Yoga and meditation practitioners often have resting rates of 10-14 breaths per minute.",
            "Slower breathing activates your parasympathetic nervous system, reducing stress and anxiety.",
            "Practice 5 minutes of controlled breathing before bed to lower your respiratory rate and improve sleep.",
          ]
        }} />
        <MetricCard icon={MapPin} label="Distance" value="5.2 km" subtitle="Today" colorClass="text-health-steps" glowClass="health-glow-steps" onInfo={() => setShowExplanation(showExplanation === "distance" ? null : "distance")} goalTip={{
          summary: "You've covered 5.2 km today — you need 2.8 km more to hit your 8 km daily target!",
          progress: 65,
          tips: [
            "An evening 25-minute jog at moderate pace covers about 3 km — enough to smash your goal.",
            "Try walking to nearby errands instead of driving. A 15-minute walk covers about 1.2 km.",
            "Explore a new route in your neighborhood — novelty makes walking feel less like a chore.",
            "If you have a dog, an extra evening walk adds 1-2 km and keeps both of you healthier.",
          ]
        }} />
        <MetricCard icon={Brain} label="Body Comp" value="22% BF" subtitle="Lean: 65 kg" colorClass="text-health-progress" glowClass="health-glow-progress" onInfo={() => setShowExplanation(showExplanation === "body" ? null : "body")} goalTip={{
          summary: "Your body fat is 22% with 65 kg lean mass. For athletic fitness, aim for 15-20% body fat.",
          progress: 78,
          tips: [
            "Focus on strength training 3-4x per week to build lean mass — muscle burns more calories at rest.",
            "Eat 1.6-2.2g of protein per kg of body weight daily to support muscle growth and fat loss.",
            "Reduce refined carbs and sugars — they contribute to fat storage more than whole food alternatives.",
            "Track body composition monthly rather than daily. Changes in fat% take 4-6 weeks to show reliably.",
          ]
        }} />
      </div>

      {/* Simple Explanation Popup */}
      {showExplanation && explanations[showExplanation] && (
        <div className="glass-card rounded-2xl p-4 mt-3 border border-primary/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary mb-1">What does this mean?</p>
              <p className="text-xs text-muted-foreground">{explanations[showExplanation]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resting Health Guidance */}
      <div className="glass-card rounded-3xl p-4 mt-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">🧘 Resting Health Guidance</p>
        <p className="text-sm">Your resting heart rate is <span className="font-semibold text-health-heart">72 bpm</span> — within a healthy range. Try deep breathing exercises to lower it further. Aim for 7-9 hours of sleep tonight.</p>
      </div>

      {/* Daily/Monthly/Yearly Wrapped Preview */}
      <div className="glass-card rounded-3xl p-4 mt-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-health-progress" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Score Wrapped</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Today</p>
            <p className="text-lg font-bold text-health-progress">82</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">This Month</p>
            <p className="text-lg font-bold text-health-steps">78</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">This Year</p>
            <p className="text-lg font-bold text-health-calories">75</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
