// Calculate project progress metrics from task list
export const calculateProjectProgress = (tasks = []) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;
  const pendingTasks = tasks.filter((task) => task.status !== "DONE").length;

  const completionPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPct,
  };
};
