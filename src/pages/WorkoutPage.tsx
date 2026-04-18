import { Dumbbell, Timer, Flame, TrendingUp, Play, Zap, Heart, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useHealthData } from "@/contexts/HealthDataContext";
import ExpandableTipCard from "@/components/ExpandableTipCard";

interface WorkoutDetail {
  name: string;
  duration: string;
  calories: string;
  caloriesNum: number;
  intensity: "High" | "Medium" | "Low";
  color: string;
  description: string;
  bestFor: string[];
  tips: string[];
}

const workouts: WorkoutDetail[] = [
  {
    name: "Morning HIIT",
    duration: "20 min",
    calories: "250 cal",
    caloriesNum: 250,
    intensity: "High",
    color: "text-health-heart",
    description: "High-Intensity Interval Training: short bursts of max effort followed by brief rest. Excellent for fat burn and cardiovascular fitness.",
    bestFor: ["Burning calories fast", "Improving VO2 max", "Time-crunched mornings"],
    tips: [
      "Warm up 3-5 min before starting — prevents injury.",
      "Use a 30s on / 15s rest pattern for beginners.",
      "Hydrate before and after — HIIT depletes electrolytes.",
      "Don't do HIIT 2 days in a row — your body needs recovery.",
    ],
  },
  {
    name: "Strength Training",
    duration: "45 min",
    calories: "380 cal",
    caloriesNum: 380,
    intensity: "Medium",
    color: "text-health-calories",
    description: "Resistance training using weights or bodyweight to build muscle, increase metabolism, and improve bone density.",
    bestFor: ["Building lean mass", "Boosting resting metabolism", "Long-term fat loss"],
    tips: [
      "Aim for 1.6-2.2g protein per kg of body weight on training days.",
      "Progressive overload: add a small weight or rep each week.",
      "Compound lifts (squat, deadlift, bench) give the most return.",
      "Rest 48 hours between training the same muscle group.",
    ],
  },
  {
    name: "Evening Yoga",
    duration: "30 min",
    calories: "120 cal",
    caloriesNum: 120,
    intensity: "Low",
    color: "text-health-sleep",
    description: "Gentle stretching, breathwork, and mindfulness to lower cortisol, improve flexibility, and prepare the body for sleep.",
    bestFor: ["Stress relief", "Better sleep quality", "Recovery days"],
    tips: [
      "Best done 1-2 hours before bed for sleep benefits.",
      "Focus on slow, deep breathing — 4 sec in, 6 sec out.",
      "Hold each pose for 5+ breaths to deepen the stretch.",
      "Pair with magnesium supplement for muscle relaxation.",
    ],
  },
  {
    name: "Cardio Blast",
    duration: "25 min",
    calories: "300 cal",
    caloriesNum: 300,
    intensity: "High",
    color: "text-health-steps",
    description: "Sustained cardiovascular effort like running, cycling, or rowing at 70-85% of max heart rate.",
    bestFor: ["Heart health", "Endurance building", "Calorie burn"],
    tips: [
      "Keep heart rate in zone 2-3 (60-80% max) for fat burning.",
      "Mix steady-state and intervals weekly for best results.",
      "Don't skip cool-down — gradually lower heart rate over 5 min.",
      "Pair with strength training to prevent muscle loss.",
    ],
  },
];

