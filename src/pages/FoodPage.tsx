import { UtensilsCrossed, Droplets, Apple, Beef, Wheat, Plus, Bell, Pill, Lightbulb, Clock, AlertCircle } from "lucide-react";
import HealthRing from "@/components/HealthRing";

const meals = [
  { name: "Oatmeal & Berries", time: "8:00 AM", calories: 320, type: "Breakfast" },
  { name: "Grilled Chicken Salad", time: "12:30 PM", calories: 450, type: "Lunch" },
  { name: "Protein Shake", time: "3:00 PM", calories: 180, type: "Snack" },
];

const waterSchedule = [
  { time: "7:00 AM", done: true },
  { time: "9:00 AM", done: true },
  { time: "11:00 AM", done: true },
  { time: "1:00 PM", done: true },
  { time: "3:00 PM", done: true },
  { time: "5:00 PM", done: true },
  { time: "7:00 PM", done: false },
  { time: "9:00 PM", done: false },
];

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

      {/* Water Reminder */}
      <div className="glass-card rounded-3xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-health-hydration" />
            <p className="text-sm font-medium">Water Reminder</p>
          </div>
          <Bell className="w-4 h-4 text-health-hydration animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground mb-3">Next reminder in 45 min — stay hydrated! 💧</p>
        <div className="grid grid-cols-4 gap-2">
          {waterSchedule.map((w, i) => (
            <div key={i} className={`rounded-xl p-2 text-center ${w.done ? "bg-health-hydration/20" : "bg-muted/50"}`}>
              <p className="text-[10px] text-muted-foreground">{w.time}</p>
              <p className="text-xs mt-0.5">{w.done ? "✅" : "⏰"}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${i < 6 ? "bg-health-hydration" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">6 of 8 glasses</p>
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
          {foodRecommendations.map((rec, i) => (
            <p key={i} className="text-xs text-muted-foreground">{rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
