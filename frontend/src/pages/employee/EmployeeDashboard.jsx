import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, ClipboardList, Flame } from "lucide-react";
import { FadeIn } from "../../components/motion/FadeIn.jsx";
import AttendanceChart from "../../components/charts/AttendanceChart.jsx";
import TaskChart from "../../components/charts/TaskChart.jsx";
import WorkModeChart from "../../components/charts/WorkModeChart.jsx";
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

  const todayCards = [
    {
      title: "Today's Work Mode",
      value: dashboard.todayMode || "N/A",
      icon: CalendarDays,
    },
    {
      title: "Today's Shift",
      value: dashboard.shiftWindow || "09:00 AM - 06:00 PM",
      icon: Clock,
    },
    {
      title: "Hours Worked Today",
      value: `${dashboard.workedHours || 0} Hours`,
      icon: Flame,
    },
    {
      title: "Work Log Status",
      value: dashboard.workLogStatus || "Pending",
      icon: ClipboardList,
    },
  ];

  const taskCards = [
    {
      title: "Assigned Tasks",
      value: dashboard.assignedTasks || 0,
      icon: ClipboardList,
    },
    {
      title: "Pending Tasks",
      value: dashboard.pendingTasks || 0,
      icon: Clock,
    },
    {
      title: "In Progress Tasks",
      value: dashboard.inProgressTasks || 0,
      icon: Flame,
    },
    {
      title: "Completed Tasks",
      value: dashboard.completedTasks || 0,
      icon: CalendarDays,
    },
  ];

  const attendanceCards = [
    {
      title: "Attendance Streak",
      value: `${dashboard.attendanceStreak || 0} Days`,
      icon: Flame,
    },
    {
      title: "Monthly Attendance",
      value: `${dashboard.monthlyAttendancePct || 0}%`,
      icon: CalendarDays,
    },
    {
      title: "Office Days This Month",
      value: `${dashboard.officeDaysMonth || 0} Days`,
      icon: Clock,
    },
    {
      title: "Remote Days This Month",
      value: `${dashboard.remoteDaysMonth || 0} Days`,
      icon: ClipboardList,
    },
  ];

  const attendanceTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Worked Hours",
        data: [7.5, 8.0, 8.2, 7.8, 8.5],
        borderColor: "#245BA7",
        backgroundColor: "#245BA7",
        tension: 0.4,
      },
    ],
  };

  const workModeSplitData = {
    labels: ["Office", "Remote", "Hybrid"],
    datasets: [
      {
        data: [
          dashboard.officeDaysMonth || 3,
          dashboard.remoteDaysMonth || 5,
          dashboard.hybridDaysMonth || 2,
        ],
        backgroundColor: ["#245BA7", "#3B82F6", "#93C5FD"],
        borderWidth: 0,
      },
    ],
  };

  const taskProgressData = {
    labels: ["Todo", "In Progress", "Review", "Done"],
    datasets: [
      {
        label: "Tasks",
        data: [
          dashboard.todoTasks || 0,
          dashboard.inProgressTasks || 0,
          dashboard.reviewTasks || 0,
          dashboard.completedTasks || 0,
        ],
        backgroundColor: ["#245BA7", "#3B82F6", "#60A5FA", "#93C5FD"],
      },
    ],
  };

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="rounded-[28px] border border-border bg-gradient-to-r from-white via-[#EFF6FF] to-white p-8 shadow-[0_10px_30px_rgba(36,91,167,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Welcome Back
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Today's Status
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {todayCards.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-primary/40 bg-primary p-5 text-white shadow-[0_10px_24px_rgba(36,91,167,0.25)] card-hover"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80">{item.title}</p>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                    Today
                  </span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Tasks & Productivity
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {taskCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-primary/40 bg-primary p-6 text-white shadow-[0_10px_24px_rgba(36,91,167,0.25)] card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">{card.title}</p>

                      <h2 className="mt-3 text-3xl font-bold text-white">
                        {card.value}
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-white/15 p-3 text-white">
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Attendance & Adherence
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {attendanceCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-primary/40 bg-primary p-6 text-white shadow-[0_10px_24px_rgba(36,91,167,0.25)] card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">{card.title}</p>
                      <h2 className="mt-3 text-3xl font-bold text-white">
                        {card.value}
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3 text-white">
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Insights</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold text-foreground">
                Attendance Trend
              </h3>
              <div className="mt-4 h-52">
                <AttendanceChart data={attendanceTrendData} />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold text-foreground">
                Work Mode Distribution
              </h3>
              <div className="mt-4 h-52">
                <WorkModeChart data={workModeSplitData} />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold text-foreground">Task Progress</h3>
              <div className="mt-4 h-52">
                <TaskChart data={taskProgressData} />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Activities
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-primary/40 bg-primary p-6 text-white shadow-[0_10px_24px_rgba(36,91,167,0.25)] card-hover">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                Upcoming Shift
              </p>
              <p className="mt-3 text-lg font-semibold text-white">Tomorrow</p>
              <p className="mt-2 text-white/80">
                {dashboard.nextShiftMode || "Office"}
              </p>
              <p className="text-white/80">
                {dashboard.nextShiftWindow || "09:00 AM - 06:00 PM"}
              </p>
            </div>

            <div className="rounded-3xl border border-primary/40 bg-primary p-6 text-white shadow-[0_10px_24px_rgba(36,91,167,0.25)] card-hover">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                Upcoming Leave
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {dashboard.nextLeaveRange || "15 Jun - 17 Jun"}
              </p>
              <p className="mt-2 text-white/80">
                {dashboard.nextLeaveStatus || "Approved"}
              </p>
            </div>

            <div className="rounded-3xl border border-primary/40 bg-primary p-6 text-white shadow-[0_10px_24px_rgba(36,91,167,0.25)] card-hover">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                Recent Notifications
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>{dashboard.notificationOne || "Task Assigned"}</li>
                <li>{dashboard.notificationTwo || "Leave Approved"}</li>
                <li>{dashboard.notificationThree || "Shift Updated"}</li>
              </ul>
            </div>
          </div>
        </div>
      </FadeIn>

    </div>
  );
};

export default EmployeeDashboard;
