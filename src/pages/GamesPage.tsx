import { Gamepad2, Trophy, Award, Target, Calendar } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";
import ExpandableTipCard from "@/components/ExpandableTipCard";

const challenges = [
  {
    name: "Weekend Warrior",
    desc: "10K steps for 2 days",
    reward: "50 pts",
    joined: true,
    color: "text-health-steps",
    details: "Hit 10,000 steps on Saturday and Sunday to earn 50 XP and a badge.",
    tips: ["Plan a hike or long walk Saturday morning.", "Use the 'walk while on calls' trick to rack up steps.", "Track your progress hourly to stay on pace."],
  },
  {
    name: "Early Bird",
    desc: "Workout before 8 AM",
    reward: "30 pts",
    joined: false,
    color: "text-health-calories",
    details: "Complete any workout before 8 AM for 5 consecutive days.",
    tips: ["Set clothes out the night before.", "Sleep 30 min earlier — not later.", "Even a 10-min workout counts!"],
  },
  {
    name: "Hydration Hero",
    desc: "8 glasses daily for a week",
    reward: "40 pts",
    joined: true,
    color: "text-health-hydration",
    details: "Drink 8+ glasses of water every day for 7 days straight.",
    tips: ["Keep a water bottle visible at all times.", "Drink a glass right when you wake up.", "Add lemon or cucumber for variety."],
  },
];

const achievements = [
  { name: "First 10K Steps", desc: "Walk 10,000 steps in a day", unlocked: true, icon: "🏅", details: "You crushed your first 10,000 step day! Walking 10K steps daily reduces all-cause mortality risk by 51%." },
  { name: "Week Streak", desc: "7-day activity streak", unlocked: true, icon: "🔥", details: "7 days of consistent activity. Habits start forming around day 21 — you're a third of the way!" },
  { name: "Early Riser", desc: "5 workouts before 7 AM", unlocked: true, icon: "🌅", details: "Morning workouts boost mood and metabolism for the entire day." },
  { name: "Marathon Ready", desc: "Run 42 km total", unlocked: false, icon: "🏃", progress: 68, details: "You're 68% of the way to running a marathon's distance. Keep building base mileage!" },
  { name: "Iron Will", desc: "30-day streak", unlocked: false, icon: "💎", progress: 47, details: "Halfway to a 30-day streak! Don't break the chain — even short activity counts." },
  { name: "Social Butterfly", desc: "Win 10 challenges", unlocked: false, icon: "🦋", progress: 30, details: "Compete with friends for accountability and bigger gains." },
];

