import { Users, MapPin, LogIn, AlertCircle } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const TeamOverviewCards = ({ overview, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="glass-card rounded-lg p-6 border border-white/10 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-white/20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Users}
        label="Total Members"
        value={overview?.memberCount || 0}
        color="bg-blue-500/20"
      />
      <StatCard
        icon={MapPin}
        label="Office Today"
        value={overview?.officeToday || 0}
        color="bg-emerald-500/20"
      />
      <StatCard
        icon={LogIn}
        label="Remote Today"
        value={overview?.remoteToday || 0}
        color="bg-purple-500/20"
      />
      <StatCard
        icon={AlertCircle}
        label="Unlogged"
        value={overview?.unlogged || 0}
        color="bg-orange-500/20"
      />
    </div>
  );
};

export default TeamOverviewCards;
