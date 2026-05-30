import { Users, Crown, Building2, Wifi } from "lucide-react";

/*
==================================================
TEAM OVERVIEW CARDS
--------------------------------------------------
Purpose:
  4 stat cards — Total Members, Manager count,
  Employees, and a role breakdown. Derived entirely
  from the member list returned by GET /api/users/team.

Props:
  - members: array of user objects
  - isLoading: boolean
==================================================
*/

const TeamOverviewCards = ({ members, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    );
  }

  const total = members.length;
  const managers = members.filter((m) => m.role === "MANAGER").length;
  const employees = members.filter((m) => m.role === "EMPLOYEE").length;
  const admins = members.filter((m) => m.role === "SYSTEM_ADMIN").length;

  const CARDS = [
    { label: "Total Members", value: total, icon: Users },
    { label: "Managers", value: managers, icon: Crown },
    { label: "Employees", value: employees, icon: Building2 },
    { label: "Admins", value: admins, icon: Wifi },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                {label}
              </p>
              <p className="mt-3 text-4xl font-bold text-white">{value}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Icon size={22} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamOverviewCards;
