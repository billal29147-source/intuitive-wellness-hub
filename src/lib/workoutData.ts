import { HealthMetrics } from "@/contexts/HealthDataContext";
import { UserProfile } from "@/contexts/AuthContext";

export interface WorkoutDetail {
  name: string;
  duration: string;
  calories: string;
  caloriesNum: number;
  intensity: "High" | "Medium" | "Low";
  color: string;
  description: string;
  bestFor: string[];
  tips: string[];
  styles: UserProfile["workoutStyle"][]; // matching workout styles
  goals: UserProfile["goal"][];
}

const ALL_WORKOUTS: WorkoutDetail[] = [
  {
    name: "Morning HIIT",
    duration: "20 min", calories: "250 cal", caloriesNum: 250,
    intensity: "High", color: "text-health-heart",
    description: "Short bursts of max effort followed by rest. Excellent for fat burn and VO2 max.",
    bestFor: ["Burning calories fast", "Improving VO2 max", "Time-crunched mornings"],
    tips: ["Warm up 3-5 min before starting.", "Use 30s on / 15s rest for beginners.", "Hydrate before and after.", "Avoid HIIT 2 days in a row."],
    styles: ["hiit", "cardio", "mixed"], goals: ["lose", "maintain"],
  },
  {
    name: "Strength Training",
    duration: "45 min", calories: "380 cal", caloriesNum: 380,
    intensity: "Medium", color: "text-health-calories",
    description: "Resistance training to build muscle, raise metabolism, and improve bone density.",
    bestFor: ["Building lean mass", "Boosting resting metabolism", "Long-term fat loss"],
    tips: ["1.6-2.2g protein/kg on training days.", "Progressive overload weekly.", "Focus on compound lifts.", "Rest 48h between same muscle group."],
    styles: ["strength", "mixed"], goals: ["gain", "maintain", "lose"],
  },
  {
    name: "Hypertrophy Push/Pull/Legs",
    duration: "60 min", calories: "420 cal", caloriesNum: 420,
    intensity: "Medium", color: "text-health-calories",
    description: "Higher-volume strength split focused on muscle growth.",
    bestFor: ["Maximum muscle growth", "Bulking phase", "Intermediate lifters"],
    tips: ["8-12 reps in the hypertrophy zone.", "Eat in a 200-400 cal surplus.", "Sleep 8h+ for recovery.", "Progress every 1-2 weeks."],
    styles: ["strength"], goals: ["gain"],
  },
  {
    name: "Evening Yoga",
    duration: "30 min", calories: "120 cal", caloriesNum: 120,
    intensity: "Low", color: "text-health-sleep",
    description: "Gentle stretching and breathwork to lower cortisol and improve flexibility.",
    bestFor: ["Stress relief", "Better sleep", "Recovery days"],
    tips: ["Best done 1-2 hours before bed.", "4 sec in, 6 sec out breathing.", "Hold poses 5+ breaths.", "Pair with magnesium for muscle relaxation."],
    styles: ["yoga", "mixed"], goals: ["maintain", "lose", "gain"],
  },
  {
    name: "Zone 2 Cardio",
    duration: "40 min", calories: "320 cal", caloriesNum: 320,
    intensity: "Medium", color: "text-health-steps",
    description: "Steady-state cardio at 60-70% max HR — builds aerobic base and burns fat.",
    bestFor: ["Heart health", "Fat oxidation", "Endurance base"],
    tips: ["Conversational pace — you can talk in full sentences.", "Great low-stress option.", "Aim 2-3x per week.", "Walk briskly, cycle, or swim."],
    styles: ["cardio", "mixed"], goals: ["lose", "maintain"],
  },
  {
    name: "Cardio Blast",
    duration: "25 min", calories: "300 cal", caloriesNum: 300,
    intensity: "High", color: "text-health-steps",
    description: "Sustained high cardiovascular effort at 70-85% max heart rate.",
    bestFor: ["Heart health", "Endurance", "Calorie burn"],
    tips: ["Stay in zone 2-3 for fat burning.", "Mix steady-state and intervals.", "Don't skip the cool-down.", "Pair with strength training."],
    styles: ["cardio", "hiit", "mixed"], goals: ["lose", "maintain"],
  },
  {
    name: "Mobility & Stretch",
    duration: "20 min", calories: "80 cal", caloriesNum: 80,
    intensity: "Low", color: "text-health-sleep",
    description: "Joint mobility, dynamic stretches, and foam rolling for recovery.",
    bestFor: ["Recovery days", "Injury prevention", "Reducing soreness"],
    tips: ["Move slowly through ranges of motion.", "Spend 30s+ per stretch.", "Foam roll tight spots first.", "Breathe through holds."],
    styles: ["yoga", "mixed", "strength"], goals: ["maintain", "gain", "lose"],
  },
];

export function getPersonalizedWorkouts(p?: UserProfile | null): WorkoutDetail[] {
  if (!p) return ALL_WORKOUTS.slice(0, 4);
  const styleMatch = ALL_WORKOUTS.filter((w) => w.styles.includes(p.workoutStyle));
  const goalMatch = ALL_WORKOUTS.filter((w) => w.goals.includes(p.goal) && !styleMatch.includes(w));
  const combined = [...styleMatch, ...goalMatch];
  // Always include a recovery option
  const recovery = ALL_WORKOUTS.find((w) => w.intensity === "Low" && !combined.includes(w));
  if (recovery) combined.push(recovery);
  return combined.slice(0, 5);
}

export function getRecommendedWorkout(m: HealthMetrics, p?: UserProfile | null): { workout: WorkoutDetail; reason: string } {
  const list = getPersonalizedWorkouts(p);

  // Recovery override
  if (m.sleepHours < 6 || m.heartRate > 90) {
    const recovery = list.find((w) => w.intensity === "Low") || ALL_WORKOUTS.find((w) => w.name === "Evening Yoga")!;
    const reason = m.sleepHours < 6
      ? `You only slept ${m.sleepHours}h ${m.sleepMinutes}m — your body needs recovery today, not intensity.`
      : `Your resting heart rate is ${m.heartRate} bpm — focus on calming, low-intensity movement.`;
    return { workout: recovery, reason };
  }

  // Goal-driven primary pick
  const primary = list[0] || ALL_WORKOUTS[0];
  const goalReason = p
    ? `Your ${p.workoutStyle} preference and ${p.goal} goal make this a great match. Sleep (${m.sleepHours}h) and heart rate (${m.heartRate} bpm) look ready.`
    : `Your sleep (${m.sleepHours}h) and heart rate (${m.heartRate} bpm) are great — perfect for high intensity!`;
  return { workout: primary, reason: goalReason };
}
