import { HealthMetrics } from "@/contexts/HealthDataContext";
import { UserProfile } from "@/contexts/AuthContext";
import { calcBMI } from "@/lib/profileMath";

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
  tags?: string[]; // e.g. "vegetarian", "vegan", "gluten-free"
}

const MEAL_LIBRARY: Meal[] = [
  {
    name: "Oatmeal & Berries",
    time: "8:00 AM",
    type: "Breakfast",
    calories: 320, protein: 12, carbs: 54, fats: 7, fiber: 8,
    ingredients: ["Rolled oats (50g)", "Mixed berries (100g)", "Almond milk (200ml)", "Honey (1 tsp)", "Chia seeds (1 tbsp)"],
    benefits: "High fiber for sustained energy and gut health.",
    tags: ["vegetarian", "vegan", "dairy-free"],
  },
  {
    name: "Greek Yogurt Power Bowl",
    time: "8:00 AM",
    type: "Breakfast",
    calories: 380, protein: 28, carbs: 38, fats: 12, fiber: 6,
    ingredients: ["Greek yogurt (200g)", "Granola (30g)", "Walnuts (20g)", "Honey", "Banana"],
    benefits: "Protein-rich start to support muscle and satiety.",
    tags: ["vegetarian"],
  },
  {
    name: "Avocado Egg Toast",
    time: "8:00 AM",
    type: "Breakfast",
    calories: 340, protein: 16, carbs: 30, fats: 18, fiber: 7,
    ingredients: ["Sourdough toast", "Avocado (½)", "2 eggs", "Chili flakes"],
    benefits: "Healthy fats + protein for focus and stable energy.",
    tags: ["vegetarian"],
  },
  {
    name: "Tofu Scramble Bowl",
    time: "8:00 AM",
    type: "Breakfast",
    calories: 310, protein: 22, carbs: 28, fats: 13, fiber: 8,
    ingredients: ["Tofu (150g)", "Spinach", "Cherry tomatoes", "Nutritional yeast", "Whole grain wrap"],
    benefits: "Plant-based protein and iron for sustained energy.",
    tags: ["vegan", "vegetarian", "dairy-free"],
  },
  {
    name: "Grilled Chicken Salad",
    time: "12:30 PM",
    type: "Lunch",
    calories: 450, protein: 42, carbs: 22, fats: 18, fiber: 9,
    ingredients: ["Grilled chicken breast (150g)", "Mixed greens", "Cherry tomatoes", "Avocado", "Olive oil dressing"],
    benefits: "Lean protein for muscle repair, low glycemic load.",
    tags: ["gluten-free", "dairy-free"],
  },
  {
    name: "Quinoa Power Bowl",
    time: "12:30 PM",
    type: "Lunch",
    calories: 520, protein: 22, carbs: 65, fats: 16, fiber: 10,
    ingredients: ["Quinoa (1 cup)", "Roasted veggies", "Chickpeas", "Tahini dressing"],
    benefits: "Balanced macros and complete plant protein.",
    tags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
  },
  {
    name: "Salmon with Roasted Veggies",
    time: "7:00 PM",
    type: "Dinner",
    calories: 520, protein: 38, carbs: 28, fats: 26, fiber: 8,
    ingredients: ["Salmon (180g)", "Broccoli", "Sweet potato", "Olive oil"],
    benefits: "Omega-3s for heart, anti-inflammatory effects.",
    tags: ["gluten-free", "dairy-free"],
  },
  {
    name: "Zucchini Noodles & Turkey Bolognese",
    time: "7:00 PM",
    type: "Dinner",
    calories: 380, protein: 38, carbs: 18, fats: 14, fiber: 6,
    ingredients: ["Zucchini noodles", "Lean turkey (150g)", "Tomato sauce", "Parmesan"],
    benefits: "Low-carb high-protein — great for fat loss phases.",
    tags: ["gluten-free"],
  },
  {
    name: "Lentil & Veggie Curry",
    time: "7:00 PM",
    type: "Dinner",
    calories: 460, protein: 22, carbs: 60, fats: 12, fiber: 14,
    ingredients: ["Red lentils", "Spinach", "Coconut milk", "Curry spices", "Brown rice"],
    benefits: "High fiber, plant protein, anti-inflammatory spices.",
    tags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
  },
  {
    name: "Protein Shake",
    time: "3:00 PM",
    type: "Snack",
    calories: 180, protein: 25, carbs: 12, fats: 3, fiber: 2,
    ingredients: ["Whey protein", "Banana", "Almond milk"],
    benefits: "Quick post-workout protein.",
    tags: ["vegetarian", "gluten-free"],
  },
];

// Filter library based on dietary restrictions
function applyDiet(meals: Meal[], p?: UserProfile | null): Meal[] {
  if (!p?.dietaryRestrictions?.length) return meals;
  const restrictions = p.dietaryRestrictions.map((r) => r.toLowerCase());
  return meals.filter((m) => {
    const tags = (m.tags || []).map((t) => t.toLowerCase());
    if (restrictions.includes("vegan") && !tags.includes("vegan")) return false;
    if (restrictions.includes("vegetarian") && !tags.includes("vegetarian") && !tags.includes("vegan")) return false;
    if (restrictions.includes("gluten-free") && !tags.includes("gluten-free")) return false;
    if (restrictions.includes("dairy-free") && !tags.includes("dairy-free") && !tags.includes("vegan")) return false;
    return true;
  });
}

