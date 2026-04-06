import { Dumbbell, Timer, Flame, TrendingUp, Play } from "lucide-react";

const workouts = [
  { name: "Morning HIIT", duration: "20 min", calories: "250 cal", intensity: "High", color: "text-health-heart" },
  { name: "Strength Training", duration: "45 min", calories: "380 cal", intensity: "Medium", color: "text-health-calories" },
  { name: "Evening Yoga", duration: "30 min", calories: "120 cal", intensity: "Low", color: "text-health-sleep" },
  { name: "Cardio Blast", duration: "25 min", calories: "300 cal", intensity: "High", color: "text-health-steps" },
];

const WorkoutPage = () => {
  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Today's Plan</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-health-calories" /> Workouts
        </h1>
      </div>

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
    </div>
  );
};

export default WorkoutPage;
