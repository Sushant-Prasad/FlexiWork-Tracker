import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyTasks, updateTask } from "../../services/taskServices.js";
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

const getAllowedUpdates = (status) => {
  if (status === "TODO") return ["IN_PROGRESS"];
  if (status === "IN_PROGRESS") return ["TESTING"];
  if (status === "TESTING") return ["READY_FOR_REVIEW"];
  return [];
};

const normalizeTask = (task) => {
  return {
    id: task._id || task.id,
    title: task.title || "Untitled Task",
    description: task.description || "",
    projectName: task.project?.title || task.projectName || "",
    priority: task.priority || "MEDIUM",
    status: task.status || "TODO",
    statusLabel: STATUS_LABELS[task.status] || task.status,
    dueDate: task.dueDate || "",
    assignedByName: task.assignedBy?.name || task.assignedByName || "Manager",
    assignedDate: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "",
    notes: task.notes || "",
    allowedStatusUpdates: getAllowedUpdates(task.status),
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

  const tasks = useMemo(() => {
    const list = data?.data || data?.tasks || data || [];
    return list.map(normalizeTask);
  }, [data]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === "TODO").length;
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const completed = tasks.filter((task) => task.status === "DONE").length;

    return [
      { label: "Assigned Tasks", value: total },
      { label: "Pending Tasks", value: pending },
      { label: "In Progress", value: inProgress },
      { label: "Completed Tasks", value: completed },
    ];
  }, [tasks]);

  const progressPercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.status === "DONE").length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const activityItems = useMemo(() => {
    return tasks
      .slice(0, 3)
      .map((task) => ({
        id: task.id,
        label: `${task.title} • ${task.statusLabel}`,
      }));
  }, [tasks]);

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
          <TaskStats stats={stats} />

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
            <TaskActivity items={activityItems} />
          </div>
        </>
      )}

      <TaskDetailsModal
        task={activeTask}
        onClose={() => setActiveTask(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  );
};

export default MyTasks;