export function getDailyMeals(p?: UserProfile | null): Meal[] {
  const filtered = applyDiet(MEAL_LIBRARY, p);
  const pickType = (type: string) =>
    filtered.find((m) => m.type === type) || MEAL_LIBRARY.find((m) => m.type === type)!;
  return [pickType("Breakfast"), pickType("Lunch"), pickType("Snack")];
}

export const defaultMeals: Meal[] = getDailyMeals(null);

export interface MealRecommendation {
  name: string;
  reason: string;
  calories: number;
  protein: number;
  type: string;
}

export function getSmartMealRecommendations(m: HealthMetrics, p?: UserProfile | null): MealRecommendation[] {
  const recs: MealRecommendation[] = [];
  const heightM = m.height / 100;
  const bmi = p ? calcBMI(p) : m.weight / (heightM * heightM);
  const calorieDeficit = m.totalCaloriesFoodGoal - m.totalCaloriesFood;
  const proteinDeficit = m.proteinGoal - m.protein;
  const activeCalsLeft = m.caloriesGoal - m.activeCalories;
  const isVegan = p?.dietaryRestrictions?.includes("Vegan");
  const isVeg = isVegan || p?.dietaryRestrictions?.includes("Vegetarian");

  // Goal-based primary recommendation
  if (p?.goal === "lose" || m.bodyFat > 25 || bmi > 27) {
    recs.push({
      name: isVeg ? "Lentil & Veggie Curry" : "Zucchini Noodles & Turkey Bolognese",
      reason: `Your ${p?.goal === "lose" ? "weight-loss goal" : "BMI"} (${bmi.toFixed(1)}) calls for low-carb high-protein meals to keep you full.`,
      calories: 380,
      protein: isVeg ? 22 : 38,
      type: "Dinner",
    });
  }
  if (p?.goal === "gain") {
    recs.push({
      name: isVeg ? "Quinoa Power Bowl" : "Salmon with Roasted Veggies",
      reason: `Building mass means hitting your ${m.totalCaloriesFoodGoal} cal target. This calorie-dense meal helps.`,
      calories: 520,
      protein: isVeg ? 22 : 38,
      type: "Dinner",
    });
  }

  if (activeCalsLeft > 200) {
    recs.push({
      name: "Banana & Almond Butter Toast",
      reason: `You still need to burn ${activeCalsLeft} active cal — this gives quick energy for ${p?.workoutStyle || "your"} workout.`,
      calories: 290, protein: 9, type: "Pre-workout",
    });
  }

  if (proteinDeficit > m.proteinGoal * 0.4) {
    recs.push({
      name: isVegan ? "Tofu Scramble Bowl" : "Greek Yogurt Power Bowl",
      reason: `You need ${proteinDeficit}g more protein for your ${m.proteinGoal}g goal (${p?.goal === "gain" ? "muscle building" : "lean mass"}).`,
      calories: isVegan ? 310 : 380, protein: isVegan ? 22 : 28, type: "Snack",
    });
  }

  if (m.carbs > m.carbsGoal * 0.85) {
    recs.push({
      name: isVeg ? "Tofu Scramble Bowl" : "Salmon with Roasted Veggies",
      reason: `You're near your carb limit (${m.carbs}/${m.carbsGoal}g). Low-carb option keeps you on track.`,
      calories: 420, protein: 35, type: "Dinner",
    });
  }

  if (m.water < m.waterGoal / 2) {
    recs.push({
      name: "Cucumber Watermelon Salad",
      reason: `You're behind on hydration (${m.water}/${m.waterGoal}). This snack is 90%+ water.`,
      calories: 90, protein: 2, type: "Snack",
    });
  }

  if (calorieDeficit > 600) {
    recs.push({
      name: "Quinoa Power Bowl",
      reason: `You have ${calorieDeficit} cal left for your ${m.totalCaloriesFoodGoal} target. Balanced macros to fuel the day.`,
      calories: 520, protein: 22, type: "Lunch",
    });
  }

  if (m.heartRate > 85) {
    recs.push({
      name: "Chamomile Tea & Dark Chocolate",
      reason: `Your heart rate is ${m.heartRate} bpm — magnesium-rich dark chocolate may calm it.`,
      calories: 110, protein: 2, type: "Snack",
    });
  }

  if (m.sleepHours < 6) {
    recs.push({
      name: isVegan ? "Tofu Scramble Bowl" : "Avocado Egg Toast",
      reason: `You only slept ${m.sleepHours}h ${m.sleepMinutes}m. Healthy fats and protein support focus when tired.`,
      calories: 340, protein: 16, type: "Breakfast",
    });
  }

  // Dedupe by name
  const seen = new Set<string>();
  return recs.filter((r) => (seen.has(r.name) ? false : (seen.add(r.name), true))).slice(0, 4);
}

export function getMealHealthFit(meal: Meal, m: HealthMetrics, p?: UserProfile | null): { label: string; color: string } {
  const bmi = p ? calcBMI(p) : m.weight / Math.pow(m.height / 100, 2);

  if (p?.goal === "lose" && meal.calories > 500) {
    return { label: "⚠️ High calorie for fat-loss goal", color: "text-health-calories" };
  }
  if (p?.goal === "gain" && meal.calories >= 450) {
    return { label: "✓ Great calorie density for bulking", color: "text-health-progress" };
  }
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
