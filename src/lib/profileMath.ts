import { UserProfile } from "@/contexts/AuthContext";

// Mifflin-St Jeor BMR
export function calcBMR(p: Pick<UserProfile, "weight" | "height" | "age" | "sex" | "units">) {
  const kg = p.units === "imperial" ? p.weight * 0.4536 : p.weight;
  const cm = p.units === "imperial" ? p.height * 2.54 : p.height;
  const base = 10 * kg + 6.25 * cm - 5 * p.age;
  return Math.round(p.sex === "female" ? base - 161 : base + 5);
}

const ACTIVITY_MULT: Record<UserProfile["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calcDailyCalorieGoal(p: UserProfile) {
  const tdee = calcBMR(p) * ACTIVITY_MULT[p.activityLevel];
  const adj = p.goal === "lose" ? -500 : p.goal === "gain" ? 350 : 0;
  return Math.round(tdee + adj);
}

export function calcActiveCalorieGoal(p: UserProfile) {
  // Aim higher for those losing weight or with very_active level
  const base = p.activityLevel === "sedentary" ? 350 : p.activityLevel === "light" ? 450 : 600;
  return p.goal === "lose" ? base + 150 : base;
}

export function calcProteinGoal(p: UserProfile) {
  const kg = p.units === "imperial" ? p.weight * 0.4536 : p.weight;
  const factor = p.goal === "gain" ? 2.0 : p.goal === "lose" ? 1.8 : 1.4;
  return Math.round(kg * factor);
}

export function calcCarbsGoal(p: UserProfile) {
  const cals = calcDailyCalorieGoal(p);
  const pct = p.goal === "lose" ? 0.4 : p.goal === "gain" ? 0.5 : 0.45;
  return Math.round((cals * pct) / 4);
}

export function calcFatsGoal(p: UserProfile) {
  const cals = calcDailyCalorieGoal(p);
  return Math.round((cals * 0.27) / 9);
}

export function calcStepsGoal(p: UserProfile) {
  return p.activityLevel === "sedentary"
    ? 7000
    : p.activityLevel === "very_active"
    ? 12000
    : 10000;
}

export function calcWaterGoal(p: UserProfile) {
  const kg = p.units === "imperial" ? p.weight * 0.4536 : p.weight;
  return Math.max(6, Math.round(kg * 0.033 * 4)); // ~4 glasses per liter
}

export function calcBMI(p: Pick<UserProfile, "weight" | "height" | "units">) {
  const kg = p.units === "imperial" ? p.weight * 0.4536 : p.weight;
  const m = (p.units === "imperial" ? p.height * 2.54 : p.height) / 100;
  return kg / (m * m);
}

export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-health-sleep" };
  if (bmi < 25) return { label: "Healthy", color: "text-health-progress" };
  if (bmi < 30) return { label: "Overweight", color: "text-health-calories" };
  return { label: "Obese", color: "text-health-heart" };
}

// Weight in user's display unit
export function displayWeight(p: UserProfile) {
  return { value: p.weight, unit: p.units === "imperial" ? "lbs" : "kg" };
}
