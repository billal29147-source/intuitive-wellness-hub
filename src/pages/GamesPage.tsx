import { Gamepad2, Trophy, Users, Star, Medal, ChevronRight } from "lucide-react";

const leaderboard = [
  { name: "You", steps: 8432, rank: 2, avatar: "🏃" },
  { name: "Sarah K.", steps: 9120, rank: 1, avatar: "👑" },
  { name: "Mike R.", steps: 7845, rank: 3, avatar: "💪" },
  { name: "Emma L.", steps: 6230, rank: 4, avatar: "🌟" },
];

const challenges = [
  { name: "Weekend Warrior", desc: "10K steps for 2 days", reward: "50 pts", joined: true, color: "text-health-steps" },
  { name: "Early Bird", desc: "Workout before 8 AM", reward: "30 pts", joined: false, color: "text-health-calories" },
  { name: "Hydration Hero", desc: "8 glasses daily for a week", reward: "40 pts", joined: true, color: "text-health-hydration" },
];

const GamesPage = () => {
  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Compete</p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-health-progress" /> Games & Challenges
        </h1>
      </div>

      {/* Your Stats */}
      <div className="glass-card rounded-3xl p-5 mb-5 health-glow-progress">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-health-progress/20 flex items-center justify-center text-2xl">
            🏆
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg">Level 14</p>
            <p className="text-xs text-muted-foreground">1,250 / 1,500 XP to next level</p>
            <div className="w-full h-2 bg-muted rounded-full mt-2">
              <div className="h-full bg-health-progress rounded-full" style={{ width: "83%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
          <Trophy className="w-4 h-4" /> Weekly Leaderboard
        </p>
        <Users className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="space-y-2 mb-5">
        {leaderboard.sort((a, b) => a.rank - b.rank).map((user) => (
          <div
            key={user.name}
            className={`glass-card rounded-2xl p-3 flex items-center gap-3 ${user.name === "You" ? "ring-1 ring-primary/40" : ""}`}
          >
            <span className="text-lg w-8 text-center">{user.avatar}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.steps.toLocaleString()} steps</p>
            </div>
            <div className="flex items-center gap-1">
              {user.rank === 1 && <Star className="w-4 h-4 text-health-calories fill-health-calories" />}
              {user.rank === 2 && <Medal className="w-4 h-4 text-muted-foreground" />}
              <span className="text-xs font-bold text-muted-foreground">#{user.rank}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Challenges */}
      <p className="text-sm font-semibold text-muted-foreground mb-3">Challenges</p>
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
