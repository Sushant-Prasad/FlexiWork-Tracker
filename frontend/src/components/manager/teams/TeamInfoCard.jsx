import { Building2, User, Users } from "lucide-react";

const TeamInfoCard = ({ overview, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 border border-white/10 mb-8 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-white/10 rounded w-1/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const info = [
    {
      label: "Team Name",
      value: overview?.teamName || "N/A",
      icon: Users,
    },
    {
      label: "Manager",
      value: overview?.manager?.name || "N/A",
      icon: User,
    },
    {
      label: "Office Capacity",
      value: `${overview?.officeCapacity || 0} seats`,
      icon: Building2,
    },
    {
      label: "Site Location",
      value: overview?.site || "Not specified",
      icon: Building2,
    },
  ];

  return (
    <div className="glass-card rounded-lg p-6 border border-white/10 mb-8">
      <h3 className="text-lg font-semibold text-white mb-6">Team Information</h3>
      <div className="space-y-4">
        {info.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-b-0">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-zinc-400" />
                <span className="text-sm text-zinc-400">{item.label}</span>
              </div>
              <span className="font-medium text-white">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamInfoCard;
