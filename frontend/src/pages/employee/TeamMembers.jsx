import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users } from "lucide-react";
import { FadeIn } from "../../components/motion/FadeIn.jsx";
import TeamOverviewCards from "../../components/team/TeamOverviewCards.jsx";
import ManagerCard from "../../components/team/ManagerCard.jsx";
import TeamSearch from "../../components/team/TeamSearch.jsx";
import TeamMemberCard from "../../components/team/TeamMemberCard.jsx";

/*
==================================================
TEAM MEMBERS PAGE
--------------------------------------------------
API:
  GET /api/users/team — all members of the user's
  team, including the manager.

Purpose:
  Answers: Who is my manager? Who are my teammates?
  What are their roles? How can I contact them?

Business Logic:
  Manager = member with role === "MANAGER".
  Employees = all other members.
  Search filters name and email client-side.
==================================================
*/

const TOKEN_KEY = "flexiwork_token";
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002/api";

const fetchTeamMembers = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/team`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    // Normalize error so error.message is the backend message
    const msg =
      err?.response?.data?.message || err.message || "Failed to fetch team";
    throw new Error(msg);
  }
};

const TeamMembers = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return fetchTeamMembers(token);
    },
  });

  const members = useMemo(() => data?.data || [], [data]);
  const teamInfo = data?.team || {};

  // Manager identified by team.managerId — NOT by user role
  const manager = useMemo(
    () =>
      members.find(
        (m) => m._id?.toString() === teamInfo.managerId?.toString()
      ) || null,
    [members, teamInfo.managerId]
  );

  // Everyone who is NOT the manager
  const employees = useMemo(
    () =>
      members.filter(
        (m) => m._id?.toString() !== teamInfo.managerId?.toString()
      ),
    [members, teamInfo.managerId]
  );

  // Search filters employees (manager shown separately)
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return employees;
    return employees.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q)
    );
  }, [employees, search]);

  return (
    <section className="space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Team Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View your teammates, manager, roles, and contact information.
          </p>
        </div>
      </FadeIn>

      {/* ── Error State ─────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error.message === "User has no team"
            ? "You are not assigned to a team yet. Please contact your admin."
            : "Failed to load team members. Please try again."}
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <FadeIn delay={0.05}>
        <TeamOverviewCards members={members} isLoading={isLoading} />
      </FadeIn>

      {/* ── Manager Card ─────────────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Your Manager
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your direct reporting line
            </p>
          </div>
          <ManagerCard manager={manager} isLoading={isLoading} />
        </div>
      </FadeIn>

      {/* ── Team Members Grid ─────────────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">

          {/* Section header + search */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Team Members
              </h2>
              {!isLoading && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {employees.length} members
                </span>
              )}
            </div>
            <TeamSearch
              value={search}
              onChange={setSearch}
              resultCount={filtered.length}
              totalCount={employees.length}
            />
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-3xl bg-muted"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-14 text-center">
              <Users size={36} className="text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {search
                  ? `No members match "${search}"`
                  : "No team members found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((member) => (
                <TeamMemberCard key={member._id} member={member} />
              ))}
            </div>
          )}

        </div>
      </FadeIn>

    </section>
  );
};

export default TeamMembers;
