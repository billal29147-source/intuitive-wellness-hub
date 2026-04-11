import { Gamepad2, Trophy, Users, Star, Medal, Award, Target, Calendar } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";

const challenges = [
  { name: "Weekend Warrior", desc: "10K steps for 2 days", reward: "50 pts", joined: true, color: "text-health-steps" },
  { name: "Early Bird", desc: "Workout before 8 AM", reward: "30 pts", joined: false, color: "text-health-calories" },
  { name: "Hydration Hero", desc: "8 glasses daily for a week", reward: "40 pts", joined: true, color: "text-health-hydration" },
];

const achievements = [
  { name: "First 10K Steps", desc: "Walk 10,000 steps in a day", unlocked: true, icon: "🏅" },
  { name: "Week Streak", desc: "7-day activity streak", unlocked: true, icon: "🔥" },
  { name: "Early Riser", desc: "5 workouts before 7 AM", unlocked: true, icon: "🌅" },
  { name: "Marathon Ready", desc: "Run 42 km total", unlocked: false, icon: "🏃", progress: 68 },
  { name: "Iron Will", desc: "30-day streak", unlocked: false, icon: "💎", progress: 47 },
  { name: "Social Butterfly", desc: "Win 10 challenges", unlocked: false, icon: "🦋", progress: 30 },
];

const GamesPage = () => {
  const { metrics } = useHealthData();

  const leaderboard = [
    { name: "You", steps: metrics.steps, rank: 2, avatar: "🏃" },
    { name: "Sarah K.", steps: 9120, rank: 1, avatar: "👑" },
    { name: "Mike R.", steps: 7845, rank: 3, avatar: "💪" },
    { name: "Emma L.", steps: 6230, rank: 4, avatar: "🌟" },
  ].sort((a, b) => b.steps - a.steps).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Compete</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-health-progress" /> Competitions & Challenges
        </h1>
      </div>

      {/* Your Stats */}
      <div className="glass-card rounded-3xl p-5 mb-5 health-glow-progress">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-health-progress/20 flex items-center justify-center text-2xl">🏆</div>
          <div className="flex-1">
            <p className="font-bold text-lg">Level {Math.floor(metrics.streak / 2) + 7}</p>
            <p className="text-xs text-muted-foreground">{metrics.streak * 90} / {(Math.floor(metrics.streak / 2) + 8) * 150} XP to next level</p>
            <div className="w-full h-2 bg-muted rounded-full mt-2">
              <div className="h-full bg-health-progress rounded-full" style={{ width: `${Math.min(100, (metrics.streak * 90) / ((Math.floor(metrics.streak / 2) + 8) * 150) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Score Wrapped */}
      <div className="glass-card rounded-3xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-health-progress" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Score Wrapped</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Daily Avg</p>
            <p className="text-xl font-bold text-health-progress">{metrics.healthScore}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Monthly Avg</p>
            <p className="text-xl font-bold text-health-steps">{Math.round(metrics.healthScore * 0.95)}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Yearly Avg</p>
            <p className="text-xl font-bold text-health-calories">{Math.round(metrics.healthScore * 0.91)}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Trophy className="w-4 h-4" /> Weekly Leaderboard
      </p>
      <div className="space-y-2 mb-5">
        {leaderboard.map((user) => (
          <div key={user.name} className={`glass-card rounded-2xl p-3 flex items-center gap-3 ${user.name === "You" ? "ring-1 ring-primary/40" : ""}`}>
            <span className="text-lg w-8 text-center">{user.rank === 1 ? "👑" : user.avatar}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.steps.toLocaleString()} steps</p>
            </div>
            <span className="text-xs font-bold text-muted-foreground">#{user.rank}</span>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Award className="w-4 h-4" /> Achievements & Milestones
      </p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {achievements.map((a) => (
          <div key={a.name} className={`glass-card rounded-2xl p-3 text-center ${!a.unlocked ? "opacity-60" : ""}`}>
            <span className="text-2xl">{a.icon}</span>
            <p className="text-[10px] font-medium mt-1 leading-tight">{a.name}</p>
            {a.unlocked ? (
              <p className="text-[10px] text-health-progress mt-0.5">✓ Unlocked</p>
            ) : (
              <div className="mt-1">
                <div className="w-full h-1 bg-muted rounded-full">
                  <div className="h-full bg-health-calories rounded-full" style={{ width: `${a.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.progress}%</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Challenges */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Target className="w-4 h-4" /> Challenges
      </p>
      <div className="space-y-3">
        {challenges.map((c) => (
          <div key={c.name} className="glass-card rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${c.color}`}>{c.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
              <p className="text-xs font-semibold mt-1">🎁 {c.reward}</p>
            </div>
            <button className={`text-xs px-3 py-1.5 rounded-full font-medium ${c.joined ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              {c.joined ? "Joined" : "Join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
