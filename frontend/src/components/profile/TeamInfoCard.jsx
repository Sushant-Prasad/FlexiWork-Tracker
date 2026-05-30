import { Link } from "react-router-dom";
import { Users, Crown, Building2, ArrowRight } from "lucide-react";

/*
==================================================
TEAM INFO CARD
--------------------------------------------------
Purpose:
  Shows the user's team name, member count, and
  manager name. Data comes from GET /api/users/team
  which now returns a `team` object.

Props:
  - teamData: { data: members[], team: { name, site, managerId } }
  - isLoading: boolean
==================================================
*/

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const TeamInfoCard = ({ teamData, isLoading }) => {
  if (isLoading) {
    return <div className="h-36 animate-pulse rounded-2xl bg-muted" />;
  }

  const members = teamData?.data || [];
  const team = teamData?.team || {};

  const manager = members.find(
    (m) => m._id?.toString() === team.managerId?.toString()
  );

  if (!team._id) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          You are not assigned to a team yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Team name + site */}
      <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 size={16} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Team
          </p>
          <p className="text-sm font-semibold text-foreground">
            {team.name || "—"}
            {team.site && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                · {team.site}
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-muted-foreground">Members</p>
          <p className="text-lg font-bold text-foreground">{members.length}</p>
        </div>
      </div>

      {/* Manager */}
      {manager && (
        <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shrink-0">
            {manager.avatarUrl ? (
              <img
                src={manager.avatarUrl}
                alt={manager.name}
                className="h-9 w-9 rounded-xl object-cover"
              />
            ) : (
              getInitials(manager.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Manager
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {manager.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {manager.email}
            </p>
          </div>
          <Crown size={16} className="shrink-0 text-primary" />
        </div>
      )}

      {/* View team link */}
      <Link
        to="/employee/team"
        className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
      >
        View all team members
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};

export default TeamInfoCard;
