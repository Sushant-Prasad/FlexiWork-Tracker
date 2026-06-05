import { Building2 } from "lucide-react";

const OccupancyCard = ({ occupancy, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 border border-white/10 mb-8 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const capacity = occupancy?.capacity || 1;
  const occupied = occupancy?.occupied || 0;
  const available = occupancy?.available || 0;
  const percentage = occupancy?.occupancyPercentage || 0;

  return (
    <div className="glass-card rounded-lg p-6 border border-white/10 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Office Occupancy</h3>
        <Building2 size={24} className="text-blue-400" />
      </div>

      <div className="space-y-4">
        {/* Occupancy Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Capacity Usage</span>
            <span className="text-sm font-semibold text-white">{percentage}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percentage > 80
                  ? "bg-red-500"
                  : percentage > 50
                  ? "bg-yellow-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Occupancy Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{occupied}</p>
            <p className="text-xs text-zinc-400 mt-1">Occupied</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{available}</p>
            <p className="text-xs text-zinc-400 mt-1">Available</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{capacity}</p>
            <p className="text-xs text-zinc-400 mt-1">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyCard;
