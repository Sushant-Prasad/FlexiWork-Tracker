import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, ClipboardList, Flame } from "lucide-react";
import { getEmployeeDashboard } from "../../services/dashboardServices.js";

const TOKEN_KEY = "flexiwork_token";

const EmployeeDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["employee-dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error("Authentication token missing.");
      }
      return getEmployeeDashboard(token);
    },
  });

  if (isLoading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load dashboard</div>;
  }

  const dashboard = data?.data || {};

  const cards = [
    {
      title: "Today's Mode",
      value: dashboard.todayMode || "N/A",
      icon: CalendarDays,
    },
    {
      title: "Worked Hours",
      value: dashboard.workedHours || 0,
      icon: Clock,
    },
    {
      title: "Attendance Streak",
      value: `${dashboard.attendanceStreak || 0} Days`,
      icon: Flame,
    },
    {
      title: "Assigned Tasks",
      value: dashboard.assignedTasks || 0,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>

        <p className="mt-2 text-zinc-400">
          Overview of your attendance, tasks, and productivity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{card.title}</p>

                  <h2 className="mt-3 text-3xl font-bold text-white">
                    {card.value}
                  </h2>
                </div>

                <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-500">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Quick Summary</h2>

        <div className="space-y-3 text-zinc-300">
          <p>
            Current Work Mode:
            <span className="ml-2 font-semibold text-white">
              {dashboard.todayMode || "N/A"}
            </span>
          </p>

          <p>
            Total Hours Today:
            <span className="ml-2 font-semibold text-white">
              {dashboard.workedHours || 0}
            </span>
          </p>

          <p>
            Assigned Tasks:
            <span className="ml-2 font-semibold text-white">
              {dashboard.assignedTasks || 0}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
