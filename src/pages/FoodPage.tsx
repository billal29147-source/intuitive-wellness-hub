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

  const proteinProgress = Math.round((metrics.protein / metrics.proteinGoal) * 100);
  const carbsProgress = Math.round((metrics.carbs / metrics.carbsGoal) * 100);
  const fatsProgress = Math.round((metrics.fats / metrics.fatsGoal) * 100);
  const calProgress = Math.round((metrics.totalCaloriesFood / metrics.totalCaloriesFoodGoal) * 100);

  const macrosTip = {
    summary: `You've eaten ${metrics.totalCaloriesFood} of ${metrics.totalCaloriesFoodGoal} cal today. Protein: ${metrics.protein}/${metrics.proteinGoal}g, Carbs: ${metrics.carbs}/${metrics.carbsGoal}g, Fats: ${metrics.fats}/${metrics.fatsGoal}g.`,
    tips: [
      metrics.protein < metrics.proteinGoal * 0.5
        ? `🥩 You're low on protein (${metrics.protein}g) — add chicken, fish, or Greek yogurt.`
        : `✓ Protein is on track at ${metrics.protein}g.`,
      metrics.carbs > metrics.carbsGoal * 0.85
        ? `🍞 You're near your carb limit — choose low-carb options for remaining meals.`
        : `Aim for complex carbs (oats, quinoa, sweet potato) for sustained energy.`,
      metrics.fats < metrics.fatsGoal * 0.4
        ? `🥑 Add healthy fats — avocado, nuts, olive oil for hormone support.`
        : `✓ Healthy fats are in good range.`,
      `Spread protein across meals — your body uses ~30g per sitting most efficiently.`,
    ],
    progress: calProgress,
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Nutrition</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-health-hydration" /> Food & Hydration
        </h1>
      </div>

      {/* Macros Overview - Clickable */}
      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Macros · Tap to learn more</p>
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
          <ExpandableTipCard
            title={`${metrics.totalCaloriesFood} / ${metrics.totalCaloriesFoodGoal} cal`}
            subtitle="Tap to see macro breakdown & tips"
            colorClass="text-health-hydration"
            summary={macrosTip.summary}
            tips={macrosTip.tips}
            progress={macrosTip.progress}
          >
            <div className="flex items-center justify-around py-2">
              <div className="flex flex-col items-center">
                <HealthRing progress={proteinProgress} size={50} strokeWidth={4} color="hsl(var(--health-heart))">
                  <Beef className="w-3 h-3 text-health-heart" />
                </HealthRing>
                <p className="text-[10px] text-muted-foreground mt-1">Protein</p>
                <p className="text-[10px] font-semibold">{metrics.protein}/{metrics.proteinGoal}g</p>
              </div>
              <div className="flex flex-col items-center">
                <HealthRing progress={carbsProgress} size={50} strokeWidth={4} color="hsl(var(--health-calories))">
                  <Wheat className="w-3 h-3 text-health-calories" />
                </HealthRing>
                <p className="text-[10px] text-muted-foreground mt-1">Carbs</p>
                <p className="text-[10px] font-semibold">{metrics.carbs}/{metrics.carbsGoal}g</p>
              </div>
              <div className="flex flex-col items-center">
                <HealthRing progress={fatsProgress} size={50} strokeWidth={4} color="hsl(var(--health-steps))">
                  <Apple className="w-3 h-3 text-health-steps" />
                </HealthRing>
                <p className="text-[10px] text-muted-foreground mt-1">Fats</p>
                <p className="text-[10px] font-semibold">{metrics.fats}/{metrics.fatsGoal}g</p>
              </div>
            </div>
          </ExpandableTipCard>
        )}
      </div>

      {/* Water - Clickable */}
      <div className="mb-5">
        <ExpandableTipCard
          icon={Droplets}
          title="Water Tracker"
          subtitle={`${metrics.water} / ${metrics.waterGoal} glasses`}
          colorClass="text-health-hydration"
          summary={waterTip.summary}
          tips={waterTip.tips}
          progress={waterTip.progress}
          rightContent={
            <div className="flex items-center gap-2 mr-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => updateMetric("water", Math.max(0, metrics.water - 1))} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">−</button>
              <span className="text-xs font-medium">{metrics.water}/{metrics.waterGoal}</span>
              <button onClick={() => updateMetric("water", Math.min(metrics.waterGoal, metrics.water + 1))} className="w-6 h-6 rounded-full bg-health-hydration/20 flex items-center justify-center text-xs font-bold text-health-hydration">+</button>
            </div>
          }
        >
          <div className="flex gap-1 mt-2 mb-1">
            {Array.from({ length: waterGoal }).map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i < waterDone ? "bg-health-hydration" : "bg-muted"}`} />
            ))}
          </div>
        </ExpandableTipCard>
      </div>

      {/* Smart Meal Recommendations based on health */}
      {recommendations.length > 0 && (
        <>
          <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-health-progress" /> Smart Picks For Your Health
          </p>
          <div className="space-y-2 mb-5">
            {recommendations.map((rec, i) => (
              <ExpandableTipCard
                key={i}
                icon={Apple}
                title={rec.name}
                subtitle={`${rec.type} · ${rec.calories} cal · ${rec.protein}g protein`}
                colorClass="text-health-progress"
                summary={rec.reason}
                tips={[
                  `Calories: ${rec.calories} kcal`,
                  `Protein: ${rec.protein}g`,
                  `Why this fits you: based on your current metrics, this meal helps close a specific gap.`,
                  `Tap "+" below to add it to your meal log.`,
                ]}
              />
            ))}
          </div>
        </>
      )}

      {/* Medicine Reminders - Clickable */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Pill className="w-4 h-4 text-health-heart" /> Medicine Reminders
      </p>
      <div className="space-y-2 mb-5">
        {medicines.map((med) => (
          <ExpandableTipCard
            key={med.name}
            title={med.name}
            subtitle={`${med.time} · ${med.taken ? "✅ Taken" : "⏳ Pending"}`}
            colorClass={med.taken ? "text-health-progress" : "text-health-calories"}
            summary={`${med.name} — ${med.taken ? "already taken today" : `scheduled for ${med.time}`}.`}
            tips={[
              med.info,
              "Set a daily phone alarm to maintain consistency.",
              "Never skip prescription medication without consulting your doctor.",
            ]}
          />
        ))}
      </div>

      {/* Meals - Clickable with Nutrition */}
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
                  {/* Nutrition Grid */}
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

                  {/* Ingredients */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ingredients</p>
                    <ul className="space-y-0.5">
                      {meal.ingredients.map((ing, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground">• {ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Why it helps */}
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Why it's good for you</p>
                    <p className="text-[11px]">{meal.benefits}</p>
                  </div>

                  {/* Personalized fit */}
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
