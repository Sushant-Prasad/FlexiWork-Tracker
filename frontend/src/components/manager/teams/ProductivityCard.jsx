import { CheckCircle2, Clock, Eye, TrendingUp } from "lucide-react";

const MetricCard = ({ icon: Icon, label, value, unit = "", color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-200",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-200",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4 sm:p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white/5 rounded-md">
          <Icon size={18} className={`${colorClasses[color].includes("blue") ? "text-blue-200" : colorClasses[color].includes("emerald") ? "text-emerald-200" : "text-amber-200"}`} />
        </div>
      </div>
      <p className="text-xs text-white/70 font-medium mb-1">{label}</p>
      <div className="flex items-baseline">
        <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
        {unit && <p className="text-xs sm:text-sm text-white/60 ml-2">{unit}</p>}
      </div>
    </div>
  );
};

const ProductivityCard = ({ productivity, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl p-6 sm:p-8 gradient-bg border border-white/10 animate-pulse text-white">
        <div className="h-8 bg-white/20 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
          ))}
        </div>
        <div className="mt-6 h-12 bg-white/10 rounded-lg w-1/2"></div>
      </div>
    );
  }

  const tasksCompleted = productivity?.tasksCompleted || 0;
  const averageHours = productivity?.averageHours || 0;
  const pendingReviews = productivity?.pendingReviews || 0;

  return (
    <div className="rounded-xl p-6 sm:p-8 gradient-bg border border-white/10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Team Productivity</h3>
          <p className="text-xs text-white/60 mt-1">Performance metrics overview</p>
        </div>
        <div className="p-2 bg-white/5 rounded-md">
          <TrendingUp size={22} className="text-blue-200" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <MetricCard icon={CheckCircle2} label="Tasks Completed" value={tasksCompleted} color="emerald" />
        <MetricCard icon={Clock} label="Average Hours" value={Math.round(averageHours)} unit="hrs" color="blue" />
        <MetricCard icon={Eye} label="Pending Reviews" value={pendingReviews} color="amber" />
      </div>

      {/* Footer */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs text-white/70">
          <span className="font-semibold">Last updated:</span> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ProductivityCard;
