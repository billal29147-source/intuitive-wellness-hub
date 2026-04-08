import { Dumbbell, Timer, Flame, TrendingUp, Play, Zap, Heart, Lightbulb } from "lucide-react";
import { useState } from "react";

const workouts = [
  { name: "Morning HIIT", duration: "20 min", calories: "250 cal", intensity: "High", color: "text-health-heart" },
  { name: "Strength Training", duration: "45 min", calories: "380 cal", intensity: "Medium", color: "text-health-calories" },
  { name: "Evening Yoga", duration: "30 min", calories: "120 cal", intensity: "Low", color: "text-health-sleep" },
  { name: "Cardio Blast", duration: "25 min", calories: "300 cal", intensity: "High", color: "text-health-steps" },
];

const smartRecommendations = [
  "Based on your sleep data, a light yoga session is recommended today.",
  "You've been inactive for 2 hours — try a 5-min stretch break!",
  "Your heart rate recovery improved 8% this week. Try increasing intensity.",
];

const WorkoutPage = () => {
  const [mode, setMode] = useState<"active" | "resting">("active");

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Today's Plan</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-health-calories" /> Workouts
        </h1>
      </div>

      {/* Active / Resting Mode Toggle */}
      <div className="glass-card rounded-2xl p-1 mb-5 flex">
        <button
          onClick={() => setMode("active")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === "active" ? "bg-health-calories/20 text-health-calories" : "text-muted-foreground"}`}
        >
          <Zap className="w-4 h-4" /> Active Mode
        </button>
        <button
          onClick={() => setMode("resting")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === "resting" ? "bg-health-sleep/20 text-health-sleep" : "text-muted-foreground"}`}
        >
          <Heart className="w-4 h-4" /> Resting Mode
        </button>
      </div>

      {mode === "resting" ? (
        /* Resting Mode Content */
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 health-glow-sleep">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">🧘 Resting Guidance</p>
            <div className="space-y-3">
              <p className="text-sm">Your body needs recovery today. Here's what we recommend:</p>
              <div className="space-y-2">
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
                  <p className="text-xs text-muted-foreground">Stay hydrated — drink 2 glasses of water</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-health-sleep text-xs mt-0.5">●</span>
                  <p className="text-xs text-muted-foreground">Avoid intense exercise for at least 6 more hours</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Vitals</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Heart Rate</p>
                <p className="text-lg font-bold text-health-heart">68 bpm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stress Level</p>
                <p className="text-lg font-bold text-health-sleep">Low</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Active Workout Card */}
          <div className="glass-card rounded-3xl p-5 mb-5 health-glow-calories">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Recommended</p>
                <p className="text-lg font-bold mt-1">Morning HIIT</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-health-calories/20 flex items-center justify-center active:scale-95 transition-transform">
                <Play className="w-5 h-5 text-health-calories ml-0.5" />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">20 min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">250 cal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
          </div>

          {/* Smart Workout Recommendations */}
          <div className="glass-card rounded-2xl p-4 mb-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Smart Recommendations
            </p>
            <div className="space-y-2">
              {smartRecommendations.map((rec, i) => (
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

          {/* Daily Results & Improvement Ideas */}
          <div className="glass-card rounded-3xl p-5 mt-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">📊 Daily Results & Tips</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-health-steps/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-health-steps" />
                </div>
                <div>
                  <p className="text-sm font-medium">Great progress today!</p>
                  <p className="text-xs text-muted-foreground">You burned 15% more calories than yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-health-heart/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-health-heart" />
                </div>
                <div>
                  <p className="text-sm font-medium">Improvement idea</p>
                  <p className="text-xs text-muted-foreground">Add 5 min cool-down stretches after HIIT sessions</p>
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
                  <div
                    className={`w-8 rounded-full ${i < 5 ? "bg-health-calories/30" : "bg-muted"}`}
                    style={{ height: `${20 + Math.random() * 40}px` }}
                  />
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
