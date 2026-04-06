import { Footprints, Heart, Moon, Flame, Droplets, Trophy, Dumbbell, UtensilsCrossed, Gamepad2 } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import HealthRing from "@/components/HealthRing";

interface HomePageProps {
  onNavigate: (page: number) => void;
}

const navIcons = [
  { icon: Dumbbell, label: "Workouts", page: 1, color: "text-health-calories" },
  { icon: UtensilsCrossed, label: "Food", page: 2, color: "text-health-hydration" },
  { icon: Gamepad2, label: "Games", page: 3, color: "text-health-progress" },
  { icon: Trophy, label: "Compete", page: 3, color: "text-health-heart" },
];

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Good Morning</p>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">⌚</span>
        </div>
      </div>

      {/* Daily Progress Ring */}
      <div className="glass-card rounded-3xl p-6 mb-5 flex items-center gap-6">
        <HealthRing progress={72} size={100} strokeWidth={8} color="hsl(var(--primary))">
          <div className="text-center">
            <p className="text-lg font-bold">72%</p>
            <p className="text-[10px] text-muted-foreground">Daily</p>
          </div>
        </HealthRing>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-steps" />
            <span className="text-xs text-muted-foreground flex-1">Move</span>
            <span className="text-xs font-medium">420 / 600 cal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-heart" />
            <span className="text-xs text-muted-foreground flex-1">Exercise</span>
            <span className="text-xs font-medium">25 / 30 min</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-health-sleep" />
            <span className="text-xs text-muted-foreground flex-1">Stand</span>
            <span className="text-xs font-medium">9 / 12 hrs</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Icons */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {navIcons.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <item.icon className={`w-6 h-6 ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={Footprints} label="Steps" value="8,432" subtitle="Goal: 10,000" colorClass="text-health-steps" glowClass="health-glow-steps" />
        <MetricCard icon={Heart} label="Heart" value="72 bpm" subtitle="Resting" colorClass="text-health-heart" glowClass="health-glow-heart" />
        <MetricCard icon={Moon} label="Sleep" value="7h 24m" subtitle="Deep: 2h 10m" colorClass="text-health-sleep" glowClass="health-glow-sleep" />
        <MetricCard icon={Flame} label="Calories" value="1,847" subtitle="Active: 420" colorClass="text-health-calories" glowClass="health-glow-calories" />
        <MetricCard icon={Droplets} label="Water" value="6 / 8" subtitle="Glasses" colorClass="text-health-hydration" glowClass="health-glow-steps" />
        <MetricCard icon={Trophy} label="Streak" value="14 days" subtitle="Personal best!" colorClass="text-health-progress" glowClass="health-glow-progress" />
      </div>
    </div>
  );
};

export default HomePage;
