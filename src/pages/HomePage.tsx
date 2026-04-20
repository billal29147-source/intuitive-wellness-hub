import { Footprints, Heart, Moon, Flame, Droplets, Trophy, Dumbbell, UtensilsCrossed, Gamepad2, Wind, Activity, MapPin, Brain, Info, Calendar } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import HealthRing from "@/components/HealthRing";
import { useState } from "react";
import { useHealthData } from "@/contexts/HealthDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { calcBMI, bmiCategory } from "@/lib/profileMath";
import { getStepsTip, getHeartTip, getSleepTip, getCaloriesTip, getWaterTip, getStreakTip, getSpo2Tip, getRespTip, getDistanceTip, getBodyCompTip, getHealthScoreTip } from "@/lib/healthTips";

interface HomePageProps {
  onNavigate: (page: number) => void;
}

const navIcons = [
  { icon: Dumbbell, label: "Workouts", page: 1, color: "text-health-calories" },
  { icon: UtensilsCrossed, label: "Food", page: 2, color: "text-health-hydration" },
  { icon: Gamepad2, label: "Games", page: 3, color: "text-health-progress" },
  { icon: Trophy, label: "Compete", page: 3, color: "text-health-heart" },
];

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

const HomePage = ({ onNavigate }: HomePageProps) => {
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const { metrics, updateMetric, getStatusColor, getStatusLabel } = useHealthData();
  const { user } = useAuth();
  const scoreInfo = getHealthScoreTip(metrics);
  const bmi = user ? calcBMI(user) : null;
  const bmiCat = bmi !== null ? bmiCategory(bmi) : null;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  const moveProgress = Math.round((metrics.activeCalories / metrics.caloriesGoal) * 100);
  const dailyProgress = Math.round((moveProgress + Math.min(100, Math.round((metrics.steps / metrics.stepsGoal) * 100))) / 2);

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">{greeting}, {user?.name || "Friend"}</p>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
          {bmi !== null && bmiCat && (
            <p className={`text-[11px] mt-0.5 ${bmiCat.color}`}>BMI {bmi.toFixed(1)} · {bmiCat.label} · Goal: {user?.goal}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">⌚</span>
        </div>
      </div>

      {/* Daily Health Score */}
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
          <HealthRing progress={metrics.healthScore} size={80} strokeWidth={7} color="hsl(var(--health-progress))">
            <p className="text-lg font-bold">{metrics.healthScore}</p>
          </HealthRing>
          <div className="flex-1">
            <p className="text-xl font-bold text-health-progress">{scoreInfo.label}</p>
            <p className="text-xs text-muted-foreground mt-1">Tap any metric below to customize & get tips</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  const val = prompt("Enter your health score (0-100):", String(metrics.healthScore));
                  if (val) updateMetric("healthScore", Math.max(0, Math.min(100, parseInt(val) || 0)));
                }}
                className="text-[10px] bg-health-progress/20 text-health-progress px-2 py-0.5 rounded-full"
              >
                ✏️ Edit Score
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Ring */}
      <div className="glass-card rounded-3xl p-6 mb-5 flex items-center gap-6">
        <HealthRing progress={dailyProgress} size={100} strokeWidth={8} color="hsl(var(--primary))">
          <div className="text-center">
            <p className="text-lg font-bold">{dailyProgress}%</p>
            <p className="text-[10px] text-muted-foreground">Daily</p>
          </div>
        </HealthRing>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-steps" />
            <span className="text-xs text-muted-foreground flex-1">Move</span>
            <span className="text-xs font-medium">{metrics.activeCalories} / {metrics.caloriesGoal} cal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-heart" />
            <span className="text-xs text-muted-foreground flex-1">Steps</span>
            <span className="text-xs font-medium">{metrics.steps.toLocaleString()} / {metrics.stepsGoal.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-sleep" />
            <span className="text-xs text-muted-foreground flex-1">Water</span>
            <span className="text-xs font-medium">{metrics.water} / {metrics.waterGoal} glasses</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Icons */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {navIcons.map((item) => (
          <button key={item.label} onClick={() => onNavigate(item.page)} className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
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
        <MetricCard icon={Footprints} label="Steps" value={metrics.steps.toLocaleString()} subtitle={`Goal: ${metrics.stepsGoal.toLocaleString()}`} colorClass="text-health-steps" glowClass="health-glow-steps"
          onInfo={() => setShowExplanation(showExplanation === "steps" ? null : "steps")}
          goalTip={getStepsTip(metrics)}
          editable={{ fields: [
            { key: "steps", label: "Steps", value: metrics.steps, unit: "steps", min: 0, max: 100000 },
            { key: "stepsGoal", label: "Goal", value: metrics.stepsGoal, unit: "steps", min: 1000, max: 100000 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Heart} label="Heart" value={`${metrics.heartRate} bpm`} subtitle={getStatusLabel("heartRate")} colorClass={getStatusColor("heartRate")} glowClass="health-glow-heart"
          onInfo={() => setShowExplanation(showExplanation === "heart" ? null : "heart")}
          goalTip={getHeartTip(metrics)}
          statusLabel={getStatusLabel("heartRate")} statusColor={getStatusColor("heartRate")}
          editable={{ fields: [
            { key: "heartRate", label: "BPM", value: metrics.heartRate, unit: "bpm", min: 20, max: 250 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Moon} label="Sleep" value={`${metrics.sleepHours}h ${metrics.sleepMinutes}m`} subtitle={`Deep: ${metrics.deepSleepHours}h ${metrics.deepSleepMinutes}m`} colorClass="text-health-sleep" glowClass="health-glow-sleep"
          onInfo={() => setShowExplanation(showExplanation === "sleep" ? null : "sleep")}
          goalTip={getSleepTip(metrics)}
          editable={{ fields: [
            { key: "sleepHours", label: "Hours", value: metrics.sleepHours, unit: "hrs", min: 0, max: 24 },
            { key: "sleepMinutes", label: "Minutes", value: metrics.sleepMinutes, unit: "min", min: 0, max: 59 },
            { key: "deepSleepHours", label: "Deep hrs", value: metrics.deepSleepHours, unit: "hrs", min: 0, max: 12 },
            { key: "deepSleepMinutes", label: "Deep min", value: metrics.deepSleepMinutes, unit: "min", min: 0, max: 59 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Flame} label="Calories" value={metrics.calories.toLocaleString()} subtitle={`Active: ${metrics.activeCalories}`} colorClass="text-health-calories" glowClass="health-glow-calories"
          onInfo={() => setShowExplanation(showExplanation === "calories" ? null : "calories")}
          goalTip={getCaloriesTip(metrics)}
          editable={{ fields: [
            { key: "calories", label: "Total", value: metrics.calories, unit: "cal", min: 0 },
            { key: "activeCalories", label: "Active", value: metrics.activeCalories, unit: "cal", min: 0 },
            { key: "caloriesGoal", label: "Goal", value: metrics.caloriesGoal, unit: "cal", min: 100 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Droplets} label="Water" value={`${metrics.water} / ${metrics.waterGoal}`} subtitle="Glasses" colorClass="text-health-hydration" glowClass="health-glow-steps"
          goalTip={getWaterTip(metrics)}
          editable={{ fields: [
            { key: "water", label: "Glasses", value: metrics.water, unit: "glasses", min: 0, max: 20 },
            { key: "waterGoal", label: "Goal", value: metrics.waterGoal, unit: "glasses", min: 1, max: 20 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Trophy} label="Streak" value={`${metrics.streak} days`} subtitle={metrics.streak >= 14 ? "Personal best!" : "Keep going!"} colorClass="text-health-progress" glowClass="health-glow-progress"
          goalTip={getStreakTip(metrics)}
          editable={{ fields: [
            { key: "streak", label: "Days", value: metrics.streak, unit: "days", min: 0 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Activity} label="SpO2" value={`${metrics.spo2}%`} subtitle="Blood Oxygen" colorClass={getStatusColor("spo2")} glowClass="health-glow-heart"
          onInfo={() => setShowExplanation(showExplanation === "spo2" ? null : "spo2")}
          goalTip={getSpo2Tip(metrics)}
          statusLabel={getStatusLabel("spo2")} statusColor={getStatusColor("spo2")}
          editable={{ fields: [
            { key: "spo2", label: "SpO2", value: metrics.spo2, unit: "%", min: 50, max: 100 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Wind} label="Resp Rate" value={`${metrics.respRate} brpm`} subtitle={getStatusLabel("respRate")} colorClass={getStatusColor("respRate")} glowClass="health-glow-sleep"
          onInfo={() => setShowExplanation(showExplanation === "respiratory" ? null : "respiratory")}
          goalTip={getRespTip(metrics)}
          statusLabel={getStatusLabel("respRate")} statusColor={getStatusColor("respRate")}
          editable={{ fields: [
            { key: "respRate", label: "Rate", value: metrics.respRate, unit: "brpm", min: 4, max: 40 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={MapPin} label="Distance" value={`${metrics.distance} km`} subtitle="Today" colorClass="text-health-steps" glowClass="health-glow-steps"
          onInfo={() => setShowExplanation(showExplanation === "distance" ? null : "distance")}
          goalTip={getDistanceTip(metrics)}
          editable={{ fields: [
            { key: "distance", label: "Distance", value: metrics.distance, unit: "km", min: 0, max: 100, step: 0.1 },
            { key: "distanceGoal", label: "Goal", value: metrics.distanceGoal, unit: "km", min: 1, max: 100, step: 0.1 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
        <MetricCard icon={Brain} label="Body Comp" value={`${metrics.bodyFat}% BF`} subtitle={`Lean: ${metrics.leanMass} kg`} colorClass="text-health-progress" glowClass="health-glow-progress"
          onInfo={() => setShowExplanation(showExplanation === "body" ? null : "body")}
          goalTip={getBodyCompTip(metrics)}
          editable={{ fields: [
            { key: "bodyFat", label: "Body Fat", value: metrics.bodyFat, unit: "%", min: 3, max: 60 },
            { key: "leanMass", label: "Lean Mass", value: metrics.leanMass, unit: "kg", min: 20, max: 150 },
          ], onSave: (k, v) => updateMetric(k as any, v) }}
        />
      </div>

      {/* Explanation Popup */}
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
        <p className="text-sm">
          Your resting heart rate is <span className={`font-semibold ${getStatusColor("heartRate")}`}>{metrics.heartRate} bpm</span> — {getStatusLabel("heartRate").toLowerCase()}.
          {metrics.heartRate > 80 ? " Try deep breathing exercises and reduce caffeine to lower it." : metrics.heartRate < 50 ? " This is very low — consult a doctor if you're not an athlete." : " Try deep breathing exercises to optimize it further."}
          {` Aim for ${metrics.sleepHours < 7 ? "at least 7-9" : "7-9"} hours of sleep tonight.`}
        </p>
      </div>

      {/* Score Wrapped */}
      <div className="glass-card rounded-3xl p-4 mt-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-health-progress" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Score Wrapped</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Today</p>
            <p className="text-lg font-bold text-health-progress">{metrics.healthScore}</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">This Month</p>
            <p className="text-lg font-bold text-health-steps">{Math.round(metrics.healthScore * 0.95)}</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">This Year</p>
            <p className="text-lg font-bold text-health-calories">{Math.round(metrics.healthScore * 0.91)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
