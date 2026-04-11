import { Dumbbell, Timer, Flame, TrendingUp, Play, Zap, Heart, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useHealthData } from "@/contexts/HealthDataContext";

const workouts = [
  { name: "Morning HIIT", duration: "20 min", calories: "250 cal", intensity: "High", color: "text-health-heart" },
  { name: "Strength Training", duration: "45 min", calories: "380 cal", intensity: "Medium", color: "text-health-calories" },
  { name: "Evening Yoga", duration: "30 min", calories: "120 cal", intensity: "Low", color: "text-health-sleep" },
  { name: "Cardio Blast", duration: "25 min", calories: "300 cal", intensity: "High", color: "text-health-steps" },
];

const WorkoutPage = () => {
  const [mode, setMode] = useState<"active" | "resting">("active");
  const { metrics, getStatusColor, getStatusLabel } = useHealthData();

  const getSmartRecs = () => {
    const recs: string[] = [];
    if (metrics.sleepHours < 6) recs.push("You slept less than 6 hours — consider a light workout today instead of high intensity.");
    else if (metrics.sleepHours >= 8) recs.push("Great sleep last night! You're primed for a high-intensity workout.");
    else recs.push("Based on your sleep data, a moderate workout is recommended today.");

    if (metrics.heartRate > 90) recs.push("Your resting heart rate is elevated — start with a warm-up and monitor how you feel.");
    else if (metrics.heartRate < 55) recs.push("Your low resting heart rate suggests great fitness — try pushing your limits today!");

    if (metrics.activeCalories < metrics.caloriesGoal * 0.3) recs.push(`You've only burned ${metrics.activeCalories} active cal — a workout now would help close your ${metrics.caloriesGoal} cal goal.`);
    if (metrics.water < metrics.waterGoal / 2) recs.push("⚠️ You're behind on hydration — drink water before and during your workout.");

    return recs;
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Today's Plan</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-health-calories" /> Workouts
        </h1>
      </div>

      {/* Mode Toggle */}
      <div className="glass-card rounded-2xl p-1 mb-5 flex">
        <button onClick={() => setMode("active")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === "active" ? "bg-health-calories/20 text-health-calories" : "text-muted-foreground"}`}>
          <Zap className="w-4 h-4" /> Active Mode
        </button>
        <button onClick={() => setMode("resting")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === "resting" ? "bg-health-sleep/20 text-health-sleep" : "text-muted-foreground"}`}>
          <Heart className="w-4 h-4" /> Resting Mode
        </button>
      </div>

      {mode === "resting" ? (
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 health-glow-sleep">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">🧘 Resting Guidance</p>
            <div className="space-y-3">
              <p className="text-sm">
                Your heart rate is <span className={`font-semibold ${getStatusColor("heartRate")}`}>{metrics.heartRate} bpm</span> ({getStatusLabel("heartRate")}).
                {metrics.heartRate > 80 ? " Focus on deep breathing to bring it down." : " Your body is in a good resting state."}
              </p>
              <div className="space-y-2">
                {metrics.heartRate > 90 && (
                  <div className="flex items-start gap-2">
                    <span className="text-health-heart text-xs mt-0.5">⚠️</span>
                    <p className="text-xs text-muted-foreground">Heart rate is elevated — avoid intense activity and practice relaxation.</p>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-health-sleep text-xs mt-0.5">●</span>
                  <p className="text-xs text-muted-foreground">Deep breathing: 4-7-8 technique for 5 minutes</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-health-sleep text-xs mt-0.5">●</span>
                  <p className="text-xs text-muted-foreground">Gentle stretching for 10 minutes</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-health-sleep text-xs mt-0.5">●</span>
                  <p className="text-xs text-muted-foreground">Stay hydrated — drink {Math.max(0, metrics.waterGoal - metrics.water)} more glasses of water</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Vitals</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Heart Rate</p>
                <p className={`text-lg font-bold ${getStatusColor("heartRate")}`}>{metrics.heartRate} bpm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SpO2</p>
                <p className={`text-lg font-bold ${getStatusColor("spo2")}`}>{metrics.spo2}%</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-3xl p-5 mb-5 health-glow-calories">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Recommended</p>
                <p className="text-lg font-bold mt-1">{metrics.sleepHours < 6 ? "Light Yoga" : metrics.heartRate > 90 ? "Moderate Walk" : "Morning HIIT"}</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-health-calories/20 flex items-center justify-center active:scale-95 transition-transform">
                <Play className="w-5 h-5 text-health-calories ml-0.5" />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{metrics.sleepHours < 6 ? "15 min" : "20 min"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{Math.max(0, metrics.caloriesGoal - metrics.activeCalories)} cal left</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{metrics.sleepHours < 6 ? "Low" : metrics.heartRate > 90 ? "Low" : "High"}</span>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="glass-card rounded-2xl p-4 mb-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Smart Recommendations
            </p>
            <div className="space-y-2">
              {getSmartRecs().map((rec, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-health-calories mt-0.5">→</span> {rec}
                </p>
              ))}
            </div>
          </div>

          {/* Workout List */}
          <p className="text-sm font-semibold text-muted-foreground mb-3">All Workouts</p>
          <div className="space-y-3">
            {workouts.map((w) => (
              <div key={w.name} className="glass-card rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform">
                <div>
                  <p className="font-medium text-sm">{w.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{w.duration}</span>
                    <span className="text-xs text-muted-foreground">{w.calories}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium ${w.color}`}>{w.intensity}</span>
              </div>
            ))}
          </div>

          {/* Daily Results */}
          <div className="glass-card rounded-3xl p-5 mt-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">📊 Daily Results & Tips</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-health-steps/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-health-steps" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {metrics.activeCalories >= metrics.caloriesGoal ? "Goal Complete! 🎉" : `${Math.round((metrics.activeCalories / metrics.caloriesGoal) * 100)}% of calorie goal done`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.activeCalories}/{metrics.caloriesGoal} active calories burned
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="glass-card rounded-3xl p-5 mt-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">This Week</p>
            <div className="flex justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={day + i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 rounded-full ${i < 5 ? "bg-health-calories/30" : "bg-muted"}`} style={{ height: `${20 + Math.random() * 40}px` }} />
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutPage;
