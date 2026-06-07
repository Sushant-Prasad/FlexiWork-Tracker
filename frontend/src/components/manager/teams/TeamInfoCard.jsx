import { Building2, User, Users } from "lucide-react";

const getManagerName = (overview, team) => {
  const manager = overview?.manager || team?.managerId || team?.manager;
  if (typeof manager === "string") return "N/A";
  return manager?.name || "N/A";
};

const TeamInfoCard = ({ overview, team, isLoading }) => {
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

  const memberCount = overview?.memberCount ?? team?.members?.length ?? 0;
  const officeCapacity = overview?.officeCapacity ?? team?.officeCapacity ?? 0;

  const info = [
    {
      label: "Team Name",
      value: overview?.teamName || team?.name || "N/A",
      icon: Users,
    },
    {
      label: "Manager",
      value: getManagerName(overview, team),
      icon: User,
    },
    {
      label: "Members",
      value: memberCount,
      icon: Users,
    },
    {
      label: "Office Capacity",
      value: `${officeCapacity} seats`,
      icon: Building2,
    },
    {
      label: "Site Location",
      value: overview?.site || team?.site || "Not specified",
      icon: Building2,
    },
  ];

  return (
    <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 text-white">
      <h3 className="text-lg font-semibold text-white mb-6">Team Information</h3>
      <div className="space-y-4">
        {info.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-b-0">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-white/80" />
                <span className="text-sm text-white/80">{item.label}</span>
              </div>
              <span className="max-w-[55%] truncate text-right font-medium text-white">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamInfoCard;
