const TaskCard = ({ task, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
          {task.priority}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Project: {task.projectName || "Unassigned"}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>Status: {task.statusLabel}</span>
        <span>Due: {task.dueDate || "N/A"}</span>
        <span>Assigned By: {task.assignedByName || "Manager"}</span>
      </div>
    </button>
  );
};

export default TaskCard;
