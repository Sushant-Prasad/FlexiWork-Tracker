import { AlertTriangle, Clock, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AttendanceExceptions = ({ snapshot, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg border border-white/10 p-6 mb-8 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-white/10 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const members = snapshot?.members || [];

  // Get exceptions
  const exceptions = members.filter((m) => m.attendanceStatus !== "MATCH");

  if (exceptions.length === 0) {
    return (
      <div className="glass-card rounded-lg border border-white/10 p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Attendance Exceptions</h3>
        <p className="text-zinc-400">✓ All team members are on track</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg border border-white/10 p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-6">Attendance Exceptions</h3>

      <div className="space-y-4">
        {exceptions.map((member, idx) => {
          let icon = AlertTriangle;
          let bgColor = "bg-orange-500/20 border-orange-500/30";
          let textColor = "text-orange-300";
          let statusText = "Deviation";

          if (member.attendanceStatus === "UNLOGGED") {
            icon = Clock;
            bgColor = "bg-red-500/20 border-red-500/30";
            textColor = "text-red-300";
            statusText = "Unlogged";
          } else if (member.attendanceStatus === "UNEXPECTED") {
            icon = UserX;
            bgColor = "bg-yellow-500/20 border-yellow-500/30";
            textColor = "text-yellow-300";
            statusText = "Unexpected";
          }

          const Icon = icon;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg border ${bgColor} transition-colors hover:bg-opacity-40`}
            >
              <div className="flex items-center gap-4">
                <Icon size={20} className={textColor} />
                <div>
                  <p className="font-medium text-white">{member.employee}</p>
                  <p className="text-xs text-zinc-400">
                    Planned: {member.plannedMode} | Actual: {member.actualMode}
                  </p>
                </div>
              </div>
              <Badge className={`${bgColor} border`}>{statusText}</Badge>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs text-zinc-400">
          <strong>{exceptions.length}</strong> team member{exceptions.length !== 1 ? "s" : ""} with
          attendance exceptions
        </p>
      </div>
    </div>
  );
};

export default AttendanceExceptions;
