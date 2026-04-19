import { UtensilsCrossed, Droplets, Apple, Beef, Wheat, Plus, Pill, Lightbulb, Pencil, Check, Flame, Activity } from "lucide-react";
import HealthRing from "@/components/HealthRing";
import ExpandableTipCard from "@/components/ExpandableTipCard";
import { useHealthData } from "@/contexts/HealthDataContext";
import { useState } from "react";
import { defaultMeals, getSmartMealRecommendations, getMealHealthFit, Meal } from "@/lib/mealData";
import { getWaterTip } from "@/lib/healthTips";

const medicines = [
  { name: "Vitamin D", time: "8:00 AM", taken: true, info: "Supports bone health, immune function. Best with fatty meal for absorption." },
  { name: "Omega-3", time: "12:00 PM", taken: true, info: "Reduces inflammation, supports brain & heart. Take with food to avoid burps." },
  { name: "Magnesium", time: "9:00 PM", taken: false, info: "Supports sleep, muscle recovery, and nervous system. Best taken before bed." },
];

const FoodPage = () => {
  const { metrics, updateMetric } = useHealthData();
  const [editingMacros, setEditingMacros] = useState(false);
  const [meals] = useState<Meal[]>(defaultMeals);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const waterDone = metrics.water;
  const waterGoal = metrics.waterGoal;
  const waterTip = getWaterTip(metrics);
  const recommendations = getSmartMealRecommendations(metrics);

  const proteinProgress = Math.min(100, Math.round((metrics.protein / metrics.proteinGoal) * 100));
  const carbsProgress = Math.min(100, Math.round((metrics.carbs / metrics.carbsGoal) * 100));
  const fatsProgress = Math.min(100, Math.round((metrics.fats / metrics.fatsGoal) * 100));
  const calProgress = Math.min(100, Math.round((metrics.totalCaloriesFood / metrics.totalCaloriesFoodGoal) * 100));

  // Last 7 days calorie chart (simulated trend toward today's value)
  const trend = [0.78, 0.92, 0.65, 1.02, 0.88, 0.95, calProgress / 100];

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Nutrition</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-health-hydration" /> Food & Hydration
        </h1>
      </div>

      {/* Macros Overview - Static rings + edit */}
      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Today's Macros</p>
            <p className="text-lg font-bold mt-0.5">{metrics.totalCaloriesFood} <span className="text-xs font-normal text-muted-foreground">/ {metrics.totalCaloriesFoodGoal} cal</span></p>
          </div>
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
            <div className="flex items-center justify-around py-2">
              <div className="flex flex-col items-center">
                <HealthRing progress={proteinProgress} size={56} strokeWidth={5} color="hsl(var(--health-heart))">
                  <Beef className="w-3.5 h-3.5 text-health-heart" />
                </HealthRing>
                <p className="text-[10px] text-muted-foreground mt-1">Protein</p>
                <p className="text-[10px] font-semibold">{metrics.protein}/{metrics.proteinGoal}g</p>
              </div>
              <div className="flex flex-col items-center">
                <HealthRing progress={carbsProgress} size={56} strokeWidth={5} color="hsl(var(--health-calories))">
                  <Wheat className="w-3.5 h-3.5 text-health-calories" />
                </HealthRing>
                <p className="text-[10px] text-muted-foreground mt-1">Carbs</p>
                <p className="text-[10px] font-semibold">{metrics.carbs}/{metrics.carbsGoal}g</p>
              </div>
              <div className="flex flex-col items-center">
                <HealthRing progress={fatsProgress} size={56} strokeWidth={5} color="hsl(var(--health-steps))">
                  <Apple className="w-3.5 h-3.5 text-health-steps" />
                </HealthRing>
                <p className="text-[10px] text-muted-foreground mt-1">Fats</p>
                <p className="text-[10px] font-semibold">{metrics.fats}/{metrics.fatsGoal}g</p>
              </div>
            </div>

            {/* 7-day calorie trend bar chart */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">7-Day Calorie Trend</p>
                <p className="text-[10px] text-muted-foreground">Goal {metrics.totalCaloriesFoodGoal}</p>
              </div>
              <div className="flex items-end gap-1.5 h-16">
                {trend.map((v, i) => {
                  const isToday = i === trend.length - 1;
                  const isOver = v > 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isToday ? "bg-health-hydration" : isOver ? "bg-health-calories/70" : "bg-muted-foreground/30"
                        }`}
                        style={{ height: `${Math.min(100, v * 80)}%` }}
                      />
                      <span className="text-[8px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Water Tracker - static visual with controls */}
      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-health-hydration" />
            <div>
              <p className="text-sm font-semibold">Water</p>
              <p className="text-[11px] text-muted-foreground">{metrics.water} / {metrics.waterGoal} glasses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateMetric("water", Math.max(0, metrics.water - 1))} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold">−</button>
            <button onClick={() => updateMetric("water", Math.min(metrics.waterGoal, metrics.water + 1))} className="w-7 h-7 rounded-full bg-health-hydration/20 flex items-center justify-center text-sm font-bold text-health-hydration">+</button>
          </div>
        </div>
        <div className="flex gap-1 mb-2">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <div key={i} className={`flex-1 h-3 rounded-full transition-all ${i < waterDone ? "bg-health-hydration" : "bg-muted"}`} />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">{waterTip.summary}</p>
      </div>

      {/* Single expandable: full hydration tips */}
      <div className="mb-5">
        <ExpandableTipCard
          icon={Lightbulb}
          title="Hydration Coach"
          subtitle="Tap for personalized water tips"
          colorClass="text-health-hydration"
          summary={waterTip.summary}
          tips={waterTip.tips}
          progress={waterTip.progress}
        />
      </div>

      {/* Smart Meal Recommendations - horizontal scroll cards (not dropdowns) */}
      {recommendations.length > 0 && (
        <>
          <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-health-progress" /> Smart Picks For Your Health
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 mb-5 -mx-5 px-5 snap-x">
            {recommendations.map((rec, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 min-w-[200px] snap-start flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="w-4 h-4 text-health-progress" />
                  <p className="text-sm font-semibold">{rec.name}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{rec.type}</p>
                <div className="flex gap-3 mb-2">
                  <div>
                    <p className="text-[9px] text-muted-foreground">CAL</p>
                    <p className="text-xs font-bold text-health-calories">{rec.calories}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">PROTEIN</p>
                    <p className="text-xs font-bold text-health-heart">{rec.protein}g</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">{rec.reason}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Medicine Reminders - static checklist */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Pill className="w-4 h-4 text-health-heart" /> Medicine Reminders
      </p>
      <div className="glass-card rounded-2xl p-4 mb-5 space-y-3">
        {medicines.map((med, i) => (
          <div key={med.name} className={`flex items-center gap-3 ${i < medicines.length - 1 ? "pb-3 border-b border-border/40" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${med.taken ? "bg-health-progress/20" : "bg-health-calories/20"}`}>
              {med.taken ? <Check className="w-4 h-4 text-health-progress" /> : <Pill className="w-4 h-4 text-health-calories" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{med.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{med.info}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{med.time}</span>
          </div>
        ))}
      </div>

      {/* Meals - tap to expand nutrition */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-muted-foreground">Today's Meals · Tap for nutrition</p>
        <button className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </div>
      <div className="space-y-2">
        {meals.map((meal) => {
          const fit = getMealHealthFit(meal, metrics);
          const isOpen = expandedMeal === meal.name;
          return (
            <div
              key={meal.name}
              onClick={() => setExpandedMeal(isOpen ? null : meal.name)}
              className="glass-card rounded-2xl p-4 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{meal.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{meal.type} · {meal.time}</p>
                  <p className={`text-[10px] font-semibold mt-1 ${fit.color}`}>{fit.label}</p>
                </div>
                <span className="text-xs font-semibold text-health-calories">{meal.calories} cal</span>
              </div>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Nutritional Value</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-muted/40 rounded-lg p-2 text-center">
                        <Flame className="w-3 h-3 text-health-calories mx-auto mb-1" />
                        <p className="text-xs font-bold">{meal.calories}</p>
                        <p className="text-[9px] text-muted-foreground">kcal</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-2 text-center">
                        <Beef className="w-3 h-3 text-health-heart mx-auto mb-1" />
                        <p className="text-xs font-bold">{meal.protein}g</p>
                        <p className="text-[9px] text-muted-foreground">Protein</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-2 text-center">
                        <Wheat className="w-3 h-3 text-health-calories mx-auto mb-1" />
                        <p className="text-xs font-bold">{meal.carbs}g</p>
                        <p className="text-[9px] text-muted-foreground">Carbs</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-2 text-center">
                        <Apple className="w-3 h-3 text-health-steps mx-auto mb-1" />
                        <p className="text-xs font-bold">{meal.fats}g</p>
                        <p className="text-[9px] text-muted-foreground">Fats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      <span>Fiber: {meal.fiber}g</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ingredients</p>
                    <ul className="space-y-0.5">
                      {meal.ingredients.map((ing, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground">• {ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Why it's good for you</p>
                    <p className="text-[11px]">{meal.benefits}</p>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-2 border border-primary/20">
                    <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Match for your health</p>
                    <p className={`text-[11px] font-medium ${fit.color}`}>{fit.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Based on your current macros ({metrics.protein}g protein, {metrics.carbs}g carbs) and body composition ({metrics.bodyFat}% BF).
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodPage;
