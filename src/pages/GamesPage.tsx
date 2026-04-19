import { Trophy, Award, Target, Calendar, TrendingUp, Flame } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";
import ExpandableTipCard from "@/components/ExpandableTipCard";

const challenges = [
  { name: "Weekend Warrior", desc: "10K steps for 2 days", reward: "50 pts", joined: true, color: "text-health-steps", progress: 65 },
  { name: "Early Bird", desc: "Workout before 8 AM", reward: "30 pts", joined: false, color: "text-health-calories", progress: 0 },
  { name: "Hydration Hero", desc: "8 glasses daily for a week", reward: "40 pts", joined: true, color: "text-health-hydration", progress: 80 },
];

const achievements = [
  { name: "First 10K Steps", icon: "🏅", unlocked: true, progress: 100 },
  { name: "Week Streak", icon: "🔥", unlocked: true, progress: 100 },
  { name: "Early Riser", icon: "🌅", unlocked: true, progress: 100 },
  { name: "Marathon Ready", icon: "🏃", unlocked: false, progress: 68 },
  { name: "Iron Will", icon: "💎", unlocked: false, progress: 47 },
  { name: "Social Butterfly", icon: "🦋", unlocked: false, progress: 30 },
];

const GamesPage = () => {
  const { metrics } = useHealthData();

  const leaderboard = [
    { name: "You", steps: metrics.steps, avatar: "🏃" },
    { name: "Sarah K.", steps: 9120, avatar: "👑" },
    { name: "Mike R.", steps: 7845, avatar: "💪" },
    { name: "Emma L.", steps: 6230, avatar: "🌟" },
  ].sort((a, b) => b.steps - a.steps).map((u, i) => ({ ...u, rank: i + 1 }));

  const yourRank = leaderboard.find(u => u.name === "You")?.rank || 0;
  const stepsToFirst = Math.max(0, leaderboard[0].steps - metrics.steps);
  const level = Math.floor(metrics.streak / 2) + 7;
  const xp = metrics.streak * 90;
  const xpNeeded = (Math.floor(metrics.streak / 2) + 8) * 150;
  const xpPct = Math.min(100, (xp / xpNeeded) * 100);
  const maxSteps = leaderboard[0].steps;

  // Score wrapped chart (last 6 months trend toward today)
  const monthly = [0.82, 0.79, 0.85, 0.88, 0.92, metrics.healthScore / 100];

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Compete</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-health-progress" /> Competitions & Challenges
        </h1>
      </div>

      {/* Level + XP - Static visual */}
      <div className="glass-card rounded-3xl p-5 mb-5 health-glow-progress">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Level</p>
            <p className="text-3xl font-bold text-health-progress">Lv {level}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-bold flex items-center gap-1"><Flame className="w-4 h-4 text-health-calories" />{metrics.streak}d</p>
          </div>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-3 mb-1.5 overflow-hidden">
          <div className="h-3 rounded-full bg-gradient-to-r from-health-progress to-health-steps transition-all" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{xp} XP</span>
          <span>{xpNeeded - xp} to Lv {level + 1}</span>
        </div>
      </div>

      {/* Score Wrapped - Static line/bar chart */}
      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-health-progress" />
            <p className="text-sm font-semibold">Score Wrapped</p>
          </div>
          <TrendingUp className="w-4 h-4 text-health-progress" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Daily</p>
            <p className="text-lg font-bold text-health-progress">{metrics.healthScore}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Monthly</p>
            <p className="text-lg font-bold text-health-steps">{Math.round(metrics.healthScore * 0.95)}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Yearly</p>
            <p className="text-lg font-bold text-health-calories">{Math.round(metrics.healthScore * 0.91)}</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">6-Month Trend</p>
        <div className="flex items-end gap-1.5 h-16">
          {monthly.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md ${i === monthly.length - 1 ? "bg-health-progress" : "bg-health-progress/30"}`}
                style={{ height: `${v * 100}%` }}
              />
              <span className="text-[8px] text-muted-foreground">{["N","D","J","F","M","A"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard - Static visual bars */}
      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-health-progress" />
            <p className="text-sm font-semibold">Weekly Leaderboard</p>
          </div>
          <span className="text-[10px] font-bold text-health-progress">You're #{yourRank}</span>
        </div>
        <div className="space-y-2.5">
          {leaderboard.map((user) => {
            const pct = (user.steps / maxSteps) * 100;
            const isYou = user.name === "You";
            return (
              <div key={user.name}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-5 text-center">{user.rank === 1 ? "👑" : user.avatar}</span>
                  <span className={`text-xs flex-1 ${isYou ? "font-bold text-primary" : "font-medium"}`}>{user.name}</span>
                  <span className="text-[10px] text-muted-foreground">{user.steps.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-muted-foreground w-6 text-right">#{user.rank}</span>
                </div>
                <div className="w-full bg-muted/40 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${isYou ? "bg-primary" : user.rank === 1 ? "bg-health-progress" : "bg-muted-foreground/40"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {stepsToFirst > 0 && (
          <p className="text-[10px] text-muted-foreground mt-3 pt-3 border-t border-border/40">
            💡 {stepsToFirst.toLocaleString()} more steps (~{Math.ceil(stepsToFirst / 100)} min walk) to take #1
          </p>
        )}
      </div>

      {/* Achievements - Static grid */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Award className="w-4 h-4" /> Achievements
      </p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {achievements.map((a) => (
          <div key={a.name} className={`glass-card rounded-2xl p-3 text-center ${a.unlocked ? "" : "opacity-60"}`}>
            <div className="text-2xl mb-1">{a.icon}</div>
            <p className="text-[10px] font-medium leading-tight mb-1.5">{a.name}</p>
            {a.unlocked ? (
              <p className="text-[9px] text-health-progress font-bold">✓ Unlocked</p>
            ) : (
              <>
                <div className="w-full bg-muted/50 rounded-full h-1 mb-1">
                  <div className="h-1 rounded-full bg-health-steps" style={{ width: `${a.progress}%` }} />
                </div>
                <p className="text-[9px] text-muted-foreground">{a.progress}%</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Challenges - Static cards with progress */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Target className="w-4 h-4" /> Active Challenges
      </p>
      <div className="space-y-2 mb-5">
        {challenges.map((c) => (
          <div key={c.name} className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${c.color}`}>{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.desc} · 🎁 {c.reward}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${c.joined ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {c.joined ? "Joined" : "Join"}
              </span>
            </div>
            {c.joined && (
              <div className="w-full bg-muted/50 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full bg-current ${c.color}`} style={{ width: `${c.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Single coach tip card at bottom */}
      <ExpandableTipCard
        icon={Trophy}
        title="Compete Coach"
        subtitle="Tap for tips to climb the ranks"
        colorClass="text-health-progress"
        summary={stepsToFirst > 0
          ? `You're #${yourRank} of ${leaderboard.length}. ${stepsToFirst.toLocaleString()} steps from #1. Level ${level} with ${xp}/${xpNeeded} XP.`
          : `🏆 You're #1! Maintain your lead with daily walks.`}
        tips={[
          stepsToFirst > 0
            ? `${stepsToFirst.toLocaleString()} steps ≈ a ${Math.ceil(stepsToFirst / 100)}-minute brisk walk.`
            : "Don't get complacent — others are catching up.",
          "Each day of activity earns you 90 XP.",
          "Completing challenges gives bonus XP (30-50 each).",
          `Maintain your ${metrics.streak}-day streak — breaking it resets your XP multiplier.`,
        ]}
      />
    </div>
  );
};

export default GamesPage;
