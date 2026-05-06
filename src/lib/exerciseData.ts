import { UserProfile } from "@/contexts/AuthContext";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // "12" or "30s" or "10 each side"
  restSec: number;
  animId: string; // maps to CSS animation
  cue: string; // short form cue
}

interface ExercisePool {
  [workoutName: string]: (p?: UserProfile | null) => Exercise[];
}

function repRange(goal: UserProfile["goal"]): { sets: number; reps: string } {
  if (goal === "lose") return { sets: 3, reps: "15" };
  if (goal === "gain") return { sets: 4, reps: "8-10" };
  return { sets: 3, reps: "12" };
}

function cardioTime(goal: UserProfile["goal"]): string {
  if (goal === "lose") return "45s";
  if (goal === "gain") return "20s";
  return "30s";
}

const POOL: ExercisePool = {
  "Morning HIIT": (p) => {
    const t = cardioTime(p?.goal ?? "maintain");
    return [
      { id: "burpees", name: "Burpees", sets: 4, reps: t, restSec: 15, animId: "burpee", cue: "Chest to floor, explode up" },
      { id: "jump-squats", name: "Jump Squats", sets: 4, reps: t, restSec: 15, animId: "jump-squat", cue: "Squat deep, jump high" },
      { id: "mountain-climbers", name: "Mountain Climbers", sets: 4, reps: t, restSec: 15, animId: "mountain-climber", cue: "Drive knees to chest fast" },
      { id: "high-knees", name: "High Knees", sets: 4, reps: t, restSec: 15, animId: "high-knees", cue: "Knees above hip level" },
      { id: "plank-jacks", name: "Plank Jacks", sets: 3, reps: t, restSec: 20, animId: "plank-jack", cue: "Hold plank, jump feet wide" },
    ];
  },
  "Strength Training": (p) => {
    const r = repRange(p?.goal ?? "maintain");
    return [
      { id: "bench-press", name: "Bench Press", ...r, restSec: 90, animId: "bench-press", cue: "Bar to chest, press up" },
      { id: "squats", name: "Barbell Squats", ...r, restSec: 90, animId: "squat", cue: "Below parallel, drive up" },
      { id: "deadlift", name: "Deadlifts", ...r, restSec: 120, animId: "deadlift", cue: "Hinge at hips, flat back" },
      { id: "bicep-curls", name: "Bicep Curls", sets: r.sets, reps: "12", restSec: 60, animId: "bicep-curl", cue: "Control the negative" },
      { id: "overhead-press", name: "Overhead Press", ...r, restSec: 90, animId: "overhead-press", cue: "Lock out at the top" },
      { id: "rows", name: "Bent-Over Rows", ...r, restSec: 60, animId: "bent-row", cue: "Pull to lower chest" },
    ];
  },
  "Hypertrophy Push/Pull/Legs": (p) => [
    { id: "incline-press", name: "Incline Dumbbell Press", sets: 4, reps: "10-12", restSec: 75, animId: "bench-press", cue: "Squeeze at the top" },
    { id: "lat-pulldown", name: "Lat Pulldowns", sets: 4, reps: "10-12", restSec: 60, animId: "pulldown", cue: "Pull to upper chest" },
    { id: "leg-press", name: "Leg Press", sets: 4, reps: "12", restSec: 90, animId: "squat", cue: "Full range of motion" },
    { id: "lateral-raise", name: "Lateral Raises", sets: 3, reps: "15", restSec: 45, animId: "lateral-raise", cue: "Slight bend in elbows" },
    { id: "ham-curl", name: "Hamstring Curls", sets: 3, reps: "12", restSec: 60, animId: "leg-curl", cue: "Slow controlled curl" },
    { id: "cable-fly", name: "Cable Flyes", sets: 3, reps: "12-15", restSec: 45, animId: "chest-fly", cue: "Big stretch, squeeze together" },
  ],
  "Evening Yoga": () => [
    { id: "downward-dog", name: "Downward Dog", sets: 1, reps: "60s hold", restSec: 0, animId: "downward-dog", cue: "Press heels down, hips high" },
    { id: "warrior-2", name: "Warrior II", sets: 1, reps: "45s each side", restSec: 0, animId: "warrior", cue: "Front knee over ankle" },
    { id: "tree-pose", name: "Tree Pose", sets: 1, reps: "30s each side", restSec: 0, animId: "tree-pose", cue: "Fix gaze on one point" },
    { id: "childs-pose", name: "Child's Pose", sets: 1, reps: "90s hold", restSec: 0, animId: "childs-pose", cue: "Breathe into lower back" },
    { id: "pigeon", name: "Pigeon Pose", sets: 1, reps: "60s each side", restSec: 0, animId: "pigeon-pose", cue: "Sink hips forward" },
  ],
  "Zone 2 Cardio": (p) => [
    { id: "brisk-walk", name: "Brisk Walk Warm-Up", sets: 1, reps: "5 min", restSec: 0, animId: "walking", cue: "60-70% max HR" },
    { id: "jog", name: "Steady Jog", sets: 1, reps: p?.goal === "lose" ? "25 min" : "20 min", restSec: 0, animId: "running", cue: "Conversational pace" },
    { id: "incline-walk", name: "Incline Walk", sets: 1, reps: "10 min", restSec: 0, animId: "incline-walk", cue: "Steep incline, no holding rails" },
    { id: "cooldown-walk", name: "Cool-Down Walk", sets: 1, reps: "5 min", restSec: 0, animId: "walking", cue: "Slow pace, deep breaths" },
  ],
  "Cardio Blast": (p) => {
    const t = cardioTime(p?.goal ?? "maintain");
    return [
      { id: "sprint", name: "Treadmill Sprints", sets: 6, reps: t, restSec: 30, animId: "sprint", cue: "Max effort each round" },
      { id: "box-jumps", name: "Box Jumps", sets: 4, reps: "10", restSec: 30, animId: "jump-squat", cue: "Land softly, step down" },
      { id: "jump-rope", name: "Jump Rope", sets: 4, reps: t, restSec: 20, animId: "jump-rope", cue: "Stay on balls of feet" },
      { id: "rowing", name: "Rowing Machine", sets: 3, reps: "500m", restSec: 60, animId: "rowing", cue: "Legs, back, arms — in order" },
      { id: "battle-ropes", name: "Battle Ropes", sets: 3, reps: t, restSec: 30, animId: "battle-ropes", cue: "Alternate waves, tight core" },
    ];
  },
  "Mobility & Stretch": () => [
    { id: "foam-roll", name: "Foam Roll", sets: 1, reps: "5 min", restSec: 0, animId: "foam-roll", cue: "Roll slowly over tight spots" },
    { id: "hip-circles", name: "Hip Circles", sets: 2, reps: "10 each way", restSec: 0, animId: "hip-circle", cue: "Wide controlled circles" },
    { id: "cat-cow", name: "Cat-Cow", sets: 1, reps: "10 reps", restSec: 0, animId: "cat-cow", cue: "Arch then round, breathe" },
    { id: "world-greatest", name: "World's Greatest Stretch", sets: 2, reps: "5 each side", restSec: 0, animId: "lunge-twist", cue: "Lunge, rotate, reach up" },
    { id: "shoulder-pass", name: "Shoulder Pass-Throughs", sets: 2, reps: "10", restSec: 0, animId: "shoulder-pass", cue: "Wide grip, slow arc" },
  ],
};

export function getExercisesForWorkout(workoutName: string, profile?: UserProfile | null): Exercise[] {
  const factory = POOL[workoutName];
  if (!factory) return [];
  return factory(profile);
}
