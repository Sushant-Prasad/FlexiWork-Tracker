import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "MATCH":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "DEVIATION":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    case "UNLOGGED":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "UNEXPECTED":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
  }
};

const getModeColor = (mode) => {
  switch (mode) {
    case "OFFICE":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "REMOTE":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "HYBRID":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "ABSENT":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "UNLOGGED":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
  }
};

const TeamMembersTable = ({ snapshot, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg border border-white/10 overflow-hidden mb-8 animate-pulse">
        <div className="p-6 border-b border-white/10">
          <div className="h-6 bg-white/20 rounded w-1/4"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-white/10 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const members = snapshot?.members || [];

  if (members.length === 0) {
    return (
      <div className="glass-card rounded-lg border border-white/10 p-8 text-center mb-8">
        <p className="text-zinc-400">No team members data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg border border-white/10 overflow-hidden mb-8">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Team Members Status</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-300">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-300">Planned Mode</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-300">Actual Mode</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-300">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-300">Hours</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{member.employee}</p>
                    <p className="text-xs text-zinc-400">{member.role}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={`${getModeColor(member.plannedMode)} border`}>
                    {member.plannedMode}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={`${getModeColor(member.actualMode)} border`}>
                    {member.actualMode}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.attendanceStatus === "MATCH" && (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Match
                        </Badge>
                      </>
                    )}
                    {member.attendanceStatus === "DEVIATION" && (
                      <>
                        <AlertCircle size={16} className="text-orange-400" />
                        <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Deviation
                        </Badge>
                      </>
                    )}
                    {member.attendanceStatus === "UNLOGGED" && (
                      <>
                        <Clock size={16} className="text-red-400" />
                        <Badge className="bg-red-500/20 text-red-300 border border-red-500/30">
                          Unlogged
                        </Badge>
                      </>
                    )}
                    {member.attendanceStatus === "UNEXPECTED" && (
                      <>
                        <AlertCircle size={16} className="text-yellow-400" />
                        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          Unexpected
                        </Badge>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-medium">{member.workedHours.toFixed(1)}h</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersTable;
