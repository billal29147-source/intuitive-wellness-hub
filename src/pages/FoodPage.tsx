import { UtensilsCrossed, Droplets, Apple, Beef, Wheat, Plus } from "lucide-react";
import HealthRing from "@/components/HealthRing";

const meals = [
  { name: "Oatmeal & Berries", time: "8:00 AM", calories: 320, type: "Breakfast" },
  { name: "Grilled Chicken Salad", time: "12:30 PM", calories: 450, type: "Lunch" },
  { name: "Protein Shake", time: "3:00 PM", calories: 180, type: "Snack" },
];

const FoodPage = () => {
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
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <HealthRing progress={65} size={60} strokeWidth={5} color="hsl(var(--health-heart))">
              <Beef className="w-3.5 h-3.5 text-health-heart" />
            </HealthRing>
            <p className="text-xs text-muted-foreground mt-2">Protein</p>
            <p className="text-xs font-semibold">85g</p>
          </div>
          <div className="flex flex-col items-center">
            <HealthRing progress={50} size={60} strokeWidth={5} color="hsl(var(--health-calories))">
              <Wheat className="w-3.5 h-3.5 text-health-calories" />
            </HealthRing>
            <p className="text-xs text-muted-foreground mt-2">Carbs</p>
            <p className="text-xs font-semibold">120g</p>
          </div>
          <div className="flex flex-col items-center">
            <HealthRing progress={40} size={60} strokeWidth={5} color="hsl(var(--health-steps))">
              <Apple className="w-3.5 h-3.5 text-health-steps" />
            </HealthRing>
            <p className="text-xs text-muted-foreground mt-2">Fats</p>
            <p className="text-xs font-semibold">45g</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">950 <span className="text-sm text-muted-foreground font-normal">/ 2,100 cal</span></p>
        </div>
      </div>

      {/* Hydration */}
      <div className="glass-card rounded-2xl p-4 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-health-hydration" />
          <div>
            <p className="text-sm font-medium">Hydration</p>
            <p className="text-xs text-muted-foreground">6 of 8 glasses</p>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-8 rounded-full ${i < 6 ? "bg-health-hydration" : "bg-muted"}`}
            />
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

      {/* Suggestions */}
      <div className="glass-card rounded-3xl p-4 mt-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">💡 Suggestion</p>
        <p className="text-sm">Try adding a fiber-rich snack like almonds or an apple to hit your daily fiber goal.</p>
      </div>
    </div>
  );
};

export default FoodPage;
