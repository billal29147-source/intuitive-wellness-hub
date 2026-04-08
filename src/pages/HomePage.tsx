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
        <MetricCard icon={Footprints} label="Steps" value="8,432" subtitle="Goal: 10,000" colorClass="text-health-steps" glowClass="health-glow-steps" onInfo={() => setShowExplanation(showExplanation === "steps" ? null : "steps")} />
        <MetricCard icon={Heart} label="Heart" value="72 bpm" subtitle="Resting" colorClass="text-health-heart" glowClass="health-glow-heart" onInfo={() => setShowExplanation(showExplanation === "heart" ? null : "heart")} />
        <MetricCard icon={Moon} label="Sleep" value="7h 24m" subtitle="Deep: 2h 10m" colorClass="text-health-sleep" glowClass="health-glow-sleep" onInfo={() => setShowExplanation(showExplanation === "sleep" ? null : "sleep")} />
        <MetricCard icon={Flame} label="Calories" value="1,847" subtitle="Active: 420" colorClass="text-health-calories" glowClass="health-glow-calories" onInfo={() => setShowExplanation(showExplanation === "calories" ? null : "calories")} />
        <MetricCard icon={Droplets} label="Water" value="6 / 8" subtitle="Glasses" colorClass="text-health-hydration" glowClass="health-glow-steps" />
        <MetricCard icon={Trophy} label="Streak" value="14 days" subtitle="Personal best!" colorClass="text-health-progress" glowClass="health-glow-progress" />
        <MetricCard icon={Activity} label="SpO2" value="98%" subtitle="Blood Oxygen" colorClass="text-health-heart" glowClass="health-glow-heart" onInfo={() => setShowExplanation(showExplanation === "spo2" ? null : "spo2")} />
        <MetricCard icon={Wind} label="Resp Rate" value="16 brpm" subtitle="Normal range" colorClass="text-health-sleep" glowClass="health-glow-sleep" onInfo={() => setShowExplanation(showExplanation === "respiratory" ? null : "respiratory")} />
        <MetricCard icon={MapPin} label="Distance" value="5.2 km" subtitle="Today" colorClass="text-health-steps" glowClass="health-glow-steps" onInfo={() => setShowExplanation(showExplanation === "distance" ? null : "distance")} />
        <MetricCard icon={Brain} label="Body Comp" value="22% BF" subtitle="Lean: 65 kg" colorClass="text-health-progress" glowClass="health-glow-progress" onInfo={() => setShowExplanation(showExplanation === "body" ? null : "body")} />
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
