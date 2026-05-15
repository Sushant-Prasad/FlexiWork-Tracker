// Calculate completion rate from a list of tasks
export const calculateCompletionRate = (tasks = []) => {
  const totalTasks = tasks.length;
  if (totalTasks === 0) return 0;

  const completed = tasks.filter((task) => task.status === "DONE").length;
  return (completed / totalTasks) * 100;
};

// Return tasks that are not completed yet
export const getPendingTasks = (tasks = []) => {
  return tasks.filter((task) => task.status !== "DONE");
};

// Calculate completed tasks per week for an employee
export const getWeeklyProductivity = (tasks = []) => {
  const completedTasks = tasks.filter((task) => task.status === "DONE" && task.completedAt);
  const buckets = new Map();

  for (const task of completedTasks) {
    const date = new Date(task.completedAt);
    const year = date.getUTCFullYear();
    const week = Math.ceil((((date - new Date(Date.UTC(year, 0, 1))) / 86400000) + 1) / 7);
    const key = `${year}-W${String(week).padStart(2, "0")}`;

    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return Array.from(buckets.entries()).map(([week, count]) => ({ week, count }));
};
