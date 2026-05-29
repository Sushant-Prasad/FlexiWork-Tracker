import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, ClipboardList, Flame } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FadeIn } from "../../components/motion/FadeIn.jsx";
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
    return <div className="p-6 text-muted-foreground">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-destructive">Failed to load dashboard</div>;
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

  const stats = [
    {
      label: "Employees Online",
      value: dashboard.todayMode && dashboard.todayMode !== "UNLOGGED" ? 1 : 0,
      badge: "+12%",
    },
    {
      label: "Pending Tasks",
      value: dashboard.assignedTasks || 0,
      badge: "-4%",
    },
    {
      label: "Worked Hours",
      value: dashboard.workedHours || 0,
      badge: "+6%",
    },
    {
      label: "Attendance %",
      value: dashboard.todayMode && dashboard.todayMode !== "UNLOGGED" ? 100 : 0,
      badge: "+3%",
    },
  ];

  const attendanceTrend = [
    { name: "Mon", hours: 7.5 },
    { name: "Tue", hours: 8.0 },
    { name: "Wed", hours: 8.2 },
    { name: "Thu", hours: 7.8 },
    { name: "Fri", hours: 8.5 },
  ];

  const workModeSplit = [
    { name: "Office", value: 3 },
    { name: "Remote", value: 5 },
    { name: "Hybrid", value: 2 },
  ];

  const taskCompletion = [
    { name: "Assigned", value: dashboard.assignedTasks || 0 },
    { name: "Completed", value: Math.max((dashboard.assignedTasks || 0) - 2, 0) },
  ];

  const pieColors = ["#245BA7", "#3B82F6", "#93C5FD"];

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="rounded-[28px] border border-border bg-gradient-to-r from-white via-[#EFF6FF] to-white p-8 shadow-[0_10px_30px_rgba(36,91,167,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Welcome Back f44b
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">
            Track attendance, productivity and team performance.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Your daily snapshot is ready. Stay on top of work mode changes and
            keep tasks moving forward.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-card p-5 shadow-[0_6px_16px_rgba(15,23,42,0.06)] card-hover"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {item.badge}
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)] card-hover"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>

                    <h2 className="mt-3 text-3xl font-bold text-foreground">
                      {card.value}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Today's Summary
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Work Mode
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {dashboard.todayMode || "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Hours
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {dashboard.workedHours || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Tasks
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {dashboard.assignedTasks || 0}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-foreground">
              Attendance Trend
            </h3>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend}>
                  <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} />
                  <YAxis stroke="#94A3B8" tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#245BA7"
                    strokeWidth={3}
                    dot={{ fill: "#245BA7" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-foreground">Work Mode Split</h3>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={workModeSplit}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {workModeSplit.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-foreground">Task Completion</h3>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCompletion}>
                  <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} />
                  <YAxis stroke="#94A3B8" tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default EmployeeDashboard;
