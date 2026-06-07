import dayjs from "dayjs";

const TeamSnapshotTable = ({ snapshot, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg border border-white/10 overflow-hidden mb-8 animate-pulse">
        <div className="p-6 border-b border-white/10">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-white/10 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const today = snapshot?.date || new Date().toISOString().slice(0, 10);
  const members = snapshot?.members || [];

  const summary = {
    total: members.length,
    matched: members.filter((m) => m.attendanceStatus === "MATCH").length,
    deviated: members.filter((m) => m.attendanceStatus === "DEVIATION").length,
    unlogged: members.filter((m) => m.attendanceStatus === "UNLOGGED").length,
    totalHours: members.reduce((sum, m) => sum + (m.workedHours || 0), 0),
  };

  return (
    <div className="glass-card rounded-lg border border-white/10 overflow-hidden mb-8">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Daily Snapshot</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Generated for {dayjs(today).format("MMMM DD, YYYY")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-300">Team: {snapshot?.teamName}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-white/10">
        <div className="text-center">
          <p className="text-xs text-zinc-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{summary.total}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 mb-1">Matched</p>
          <p className="text-2xl font-bold text-emerald-400">{summary.matched}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 mb-1">Deviated</p>
          <p className="text-2xl font-bold text-orange-400">{summary.deviated}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 mb-1">Unlogged</p>
          <p className="text-2xl font-bold text-red-400">{summary.unlogged}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-blue-400">{summary.totalHours.toFixed(1)}</p>
        </div>
      </div>

      {/* Detailed List */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Member Details</h4>
        <div className="space-y-3">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-prime border border-white/10 rounded-lg hover:bg-prime-80 transition-colors text-white"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{member.employee}</p>
                <p className="text-xs text-zinc-400">
                  Plan: <span className="text-white">{member.plannedMode}</span> → Actual:{" "}
                  <span className="text-white">{member.actualMode}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Status</p>
                  <p
                    className={`text-sm font-semibold ${
                      member.attendanceStatus === "MATCH"
                        ? "text-emerald-400"
                        : member.attendanceStatus === "DEVIATION"
                        ? "text-orange-400"
                        : member.attendanceStatus === "UNLOGGED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {member.attendanceStatus}
                  </p>
                </div>
                <div className="text-right w-16">
                  <p className="text-xs text-zinc-400">Hours</p>
                  <p className="text-sm font-semibold text-white">{member.workedHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSnapshotTable;
