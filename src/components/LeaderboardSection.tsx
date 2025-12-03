import { Trophy, Medal, Award } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Sarah Chen", points: 24580, avatar: "SC", streak: 45 },
  { rank: 2, name: "Marcus Johnson", points: 23120, avatar: "MJ", streak: 38 },
  { rank: 3, name: "Elena Rodriguez", points: 21890, avatar: "ER", streak: 52 },
  { rank: 4, name: "James Wilson", points: 20450, avatar: "JW", streak: 29 },
  { rank: 5, name: "Aisha Patel", points: 19870, avatar: "AP", streak: 33 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-primary" />;
    case 2:
      return <Medal className="w-5 h-5 text-[hsl(40,30%,60%)]" />;
    case 3:
      return <Award className="w-5 h-5 text-[hsl(30,40%,45%)]" />;
    default:
      return <span className="text-muted-foreground font-heading font-bold">{rank}</span>;
  }
};

const LeaderboardSection = () => {
  return (
    <section id="leaderboard" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-hero-gradient opacity-30" />
      
      <div className="container px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Compete with the <span className="text-gradient">Elite</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our global leaderboard showcases top performers from around the world. 
              Track your ranking, earn badges, and rise through the ranks.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-6 rounded-2xl">
                <div className="text-3xl font-heading font-bold text-gradient mb-2">150+</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Countries Represented</div>
              </div>
              <div className="glass p-6 rounded-2xl">
                <div className="text-3xl font-heading font-bold text-gradient mb-2">$50K</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">Monthly Prizes</div>
              </div>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Global Rankings</h3>
              <span className="text-sm text-muted-foreground uppercase tracking-wide">This Month</span>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-secondary/50 ${
                    index === 0 ? "bg-primary/10 border border-primary/20" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                    index === 0 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    {user.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      🔥 {user.streak} day streak
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="font-heading font-bold text-foreground">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">points</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 text-primary font-heading font-semibold hover:underline underline-offset-4 transition-all uppercase tracking-wider">
              View Full Leaderboard →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