const GamesPage = () => {
  const { metrics } = useHealthData();

  const leaderboard = [
    { name: "You", steps: metrics.steps, rank: 2, avatar: "🏃" },
    { name: "Sarah K.", steps: 9120, rank: 1, avatar: "👑" },
    { name: "Mike R.", steps: 7845, rank: 3, avatar: "💪" },
    { name: "Emma L.", steps: 6230, rank: 4, avatar: "🌟" },
  ].sort((a, b) => b.steps - a.steps).map((u, i) => ({ ...u, rank: i + 1 }));

  const yourRank = leaderboard.find(u => u.name === "You")?.rank || 0;
  const stepsToFirst = Math.max(0, leaderboard[0].steps - metrics.steps);
  const level = Math.floor(metrics.streak / 2) + 7;
  const xp = metrics.streak * 90;
  const xpNeeded = (Math.floor(metrics.streak / 2) + 8) * 150;

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Compete</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-health-progress" /> Competitions & Challenges
        </h1>
      </div>

      {/* Your Stats - Clickable */}
      <div className="mb-5">
        <ExpandableTipCard
          icon={Trophy}
          title={`Level ${level}`}
          subtitle={`${xp} / ${xpNeeded} XP to Level ${level + 1}`}
          colorClass="text-health-progress"
          glowClass="health-glow-progress"
          summary={`You're at Level ${level} with a ${metrics.streak}-day streak. You need ${Math.max(0, xpNeeded - xp)} more XP to level up.`}
          tips={[
            "Each day of activity earns you 90 XP.",
            "Completing challenges gives bonus XP (30-50 each).",
            `Maintain your ${metrics.streak}-day streak — breaking it resets your XP multiplier.`,
            "Friends in the leaderboard can challenge you for double XP.",
          ]}
          progress={Math.min(100, (xp / xpNeeded) * 100)}
        />
      </div>

      {/* Score Wrapped - Clickable */}
      <div className="mb-5">
        <ExpandableTipCard
          icon={Calendar}
          title="Score Wrapped"
          subtitle={`Daily ${metrics.healthScore} · Monthly ${Math.round(metrics.healthScore * 0.95)} · Yearly ${Math.round(metrics.healthScore * 0.91)}`}
          colorClass="text-health-progress"
          summary={`Your health score has improved over time. Today: ${metrics.healthScore}, Monthly avg: ${Math.round(metrics.healthScore * 0.95)}, Yearly avg: ${Math.round(metrics.healthScore * 0.91)}.`}
          tips={[
            "Score combines steps, sleep, heart rate, hydration, and nutrition.",
            "80+ is excellent, 60-79 is good, below 60 needs improvement.",
            "Yearly trends matter more than daily fluctuations.",
            "Consistency in 3+ areas drives the biggest score gains.",
          ]}
        >
          <div className="grid grid-cols-3 gap-2">
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
        </ExpandableTipCard>
      </div>

      {/* Leaderboard - Clickable */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Trophy className="w-4 h-4" /> Weekly Leaderboard · Tap for tips
      </p>
      <div className="mb-5">
        <ExpandableTipCard
          icon={Trophy}
          title={`You're #${yourRank} of ${leaderboard.length}`}
          subtitle={`${metrics.steps.toLocaleString()} steps this week`}
          colorClass="text-health-progress"
          summary={stepsToFirst > 0
            ? `You need ${stepsToFirst.toLocaleString()} more steps to take the #1 spot from ${leaderboard[0].name}.`
            : `🏆 You're in 1st place! Maintain your lead with daily walks.`}
          tips={
            stepsToFirst > 0
              ? [
                  `${stepsToFirst.toLocaleString()} steps ≈ a ${Math.ceil(stepsToFirst / 100)}-minute walk at brisk pace.`,
                  "Take a longer evening walk to overtake the leader.",
                  "Walking meetings or treadmill desks help racking up steps fast.",
                  "Challenge a friend directly for extra motivation.",
                ]
              : [
                  "Don't get complacent — others are catching up.",
                  "Maintain a 2,000+ step buffer for safety.",
                  "Help others by sharing your routine in challenges.",
                ]
          }
        >
          <div className="space-y-1.5">
            {leaderboard.map((user) => (
              <div key={user.name} className={`flex items-center gap-3 p-2 rounded-lg ${user.name === "You" ? "bg-primary/10" : "bg-muted/30"}`}>
                <span className="text-base w-6 text-center">{user.rank === 1 ? "👑" : user.avatar}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.steps.toLocaleString()} steps</p>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">#{user.rank}</span>
              </div>
            ))}
          </div>
        </ExpandableTipCard>
      </div>

      {/* Achievements - Clickable */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Award className="w-4 h-4" /> Achievements · Tap for details
      </p>
      <div className="space-y-2 mb-5">
        {achievements.map((a) => (
          <ExpandableTipCard
            key={a.name}
            title={`${a.icon} ${a.name}`}
            subtitle={a.unlocked ? "✓ Unlocked" : `${a.progress}% progress`}
            colorClass={a.unlocked ? "text-health-progress" : "text-muted-foreground"}
            summary={a.details}
            tips={
              a.unlocked
                ? [a.desc, "Share this milestone with friends for bonus XP!", "Challenge yourself with a higher tier next."]
                : [
                    `Goal: ${a.desc}.`,
                    `You're ${a.progress}% there — ${100 - (a.progress || 0)}% to go.`,
                    "Daily consistency beats heroic single-day efforts.",
                  ]
            }
            progress={a.unlocked ? 100 : a.progress}
          />
        ))}
      </div>

      {/* Challenges - Clickable */}
      <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Target className="w-4 h-4" /> Challenges · Tap for tips
      </p>
      <div className="space-y-2">
        {challenges.map((c) => (
          <ExpandableTipCard
            key={c.name}
            title={c.name}
            subtitle={`${c.desc} · 🎁 ${c.reward}`}
            colorClass={c.color}
            summary={c.details}
            tips={c.tips}
            rightContent={
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium mr-1 ${c.joined ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {c.joined ? "Joined" : "Join"}
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
