import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMyTasks,
  getTaskActivity,
  getTaskAnalytics,
  getTaskById,
  updateTask,
} from "../../services/taskServices.js";
import TaskActivity from "../../components/tasks/TaskActivity.jsx";
import TaskDetailsModal from "../../components/tasks/TaskDetailsModal.jsx";
import TaskFilters from "../../components/tasks/TaskFilters.jsx";
import TaskList from "../../components/tasks/TaskList.jsx";
import TaskProgress from "../../components/tasks/TaskProgress.jsx";
import TaskStats from "../../components/tasks/TaskStats.jsx";

const TOKEN_KEY = "flexiwork_token";

const STATUS_LABELS = {
  TODO: "Pending",
  IN_PROGRESS: "In Progress",
  TESTING: "Testing",
  READY_FOR_REVIEW: "Review",
  DONE: "Completed",
  CHANGES_REQUESTED: "Reopened",
};

const normalizeTask = (task) => {
  return {
    id: task._id || task.id,
    title: task.title || "Untitled Task",
    description: task.description || "",
    projectName: task.projectId?.title || task.project?.title || task.projectName || "",
    priority: task.priority || "MEDIUM",
    status: task.status || "TODO",
    statusLabel: STATUS_LABELS[task.status] || task.status,
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
    assignedByName: task.assignedBy?.name || task.assignedByName || "Manager",
    assignedDate: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "",
    notes: task.notes || "",
    allowedStatusUpdates: task.allowedStatusUpdates || [],
  };
};

const normalizeActivity = (activity) => {
  const actionLabel =
    activity.action === "TASK_ASSIGNED"
      ? "Assigned"
      : activity.action === "STATUS_UPDATED"
        ? "Status updated"
        : activity.action?.replace(/_/g, " ") || "Activity";

  return {
    id: activity.id || `${activity.task}-${activity.createdAt}`,
    label: `${actionLabel}: ${activity.task}`,
  };
};

const MyTasks = () => {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["employee-tasks"],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return getMyTasks(token);
    },
  });

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["employee-task-analytics"],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return getTaskAnalytics(token);
    },
  });

  const {
    data: activityData,
    isLoading: isActivityLoading,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: ["employee-task-activity"],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return getTaskActivity(token);
    },
  });

  const { data: taskDetailsData, isFetching: isTaskDetailsLoading } = useQuery({
    queryKey: ["employee-task-details", activeTask?.id],
    enabled: Boolean(activeTask?.id),
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Authentication token missing.");
      return getTaskById(activeTask.id, token);
    },
  });

  const tasks = useMemo(() => {
    const list = data?.data || data?.tasks || data || [];
    return list.map(normalizeTask);
  }, [data]);

  const fallbackAnalytics = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "DONE").length;

    return {
      assigned: total,
      todo: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      testing: tasks.filter((task) => task.status === "TESTING").length,
      review: tasks.filter((task) => task.status === "READY_FOR_REVIEW").length,
      done,
      completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [tasks]);

  const analytics = analyticsData?.data || fallbackAnalytics;

  const stats = useMemo(() => {
    return [
      { label: "Assigned Tasks", value: analytics.assigned },
      { label: "Pending Tasks", value: analytics.todo },
      { label: "In Progress", value: analytics.inProgress },
      { label: "Completed Tasks", value: analytics.done },
    ];
  }, [analytics]);

  const progressPercent = analytics.completionRate || 0;

  const activityItems = useMemo(() => {
    const activity = activityData?.data || [];
    if (activity.length > 0) return activity.map(normalizeActivity);

    return tasks.slice(0, 3).map((task) => ({
      id: task.id,
      label: `${task.title} - ${task.statusLabel}`,
    }));
  }, [activityData, tasks]);

  const detailedTask = useMemo(() => {
    const detail = taskDetailsData?.data;
    return detail ? normalizeTask(detail) : activeTask;
  }, [activeTask, taskDetailsData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesFilter =
        filter === "ALL" ||
        (filter === "REVIEW" && task.status === "READY_FOR_REVIEW") ||
        task.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const handleUpdateStatus = async (task, nextStatus) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    await updateTask(task.id, { status: nextStatus }, token);
    setActiveTask(null);
    refetch();
    refetchAnalytics();
    refetchActivity();
  };

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Tasks</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track assignments, update progress, and stay aligned with reviews.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          Loading tasks...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-destructive">
          Failed to load tasks.
        </div>
      ) : (
        <>
          <TaskStats stats={stats} isLoading={isAnalyticsLoading && tasks.length === 0} />

          <div className="rounded-2xl border border-border bg-card p-6">
            <TaskFilters
              activeFilter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          <TaskList tasks={filteredTasks} onOpenTask={setActiveTask} />

          <div className="grid gap-6 lg:grid-cols-2">
            <TaskProgress percent={progressPercent} />
            <TaskActivity
              items={activityItems}
              isLoading={isActivityLoading && tasks.length === 0}
            />
          </div>
        </>
      )}

      <TaskDetailsModal
        task={detailedTask}
        isLoading={isTaskDetailsLoading}
        onClose={() => setActiveTask(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  );
};

export default MyTasks;
