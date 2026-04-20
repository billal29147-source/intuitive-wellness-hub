import { Dumbbell, TrendingUp, Play, Zap, Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { useHealthData } from "@/contexts/HealthDataContext";
import { useAuth } from "@/contexts/AuthContext";
import ExpandableTipCard from "@/components/ExpandableTipCard";
import { getPersonalizedWorkouts, getRecommendedWorkout } from "@/lib/workoutData";

const WorkoutPage = () => {
  const [mode, setMode] = useState<"active" | "resting">("active");
  const { metrics, getStatusColor, getStatusLabel } = useHealthData();
  const { user } = useAuth();

  const workouts = useMemo(() => getPersonalizedWorkouts(user), [user]);
  const { workout: recWorkout, reason: recReason } = useMemo(
    () => getRecommendedWorkout(metrics, user),
    [metrics, user]
  );

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
        {user && (
          <p className="text-[11px] text-muted-foreground mt-1">
            Tailored to your <span className="text-health-progress">{user.workoutStyle}</span> style · Goal: <span className="text-health-progress">{user.goal}</span>
          </p>
        )}
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
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            {user ? `Picked for your ${user.workoutStyle} style · Tap for details` : "All Workouts · Tap for details"}
          </p>
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