const WorkoutPage = () => {
  const [mode, setMode] = useState<"active" | "resting">("active");
  const { metrics, getStatusColor, getStatusLabel } = useHealthData();

  const getRecommendedWorkout = () => {
    if (metrics.sleepHours < 6) return workouts[2]; // Yoga
    if (metrics.heartRate > 90) return workouts[2]; // Yoga
    return workouts[0]; // HIIT
  };

  const recWorkout = getRecommendedWorkout();
  const recReason = metrics.sleepHours < 6
    ? `You only slept ${metrics.sleepHours}h ${metrics.sleepMinutes}m — your body needs lower intensity recovery today.`
    : metrics.heartRate > 90
      ? `Your resting heart rate is elevated at ${metrics.heartRate} bpm — focus on calming, low-intensity movement.`
      : `Your sleep (${metrics.sleepHours}h) and heart rate (${metrics.heartRate} bpm) are great — perfect for high intensity!`;

  const recommendedTip = {
    summary: recReason,
    tips: [
      `This ${recWorkout.duration} workout will burn approximately ${recWorkout.caloriesNum} calories.`,
      `You have ${Math.max(0, metrics.caloriesGoal - metrics.activeCalories)} active cal left to hit your goal — this covers ${Math.round((recWorkout.caloriesNum / Math.max(1, metrics.caloriesGoal - metrics.activeCalories)) * 100)}% of it.`,
      ...recWorkout.tips.slice(0, 2),
    ],
    progress: Math.round((metrics.activeCalories / metrics.caloriesGoal) * 100),
  };

  const restingTip = {
    summary: `Your heart rate is ${metrics.heartRate} bpm (${getStatusLabel("heartRate")}). ${metrics.heartRate > 80 ? "Focus on bringing it down with breathwork." : "Your body is in a great resting state."}`,
    tips: [
      "Practice 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s for 5 minutes.",
      "Gentle stretching for 10 min lowers cortisol and improves flexibility.",
      `Drink ${Math.max(0, metrics.waterGoal - metrics.water)} more glasses of water today.`,
      metrics.heartRate > 90 ? "⚠️ Avoid intense activity — let your heart rate normalize first." : "A 10-min walk in nature can lower heart rate by 5-10 bpm.",
    ],
    progress: 100 - Math.min(100, Math.abs(metrics.heartRate - 65) * 2),
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
          <ExpandableTipCard
            icon={Heart}
            title="🧘 Resting Guidance"
            subtitle="Tap for personalized recovery tips"
            colorClass="text-health-sleep"
            glowClass="health-glow-sleep"
            summary={restingTip.summary}
            tips={restingTip.tips}
            progress={restingTip.progress}
          />
          <div className="grid grid-cols-2 gap-3">
            <ExpandableTipCard
              icon={Heart}
              title={`${metrics.heartRate} bpm`}
              subtitle="Heart Rate"
              colorClass={getStatusColor("heartRate")}
              summary={`Your heart rate is ${metrics.heartRate} bpm — ${getStatusLabel("heartRate")}.`}
              tips={[
                "Normal resting range is 60-100 bpm.",
                "Athletes often have rates of 40-60 bpm.",
                "Caffeine, stress, and dehydration raise heart rate.",
              ]}
            />
            <ExpandableTipCard
              icon={Heart}
              title={`${metrics.spo2}%`}
              subtitle="SpO2 — Blood Oxygen"
              colorClass={getStatusColor("spo2")}
              summary={`Your blood oxygen is ${metrics.spo2}% — ${getStatusLabel("spo2")}.`}
              tips={[
                "Healthy range: 95-100%.",
                "Below 90% requires medical attention.",
                "Deep breathing improves oxygen saturation.",
              ]}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Recommended Workout - Clickable */}
          <div className="mb-5">
            <ExpandableTipCard
              icon={Play}
              title={`Recommended: ${recWorkout.name}`}
              subtitle={`${recWorkout.duration} · ${recWorkout.calories} · ${recWorkout.intensity} intensity`}
              colorClass="text-health-calories"
              glowClass="health-glow-calories"
              summary={recommendedTip.summary}
              tips={recommendedTip.tips}
              progress={recommendedTip.progress}
              rightContent={
                <div className="w-10 h-10 rounded-full bg-health-calories/20 flex items-center justify-center mr-1">
                  <Play className="w-4 h-4 text-health-calories ml-0.5" />
                </div>
              }
            />
          </div>

          {/* Workout List - Clickable with Details */}
          <p className="text-sm font-semibold text-muted-foreground mb-3">All Workouts · Tap for details</p>
          <div className="space-y-2 mb-5">
            {workouts.map((w) => (
              <ExpandableTipCard
                key={w.name}
                icon={Dumbbell}
                title={w.name}
                subtitle={`${w.duration} · ${w.calories} · ${w.intensity}`}
                colorClass={w.color}
                summary={w.description}
                tips={[
                  `Best for: ${w.bestFor.join(", ")}.`,
                  `This burns ~${w.caloriesNum} cal — ${Math.round((w.caloriesNum / Math.max(1, metrics.caloriesGoal - metrics.activeCalories)) * 100)}% of your remaining ${Math.max(0, metrics.caloriesGoal - metrics.activeCalories)} cal goal.`,
                  ...w.tips,
                ]}
                rightContent={<span className={`text-xs font-medium ${w.color} mr-1`}>{w.intensity}</span>}
              />
            ))}
          </div>

          {/* Daily Results - Clickable */}
          <ExpandableTipCard
            icon={TrendingUp}
            title="📊 Daily Results"
            subtitle={`${metrics.activeCalories} / ${metrics.caloriesGoal} active cal burned`}
            colorClass="text-health-steps"
            summary={metrics.activeCalories >= metrics.caloriesGoal
              ? `Goal Complete! You've burned ${metrics.activeCalories} active calories today. 🎉`
              : `You've completed ${Math.round((metrics.activeCalories / metrics.caloriesGoal) * 100)}% of your calorie goal — ${metrics.caloriesGoal - metrics.activeCalories} cal to go.`}
            tips={[
              `A ${recWorkout.duration} ${recWorkout.name} would close ${Math.round((recWorkout.caloriesNum / Math.max(1, metrics.caloriesGoal - metrics.activeCalories)) * 100)}% of your remaining gap.`,
              "10,000 steps burns roughly 300-500 calories depending on weight.",
              "Active calories don't include resting metabolic rate.",
              "Consistency over intensity — aim to hit goal 5+ days per week.",
            ]}
            progress={Math.round((metrics.activeCalories / metrics.caloriesGoal) * 100)}
          />

          {/* Weekly Stats */}
          <div className="glass-card rounded-3xl p-5 mt-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">This Week</p>
            <div className="flex justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={day + i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 rounded-full ${i < 5 ? "bg-health-calories/30" : "bg-muted"}`} style={{ height: `${20 + ((i * 17) % 40)}px` }} />
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
