import { CheckCircle2, Clock, Eye } from "lucide-react";

const MetricItem = ({ icon: Icon, label, value, unit = "", color = "text-blue-400" }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
    <div className={`p-3 rounded-full bg-white/10 border border-white/20`}>
      <Icon size={20} className={color} />
    </div>
    <div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">
        {value}
        <span className="text-sm text-zinc-400 ml-1">{unit}</span>
      </p>
    </div>
  </div>
);

const ProductivityCard = ({ productivity, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 border border-white/10 mb-8 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const tasksCompleted = productivity?.tasksCompleted || 0;
  const averageHours = productivity?.averageHours || 0;
  const pendingReviews = productivity?.pendingReviews || 0;

  return (
    <div className="glass-card rounded-lg p-6 border border-white/10 mb-8">
      <h3 className="text-lg font-semibold text-white mb-6">Team Productivity</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricItem
          icon={CheckCircle2}
          label="Tasks Completed Today"
          value={tasksCompleted}
          color="text-emerald-400"
        />
        <MetricItem
          icon={Clock}
          label="Avg Worked Hours"
          value={averageHours}
          unit="hrs"
          color="text-blue-400"
        />
        <MetricItem
          icon={Eye}
          label="Pending Reviews"
          value={pendingReviews}
          color="text-orange-400"
        />
      </div>

      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs text-zinc-400">
          Updated today at <span className="text-white font-medium">{new Date().toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductivityCard;
