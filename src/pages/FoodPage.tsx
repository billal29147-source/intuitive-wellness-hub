import { UtensilsCrossed, Droplets, Apple, Beef, Wheat, Plus, Bell, Pill, Lightbulb, Clock, Pencil, Check } from "lucide-react";
import HealthRing from "@/components/HealthRing";
import { useHealthData } from "@/contexts/HealthDataContext";
import { useState } from "react";

const medicines = [
  { name: "Vitamin D", time: "8:00 AM", taken: true },
  { name: "Omega-3", time: "12:00 PM", taken: true },
  { name: "Magnesium", time: "9:00 PM", taken: false },
];

const foodRecommendations = [
  "🥗 Try a quinoa bowl with avocado for lunch — high in fiber & healthy fats.",
  "🍌 A banana pre-workout boosts energy with natural potassium.",
  "🥜 Almonds make a perfect afternoon snack for sustained energy.",
];

const FoodPage = () => {
  const { metrics, updateMetric } = useHealthData();
  const [editingMacros, setEditingMacros] = useState(false);
  const [meals, setMeals] = useState([
    { name: "Oatmeal & Berries", time: "8:00 AM", calories: 320, type: "Breakfast" },
    { name: "Grilled Chicken Salad", time: "12:30 PM", calories: 450, type: "Lunch" },
    { name: "Protein Shake", time: "3:00 PM", calories: 180, type: "Snack" },
  ]);

  const waterDone = metrics.water;
  const waterGoal = metrics.waterGoal;
  const waterSchedule = Array.from({ length: waterGoal }, (_, i) => ({
    time: `${7 + i * Math.floor(14 / waterGoal)}:00`,
    done: i < waterDone,
  }));

  const proteinProgress = Math.round((metrics.protein / metrics.proteinGoal) * 100);
  const carbsProgress = Math.round((metrics.carbs / metrics.carbsGoal) * 100);
  const fatsProgress = Math.round((metrics.fats / metrics.fatsGoal) * 100);

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Nutrition</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-health-hydration" /> Food & Hydration
        </h1>
      </div>

      {/* Macros Overview */}
      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Macros</p>
          <button onClick={() => setEditingMacros(!editingMacros)} className="opacity-60 hover:opacity-100">
            {editingMacros ? <Check className="w-4 h-4 text-health-progress" /> : <Pencil className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        {editingMacros ? (
          <div className="space-y-3">
            {[
              { label: "Protein", key: "protein" as const, goalKey: "proteinGoal" as const, unit: "g" },
              { label: "Carbs", key: "carbs" as const, goalKey: "carbsGoal" as const, unit: "g" },
              { label: "Fats", key: "fats" as const, goalKey: "fatsGoal" as const, unit: "g" },
              { label: "Total Cal", key: "totalCaloriesFood" as const, goalKey: "totalCaloriesFoodGoal" as const, unit: "cal" },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-16">{item.label}</span>
                <input type="number" value={metrics[item.key]} onChange={(e) => updateMetric(item.key, parseFloat(e.target.value) || 0)}
                  className="flex-1 h-8 rounded-lg border border-border bg-muted/50 px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary" />
                <span className="text-[10px] text-muted-foreground">/</span>
                <input type="number" value={metrics[item.goalKey]} onChange={(e) => updateMetric(item.goalKey, parseFloat(e.target.value) || 0)}
                  className="w-16 h-8 rounded-lg border border-border bg-muted/50 px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary" />
                <span className="text-[10px] text-muted-foreground w-6">{item.unit}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center">
                <HealthRing progress={proteinProgress} size={60} strokeWidth={5} color="hsl(var(--health-heart))">
                  <Beef className="w-3.5 h-3.5 text-health-heart" />
                </HealthRing>
                <p className="text-xs text-muted-foreground mt-2">Protein</p>
                <p className="text-xs font-semibold">{metrics.protein}g / {metrics.proteinGoal}g</p>
              </div>
              <div className="flex flex-col items-center">
                <HealthRing progress={carbsProgress} size={60} strokeWidth={5} color="hsl(var(--health-calories))">
                  <Wheat className="w-3.5 h-3.5 text-health-calories" />
                </HealthRing>
                <p className="text-xs text-muted-foreground mt-2">Carbs</p>
                <p className="text-xs font-semibold">{metrics.carbs}g / {metrics.carbsGoal}g</p>
              </div>
              <div className="flex flex-col items-center">
                <HealthRing progress={fatsProgress} size={60} strokeWidth={5} color="hsl(var(--health-steps))">
                  <Apple className="w-3.5 h-3.5 text-health-steps" />
                </HealthRing>
                <p className="text-xs text-muted-foreground mt-2">Fats</p>
                <p className="text-xs font-semibold">{metrics.fats}g / {metrics.fatsGoal}g</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">{metrics.totalCaloriesFood} <span className="text-sm text-muted-foreground font-normal">/ {metrics.totalCaloriesFoodGoal} cal</span></p>
            </div>
          </>
        )}
      </div>

      {/* Water Reminder */}
      <div className="glass-card rounded-3xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-health-hydration" />
            <p className="text-sm font-medium">Water Tracker</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateMetric("water", Math.max(0, metrics.water - 1))} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">−</button>
            <span className="text-xs font-medium">{metrics.water}/{metrics.waterGoal}</span>
            <button onClick={() => updateMetric("water", Math.min(metrics.waterGoal, metrics.water + 1))} className="w-6 h-6 rounded-full bg-health-hydration/20 flex items-center justify-center text-xs font-bold text-health-hydration">+</button>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < waterDone ? "bg-health-hydration" : "bg-muted"}`} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {waterDone >= waterGoal ? "🎉 Hydration goal complete!" : `${waterGoal - waterDone} more glass${waterGoal - waterDone > 1 ? "es" : ""} to go`}
        </p>
      </div>

      {/* Medicine Reminders */}
      <div className="glass-card rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Pill className="w-4 h-4 text-health-heart" />
          <p className="text-sm font-semibold">Medicine Reminders</p>
        </div>
        <div className="space-y-2">
          {medicines.map((med) => (
            <div key={med.name} className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${med.taken ? "bg-health-progress" : "bg-health-calories"}`} />
                <div>
                  <p className="text-xs font-medium">{med.name}</p>
                  <p className="text-[10px] text-muted-foreground">{med.time}</p>
                </div>
              </div>
              <span className="text-xs">{med.taken ? "✅ Taken" : "⏳ Pending"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-muted-foreground">Today's Meals</p>
        <button className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </div>
      <div className="space-y-3">
        {meals.map((meal) => (
          <div key={meal.name} className="glass-card rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{meal.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{meal.type} · {meal.time}</p>
              </div>
              <span className="text-xs font-semibold text-health-calories">{meal.calories} cal</span>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Food Recommendations */}
      <div className="glass-card rounded-3xl p-4 mt-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" /> Smart Food Recommendations
        </p>
        <div className="space-y-2">
          {metrics.protein < metrics.proteinGoal * 0.5 && (
            <p className="text-xs text-muted-foreground">🥩 You're low on protein ({metrics.protein}g/{metrics.proteinGoal}g) — add grilled chicken or fish to your next meal.</p>
          )}
          {metrics.carbs > metrics.carbsGoal * 0.8 && (
            <p className="text-xs text-muted-foreground">🍞 You're near your carb limit — consider a low-carb dinner option.</p>
          )}
          {foodRecommendations.map((rec, i) => (
            <p key={i} className="text-xs text-muted-foreground">{rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
