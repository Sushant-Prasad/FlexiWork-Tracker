import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  getTeamOverview,
  getTeamOccupancy,
  getTeamProductivity,
  getTeamDailySnapshot,
  listTeams,
  getMyTeam,
} from "@/services/teamServices";
import TeamOverviewCards from "@/components/manager/teams/TeamOverviewCards";
import TeamInfoCard from "@/components/manager/teams/TeamInfoCard";
import OccupancyCard from "@/components/manager/teams/OccupancyCard";
import WorkModeChart from "@/components/manager/teams/WorkModeChart";
import TeamMembersTable from "@/components/manager/teams/TeamMembersTable";
import AttendanceExceptions from "@/components/manager/teams/AttendanceExceptions";
import ProductivityCard from "@/components/manager/teams/ProductivityCard";
import TeamSnapshotTable from "@/components/manager/teams/TeamSnapshotTable";
import { AlertCircle } from "lucide-react";

const ManagerTeams = () => {
  const { user, token } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Fetch list of teams managed by this manager
  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
  } = useQuery({
    queryKey: ["managerTeams", user?._id],
    queryFn: () => listTeams(token),
    enabled: !!token && user?.role === "MANAGER",
  });

  // Fetch user's own team (if they have a teamId)
  const {
    data: userTeamData,
    isLoading: userTeamLoading,
    error: userTeamError,
  } = useQuery({
    queryKey: ["myTeam"],
    queryFn: () => getMyTeam(token),
    enabled: !!token,
    retry: false,
  });

  // Combine all teams (user's team + managed teams, remove duplicates)
  const allTeams = useMemo(() => {
    const teams = [
      ...(userTeamData?.team ? [userTeamData.team] : []),
      ...(teamsData?.teams || []),
    ].filter(Boolean);

    return teams.filter(
      (team, index, self) =>
        team?._id && index === self.findIndex((item) => item?._id === team._id)
    );
  }, [teamsData, userTeamData]);

  // Auto-select first team if available
  useEffect(() => {
    if (allTeams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(allTeams[0]._id);
    }
  }, [allTeams, selectedTeamId]);

  const selectedTeam = useMemo(() => {
    return allTeams.find((team) => team._id === selectedTeamId) || null;
  }, [allTeams, selectedTeamId]);

  // Fetch team overview
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useQuery({
    queryKey: ["teamOverview", selectedTeamId],
    queryFn: () => getTeamOverview(selectedTeamId, token),
    enabled: !!selectedTeamId && !!token,
  });

  // Fetch team occupancy
  const {
    data: occupancyData,
    isLoading: occupancyLoading,
    error: occupancyError,
  } = useQuery({
    queryKey: ["teamOccupancy", selectedTeamId],
    queryFn: () => getTeamOccupancy(selectedTeamId, token),
    enabled: !!selectedTeamId && !!token,
  });

  // Fetch team productivity
  const {
    data: productivityData,
    isLoading: productivityLoading,
    error: productivityError,
  } = useQuery({
    queryKey: ["teamProductivity", selectedTeamId],
    queryFn: () => getTeamProductivity(selectedTeamId, token),
    enabled: !!selectedTeamId && !!token,
  });

  // Fetch team daily snapshot
  const {
    data: snapshotData,
    isLoading: snapshotLoading,
    error: snapshotError,
  } = useQuery({
    queryKey: ["teamSnapshot", selectedTeamId],
    queryFn: () => getTeamDailySnapshot(selectedTeamId, token),
    enabled: !!selectedTeamId && !!token,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-white">Team Management</h1>
        <p className="text-sm text-zinc-400 mt-2">
          Monitor your team's attendance, capacity, and productivity
        </p>
      </section>

      {/* Team Selector */}
      {allTeams.length > 1 && (
        <div className="glass-card rounded-lg p-4 border border-white/10">
          <p className="text-sm text-zinc-400 mb-3">Select Team</p>
          <div className="flex gap-2 flex-wrap">
            {allTeams.map((team) => (
              <button
                key={team._id}
                onClick={() => setSelectedTeamId(team._id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedTeamId === team._id
                    ? "bg-blue-500/20 border-blue-400 text-blue-300"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error States */}
      {(teamsError || (userTeamError && !userTeamError.message.includes("not assigned")) || overviewError || occupancyError || productivityError || snapshotError) && (
        <div className="glass-card rounded-lg p-4 border border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-300">Error Loading Data</p>
              <p className="text-xs text-red-200 mt-1">
                {teamsError?.message ||
                  (userTeamError && !userTeamError.message.includes("not assigned") ? userTeamError?.message : null) ||
                  overviewError?.message ||
                  occupancyError?.message ||
                  productivityError?.message ||
                  snapshotError?.message ||
                  "Failed to load team data"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!teamsLoading && !userTeamLoading && allTeams.length === 0 && (
        <div className="glass-card rounded-lg p-8 border border-white/10 text-center">
          <p className="text-zinc-400 mb-2">No teams assigned to you</p>
          <p className="text-xs text-zinc-500">
            You'll see team data here once you're assigned to a team or manage one.
          </p>
        </div>
      )}

      {/* Content */}
      {selectedTeamId && (
        <>
          {/* Overview Cards */}
          <TeamOverviewCards overview={overviewData} isLoading={overviewLoading} />

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Team Info */}
              <TeamInfoCard
                overview={overviewData}
                team={selectedTeam}
                isLoading={overviewLoading && !selectedTeam}
              />

              {/* Team Members Table */}
              <TeamMembersTable snapshot={snapshotData} isLoading={snapshotLoading} />

              {/* Attendance Exceptions */}
              <AttendanceExceptions snapshot={snapshotData} isLoading={snapshotLoading} />
            </div>

            <div className="space-y-8">
              {/* Office Occupancy */}
              <OccupancyCard occupancy={occupancyData} isLoading={occupancyLoading} />

              {/* Work Mode Distribution */}
              <WorkModeChart snapshot={snapshotData} isLoading={snapshotLoading} />

              {/* Productivity */}
              <ProductivityCard productivity={productivityData} isLoading={productivityLoading} />
            </div>
          </div>

          {/* Daily Snapshot */}
          <TeamSnapshotTable snapshot={snapshotData} isLoading={snapshotLoading} />
        </>
      )}
    </div>
  );
};

export default ManagerTeams;
