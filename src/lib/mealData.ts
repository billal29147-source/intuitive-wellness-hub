import { HealthMetrics } from "@/contexts/HealthDataContext";

export interface Meal {
  name: string;
  time: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  ingredients: string[];
  benefits: string;
}

export const defaultMeals: Meal[] = [
  {
    name: "Oatmeal & Berries",
    time: "8:00 AM",
    type: "Breakfast",
    calories: 320,
    protein: 12,
    carbs: 54,
    fats: 7,
    fiber: 8,
    ingredients: ["Rolled oats (50g)", "Mixed berries (100g)", "Almond milk (200ml)", "Honey (1 tsp)", "Chia seeds (1 tbsp)"],
    benefits: "High fiber for sustained energy and gut health. Antioxidants from berries support recovery.",
  },
  {
    name: "Grilled Chicken Salad",
    time: "12:30 PM",
    type: "Lunch",
    calories: 450,
    protein: 42,
    carbs: 22,
    fats: 18,
    fiber: 9,
    ingredients: ["Grilled chicken breast (150g)", "Mixed greens (100g)", "Cherry tomatoes", "Avocado (½)", "Olive oil dressing"],
    benefits: "Lean protein for muscle repair, healthy fats for satiety, low glycemic load.",
  },
  {
    name: "Protein Shake",
    time: "3:00 PM",
    type: "Snack",
    calories: 180,
    protein: 25,
    carbs: 12,
    fats: 3,
    fiber: 2,
    ingredients: ["Whey protein (1 scoop)", "Banana (½)", "Almond milk (250ml)", "Ice"],
    benefits: "Quick post-workout protein delivery to maximize muscle protein synthesis.",
  },
];

export interface MealRecommendation {
  name: string;
  reason: string;
  calories: number;
  protein: number;
  type: string;
}

export function getSmartMealRecommendations(m: HealthMetrics): MealRecommendation[] {
  const recs: MealRecommendation[] = [];
  const heightM = m.height / 100;
  const bmi = m.weight / (heightM * heightM);
  const calorieDeficit = m.totalCaloriesFoodGoal - m.totalCaloriesFood;
  const proteinDeficit = m.proteinGoal - m.protein;
  const carbsRemaining = m.carbsGoal - m.carbs;
  const activeCalsLeft = m.caloriesGoal - m.activeCalories;

  // High body fat / high BMI → low-cal high-protein
  if (m.bodyFat > 25 || bmi > 27) {
    recs.push({
      name: "Zucchini Noodles with Turkey Bolognese",
      reason: `Your body fat (${m.bodyFat}%) and BMI (${bmi.toFixed(1)}) suggest a fat-loss focus. Low carb, high protein.`,
      calories: 380,
      protein: 38,
      type: "Dinner",
    });
  }

  // Need to burn more active calories → energizing pre-workout
  if (activeCalsLeft > 200) {
    recs.push({
      name: "Banana & Almond Butter Toast",
      reason: `You still need to burn ${activeCalsLeft} active cal. This gives quick + sustained energy for a workout.`,
      calories: 290,
      protein: 9,
      type: "Pre-workout",
    });
  }

  // Low protein → high protein meal
  if (proteinDeficit > m.proteinGoal * 0.4) {
    recs.push({
      name: "Greek Yogurt Bowl with Nuts",
      reason: `You need ${proteinDeficit}g more protein today. This bowl delivers 28g of complete protein.`,
      calories: 310,
      protein: 28,
      type: "Snack",
    });
  }

  // Over carb limit → low carb option
  if (m.carbs > m.carbsGoal * 0.85) {
    recs.push({
      name: "Salmon with Roasted Veggies",
      reason: `You're near your carb limit (${m.carbs}/${m.carbsGoal}g). This dinner is low-carb, high omega-3.`,
      calories: 420,
      protein: 35,
      type: "Dinner",
    });
  }

  // Low water → hydrating meal
  if (m.water < m.waterGoal / 2) {
    recs.push({
      name: "Cucumber Watermelon Salad",
      reason: `You're behind on hydration (${m.water}/${m.waterGoal} glasses). This snack is 90%+ water.`,
      calories: 90,
      protein: 2,
      type: "Snack",
    });
  }

  // Lots of calories left → balanced meal
  if (calorieDeficit > 600) {
    recs.push({
      name: "Quinoa Power Bowl",
      reason: `You have ${calorieDeficit} cal left to hit your goal. Balanced macros to fuel the rest of the day.`,
      calories: 520,
      protein: 22,
      carbs: 65,
      type: "Lunch",
    } as MealRecommendation);
  }

  // Elevated heart rate → calming foods
  if (m.heartRate > 85) {
    recs.push({
      name: "Chamomile Tea & Dark Chocolate",
      reason: `Your heart rate is ${m.heartRate} bpm — magnesium-rich dark chocolate may help calm it.`,
      calories: 110,
      protein: 2,
      type: "Snack",
    });
  }

  // Low sleep → energy + brain food
  if (m.sleepHours < 6) {
    recs.push({
      name: "Avocado Egg Toast",
      reason: `You only slept ${m.sleepHours}h ${m.sleepMinutes}m. Healthy fats and protein support focus when tired.`,
      calories: 340,
      protein: 16,
      type: "Breakfast",
    });
  }

  return recs.slice(0, 4);
}

export function getMealHealthFit(meal: Meal, m: HealthMetrics): { label: string; color: string } {
  const heightM = m.height / 100;
  const bmi = m.weight / (heightM * heightM);

  if ((m.bodyFat > 25 || bmi > 27) && meal.calories > 500) {
    return { label: "⚠️ High calorie for your goals", color: "text-health-calories" };
  }
  if (m.protein < m.proteinGoal * 0.5 && meal.protein >= 25) {
    return { label: "✓ Great for your protein gap", color: "text-health-progress" };
  }
  if (m.carbs > m.carbsGoal * 0.85 && meal.carbs > 50) {
    return { label: "⚠️ High carb — you're near limit", color: "text-health-calories" };
  }
  if (meal.protein >= 20 && meal.fiber >= 5) {
    return { label: "✓ Well-balanced for you", color: "text-health-progress" };
  }
  return { label: "Within balance", color: "text-muted-foreground" };
}
