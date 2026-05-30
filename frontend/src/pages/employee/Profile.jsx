import { useQuery } from "@tanstack/react-query";
import { FadeIn } from "../../components/motion/FadeIn.jsx";
import ProfileHeader from "../../components/profile/ProfileHeader.jsx";
import PersonalInfoForm from "../../components/profile/PersonalInfoForm.jsx";
import AccountInfoCard from "../../components/profile/AccountInfoCard.jsx";
import PreferencesCard from "../../components/profile/PreferencesCard.jsx";
import TeamInfoCard from "../../components/profile/TeamInfoCard.jsx";
import ProfileStats from "../../components/profile/ProfileStats.jsx";
import { getMyProfile, getMyTeamMembers } from "../../services/userServices.js";
import { getAttendanceSummary } from "../../services/attendanceServices.js";
import { getMyWorkLogs } from "../../services/workLogServices.js";
import { getMyLeaves } from "../../services/leaveServices.js";
import { getMyTasks } from "../../services/taskServices.js";

/*
==================================================
PROFILE PAGE
--------------------------------------------------
API calls:
  GET /api/users/me         — profile data
  GET /api/users/team       — team info for TeamInfoCard
  GET /api/attendance/summary — streak for stats
  GET /api/worklogs/me      — work log count for stats
  GET /api/leaves/me        — approved leave count for stats
  GET /api/tasks/me         — task count for stats

Layout:
  Header (full width)
  Stats row (full width)
  [Personal Info | Account Info] (2 cols)
  [Preferences   | Team Info   ] (2 cols)
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

const Profile = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile(token),
    enabled: !!token,
  });

  const teamQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getMyTeamMembers(token),
    enabled: !!token,
  });

  const attendanceQuery = useQuery({
    queryKey: ["attendance-summary"],
    queryFn: () => getAttendanceSummary(token),
    enabled: !!token,
  });

  const worklogsQuery = useQuery({
    queryKey: ["my-worklogs"],
    queryFn: () => getMyWorkLogs({ page: 1, limit: 100 }, token),
    enabled: !!token,
  });

  const leavesQuery = useQuery({
    queryKey: ["my-leaves"],
    queryFn: () => getMyLeaves(token),
    enabled: !!token,
  });

  const tasksQuery = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => getMyTasks(token),
    enabled: !!token,
  });

  const user = profileQuery.data?.data;
  const isProfileLoading = profileQuery.isLoading;
  const statsLoading =
    attendanceQuery.isLoading ||
    worklogsQuery.isLoading ||
    leavesQuery.isLoading ||
    tasksQuery.isLoading;

  return (
    <section className="space-y-8">

      {/* ── Profile Header ────────────────────────────────────────────── */}
      <FadeIn>
        <ProfileHeader user={user} isLoading={isProfileLoading} />
      </FadeIn>

      {/* ── Quick Statistics ──────────────────────────────────────────── */}
      <FadeIn delay={0.05}>
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Quick Statistics
          </h2>
          <ProfileStats
            attendanceData={attendanceQuery.data}
            tasksData={tasksQuery.data}
            leavesData={leavesQuery.data}
            worklogsData={worklogsQuery.data}
            isLoading={statsLoading}
          />
        </div>
      </FadeIn>

      {/* ── Personal Info + Account Info ──────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Personal Info */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Personal Information
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Update your name, avatar, and timezone
              </p>
            </div>
            <PersonalInfoForm user={user} isLoading={isProfileLoading} />
          </div>

          {/* Account Info */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Account Information
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                System-controlled fields — read only
              </p>
            </div>
            <AccountInfoCard user={user} isLoading={isProfileLoading} />
          </div>

        </div>
      </FadeIn>

      {/* ── Preferences + Team Info ───────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Work Preferences */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Work Preferences
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Geo tracking and work log settings
              </p>
            </div>
            <PreferencesCard user={user} isLoading={isProfileLoading} />
          </div>

          {/* Team Information */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Team Information
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your team and manager details
              </p>
            </div>
            <TeamInfoCard
              teamData={teamQuery.data}
              isLoading={teamQuery.isLoading}
            />
          </div>

        </div>
      </FadeIn>

    </section>
  );
};

export default Profile;
