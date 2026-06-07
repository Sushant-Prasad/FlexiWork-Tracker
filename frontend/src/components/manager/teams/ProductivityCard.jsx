import { CheckCircle2, Clock, Eye } from "lucide-react";

const PillMetric = ({ icon: Icon, label, value, unit = "" }) => (
  <div className="relative flex flex-col items-center justify-center rounded-xl bg-prime p-4 w-28 h-40">
    <div className="absolute -top-4 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/10">
      <Icon size={20} className="text-white" />
    </div>
    <div className="mt-6 text-center">
      <p className="text-sm text-white/80 mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}<span className="text-sm text-white/80 ml-1">{unit}</span></p>
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
    <div className="rounded-2xl p-6 bg-prime-dark border border-primary/20 mb-8 text-white">
      <h3 className="text-xl font-semibold text-white mb-6">Team Productivity</h3>

      <div className="flex items-start gap-4">
        <PillMetric icon={CheckCircle2} label="Completed" value={tasksCompleted} />
        <PillMetric icon={Clock} label="Avg Hours" value={averageHours} unit="h" />
        <PillMetric icon={Eye} label="Pending" value={pendingReviews} />
      </div>

      <div className="mt-6 inline-block p-4 bg-prime rounded-lg">
        <p className="text-sm text-white/80">
          Updated today at <span className="text-white font-medium">{new Date().toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductivityCard;
